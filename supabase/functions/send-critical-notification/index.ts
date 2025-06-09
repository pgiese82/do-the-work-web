
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CriticalNotificationRequest {
  notification: {
    id: string;
    type: string;
    priority: string;
    title: string;
    message: string;
    created_at: string;
    metadata?: any;
  };
  adminEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notification, adminEmail }: CriticalNotificationRequest = await req.json();

    console.log('Sending critical notification email:', {
      type: notification.type,
      priority: notification.priority,
      to: adminEmail
    });

    const emailSubject = `🚨 CRITICAL: ${notification.title}`;
    
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚨 CRITICAL NOTIFICATION</h1>
        </div>
        
        <div style="background-color: #f9fafb; padding: 30px; border-left: 4px solid #dc2626;">
          <h2 style="color: #dc2626; margin-top: 0;">${notification.title}</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #374151;">
            ${notification.message}
          </p>
          
          <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Notification Details:</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
              <li><strong>Type:</strong> ${notification.type.replace('_', ' ').toUpperCase()}</li>
              <li><strong>Priority:</strong> ${notification.priority.toUpperCase()}</li>
              <li><strong>Time:</strong> ${new Date(notification.created_at).toLocaleString()}</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${Deno.env.get('SUPABASE_URL')?.replace('https://', 'https://').replace('.supabase.co', '.lovable.app')}/admin/notifications" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View in Admin Panel
            </a>
          </div>
        </div>
        
        <div style="background-color: #374151; color: #9ca3af; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">
            This is an automated critical alert from DO THE WORK Admin System.<br>
            Please take immediate action to resolve this issue.
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "DO THE WORK Admin <admin@resend.dev>",
      to: [adminEmail],
      subject: emailSubject,
      html: emailHTML,
    });

    console.log("Critical notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending critical notification email:", error);
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
