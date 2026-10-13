export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Transactional email service using Resend or fallback logger
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || 'RAS Properties <noreply@rasproperties.in>';

  if (apiKey && apiKey.startsWith('re_')) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to,
          subject,
          html,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        return { success: true, id: data.id };
      }
      console.warn('Resend email error:', data);
    } catch (error) {
      console.error('Failed to send email via Resend:', error);
    }
  }

  // Development fallback: Log email output cleanly
  console.log('-----------------------------------------');
  console.log(`[EMAIL DISPATCH] To: ${to} | Subject: ${subject}`);
  console.log('-----------------------------------------');
  return { success: true, id: `mock-${Date.now()}` };
}

export function emailTemplateWrapper(title: string, contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
          .header { background: #0A1E3F; padding: 28px 24px; text-align: center; }
          .header h1 { color: #f59e0b; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px; }
          .tagline { color: #94a3b8; font-size: 13px; margin-top: 4px; }
          .body { padding: 32px 24px; line-height: 1.6; }
          .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
          .button { display: inline-block; background: #026ac9; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 16px; }
          .highlight { background: #f0fdf4; border-left: 4px solid #10b981; padding: 12px; margin: 16px 0; border-radius: 4px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>RAS PROPERTIES</h1>
            <div class="tagline">Your Trusted Partner in Real Estate</div>
          </div>
          <div class="body">
            <h2 style="color: #0f172a; margin-top: 0;">${title}</h2>
            ${contentHtml}
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} RAS Properties. All rights reserved.</p>
            <p>Noida, Greater Noida, Ghaziabad, Delhi NCR, India</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
