
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('❌ No authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Set the auth token
    supabase.auth.setAuth(authHeader.replace('Bearer ', ''));

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('❌ Invalid user token:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if user is admin
    const { data: userData, error: roleError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (roleError || userData?.role !== 'admin') {
      console.log('❌ Access denied - not admin:', roleError, userData);
      
      // Log unauthorized access attempt
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'unauthorized_admin_access_attempt',
        resource_type: 'admin_api',
        details: { 
          endpoint: new URL(req.url).pathname,
          user_role: userData?.role || 'unknown'
        },
        user_agent: req.headers.get('User-Agent'),
      });

      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const url = new URL(req.url);
    const path = url.pathname.replace('/admin-api', '');
    
    // Log the admin API access
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: `admin_api_${req.method.toLowerCase()}`,
      resource_type: 'admin_api',
      details: { 
        endpoint: path,
        method: req.method
      },
      user_agent: req.headers.get('User-Agent'),
    });

    // Route to different endpoints
    switch (path) {
      case '/users':
        return await handleUsers(req, supabase, user.id);
      case '/bookings':
        return await handleBookings(req, supabase, user.id);
      case '/stats':
        return await handleStats(req, supabase, user.id);
      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { 
            status: 404, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
    }

  } catch (error) {
    console.error('💥 Admin API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleUsers(req: Request, supabase: any, adminUserId: string) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching users:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function handleBookings(req: Request, supabase: any, adminUserId: string) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users!bookings_user_id_fkey(name, email),
        services(name, price)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching bookings:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch bookings' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (req.method === 'PATCH') {
    const body = await req.json();
    const { bookingId, status, notes } = body;

    if (!bookingId) {
      return new Response(
        JSON.stringify({ error: 'Booking ID required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.internal_notes = notes;

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating booking:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update booking' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log the booking update
    await supabase.from('audit_logs').insert({
      user_id: adminUserId,
      action: 'update_booking',
      resource_type: 'booking',
      resource_id: bookingId,
      details: updateData
    });

    return new Response(
      JSON.stringify({ data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function handleStats(req: Request, supabase: any, adminUserId: string) {
  if (req.method === 'GET') {
    try {
      // Get various stats in parallel
      const [usersResult, bookingsResult, revenueResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id', { count: 'exact' }),
        supabase.from('bookings').select('services(price)').eq('status', 'confirmed')
      ]);

      const totalUsers = usersResult.count || 0;
      const totalBookings = bookingsResult.count || 0;
      const totalRevenue = revenueResult.data?.reduce((sum: number, booking: any) => {
        return sum + (booking.services?.price || 0);
      }, 0) || 0;

      const stats = {
        totalUsers,
        totalBookings,
        totalRevenue,
        averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0
      };

      return new Response(
        JSON.stringify({ data: stats }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch stats' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { 
      status: 405, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
