
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  to: string;
  message: string;
  bookingId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, message, bookingId }: SMSRequest = await req.json();

    // This is a placeholder for SMS integration
    // You would integrate with services like Twilio, MessageBird, or similar
    console.log("SMS would be sent to:", to, "Message:", message, "Booking:", bookingId);

    // Simulate SMS sending
    const smsResponse = {
      success: true,
      messageId: `sms_${Date.now()}`,
      to: to,
      message: message,
    };

    return new Response(JSON.stringify(smsResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-sms function:", error);
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
