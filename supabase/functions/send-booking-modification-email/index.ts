
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ModificationEmailRequest {
  bookingId: string;
  modificationType: 'reschedule' | 'cancel';
  reason: string;
  newDateTime?: string;
  refundAmount?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, modificationType, reason, newDateTime, refundAmount }: ModificationEmailRequest = await req.json();

    // Get booking details and user information
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        services (name, duration, price),
        users (name, email)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
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

    const newDate = newDateTime ? new Date(newDateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '';

    // Email to client
    const clientSubject = modificationType === 'reschedule' ? 
      'Reschedule Request Submitted' : 'Cancellation Request Submitted';
    
    const clientHtml = `
      <h1>${clientSubject}</h1>
      <p>Dear ${booking.users.name},</p>
      <p>We have received your ${modificationType} request for the following booking:</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <strong>Service:</strong> ${booking.services.name}<br>
        <strong>Original Date:</strong> ${bookingDate}<br>
        ${modificationType === 'reschedule' ? `<strong>Requested New Date:</strong> ${newDate}<br>` : ''}
        <strong>Reason:</strong> ${reason}<br>
        ${modificationType === 'cancel' && refundAmount ? `<strong>Refund Amount:</strong> €${refundAmount}<br>` : ''}
      </div>
      
      <p>Your request is currently pending approval. We will notify you once it has been reviewed.</p>
      
      <p>If you have any questions, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>Your Fitness Team</p>
    `;

    // Email to trainer/admin
    const adminSubject = `${modificationType === 'reschedule' ? 'Reschedule' : 'Cancellation'} Request - ${booking.services.name}`;
    
    const adminHtml = `
      <h1>New ${modificationType === 'reschedule' ? 'Reschedule' : 'Cancellation'} Request</h1>
      <p>A client has requested to ${modificationType} their booking:</p>
      
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <strong>Client:</strong> ${booking.users.name} (${booking.users.email})<br>
        <strong>Service:</strong> ${booking.services.name}<br>
        <strong>Original Date:</strong> ${bookingDate}<br>
        ${modificationType === 'reschedule' ? `<strong>Requested New Date:</strong> ${newDate}<br>` : ''}
        <strong>Reason:</strong> ${reason}<br>
        ${modificationType === 'cancel' && refundAmount ? `<strong>Refund Amount:</strong> €${refundAmount}<br>` : ''}
      </div>
      
      <p>Please review this request in your admin dashboard.</p>
      
      <p><strong>Action Required:</strong> Approve or reject this ${modificationType} request.</p>
    `;

    // Send email to client
    await resend.emails.send({
      from: "Fitness Studio <noreply@yourdomain.com>",
      to: [booking.users.email],
      subject: clientSubject,
      html: clientHtml,
    });

    // Send email to trainer/admin
    await resend.emails.send({
      from: "Fitness Studio <noreply@yourdomain.com>",
      to: ["trainer@yourdomain.com"], // Replace with actual trainer email
      subject: adminSubject,
      html: adminHtml,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending modification email:", error);
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
