
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReceiptRequest {
  bookingId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId }: ReceiptRequest = await req.json();

    // Get booking details
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services (name, duration, price),
        users (name, email)
      `)
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      throw new Error('Booking not found');
    }

    const bookingDate = new Date(booking.date_time).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Generate simple text receipt (in production, you'd use a PDF library)
    const receiptContent = `
FITNESS STUDIO RECEIPT
=====================

Receipt #: ${booking.id}
Date: ${new Date().toLocaleDateString()}

Client Information:
Name: ${booking.users.name}
Email: ${booking.users.email}

Service Details:
Service: ${booking.services.name}
Duration: ${booking.services.duration} minutes
Date & Time: ${bookingDate}

Payment Information:
Amount: €${booking.services.price}
Status: ${booking.payment_status}

Thank you for choosing our fitness studio!
    `;

    return new Response(receiptContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": `attachment; filename="receipt-${bookingId}.txt"`,
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error generating receipt:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
