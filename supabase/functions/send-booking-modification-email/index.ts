
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingModificationRequest {
  bookingId: string;
  modificationType: 'status_change' | 'reschedule' | 'cancellation';
  newStatus?: string;
  newDateTime?: string;
  reason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId, modificationType, newStatus, newDateTime, reason }: BookingModificationRequest = await req.json();

    // Get booking and user details from Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    const bookingResponse = await fetch(`${supabaseUrl}/rest/v1/bookings?id=eq.${bookingId}&select=*,user:users(name,email),service:services(name,price,duration)`, {
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      }
    });

    const bookings = await bookingResponse.json();
    const booking = bookings[0];

    if (!booking) {
      throw new Error('Booking not found');
    }

    let subject = '';
    let htmlContent = '';

    switch (modificationType) {
      case 'status_change':
        subject = `Booking Status Update - ${booking.service.name}`;
        htmlContent = `
          <h2>Booking Status Update</h2>
          <p>Dear ${booking.user.name},</p>
          <p>Your booking status has been updated:</p>
          <ul>
            <li><strong>Service:</strong> ${booking.service.name}</li>
            <li><strong>Date & Time:</strong> ${new Date(booking.date_time).toLocaleString('nl-NL')}</li>
            <li><strong>New Status:</strong> ${newStatus}</li>
            ${reason ? `<li><strong>Reason:</strong> ${reason}</li>` : ''}
          </ul>
          <p>If you have any questions, please contact us.</p>
          <p>Best regards,<br>DO THE WORK Team</p>
        `;
        break;

      case 'reschedule':
        subject = `Booking Rescheduled - ${booking.service.name}`;
        htmlContent = `
          <h2>Booking Rescheduled</h2>
          <p>Dear ${booking.user.name},</p>
          <p>Your booking has been rescheduled:</p>
          <ul>
            <li><strong>Service:</strong> ${booking.service.name}</li>
            <li><strong>Original Date:</strong> ${new Date(booking.date_time).toLocaleString('nl-NL')}</li>
            <li><strong>New Date:</strong> ${newDateTime ? new Date(newDateTime).toLocaleString('nl-NL') : 'TBD'}</li>
            ${reason ? `<li><strong>Reason:</strong> ${reason}</li>` : ''}
          </ul>
          <p>Please save the new date and time in your calendar.</p>
          <p>Best regards,<br>DO THE WORK Team</p>
        `;
        break;

      case 'cancellation':
        subject = `Booking Cancelled - ${booking.service.name}`;
        htmlContent = `
          <h2>Booking Cancelled</h2>
          <p>Dear ${booking.user.name},</p>
          <p>Your booking has been cancelled:</p>
          <ul>
            <li><strong>Service:</strong> ${booking.service.name}</li>
            <li><strong>Date & Time:</strong> ${new Date(booking.date_time).toLocaleString('nl-NL')}</li>
            ${reason ? `<li><strong>Reason:</strong> ${reason}</li>` : ''}
          </ul>
          <p>If you would like to reschedule, please contact us or book a new appointment.</p>
          <p>Best regards,<br>DO THE WORK Team</p>
        `;
        break;
    }

    const emailResponse = await resend.emails.send({
      from: "DO THE WORK <bookings@dothework.nl>",
      to: [booking.user.email],
      subject: subject,
      html: htmlContent,
    });

    console.log("Booking modification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-booking-modification-email function:", error);
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
