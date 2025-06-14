
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, name, phone, source } = await req.json()

    if (!email || !name) {
      return new Response(JSON.stringify({ error: 'Email and name are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Invite user by email. This creates an auth.users entry and sends an invitation link.
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        name: name,
        phone: phone,
      },
    })

    if (error) {
      if (error.message.includes('User already registered')) {
        return new Response(JSON.stringify({ error: 'Een gebruiker met dit e-mailadres bestaat al.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409,
        })
      }
      throw error
    }
    
    // After invite, user is in auth.users, and trigger has run to create public.users row.
    // Now update the acquisition_source in public.users
    const newUserId = data.user.id;
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ acquisition_source: source })
      .eq('id', newUserId);
    
    if (updateError) {
      // Log this, but don't fail the whole process for it
      console.error(`Failed to update acquisition_source for user ${newUserId}:`, updateError);
    }

    return new Response(JSON.stringify({ user: data.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in create-client-from-prospect function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
