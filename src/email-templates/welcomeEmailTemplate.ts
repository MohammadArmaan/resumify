export function welcomeEmailTemplate(fullName: string) {
    const domain = process.env.DOMAIN;

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>

  <body style="background:#f0fdf4;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;box-shadow:0 6px 30px rgba(0,0,0,0.08);overflow:hidden;">
            
            <!-- 🌿 Header -->
            <tr>
              <td style="background:linear-gradient(135deg, #16a34a, #22c55e);text-align:center;padding:40px;">
                
                <img src="/logo.webp" width="70" style="margin-bottom:15px;" />

                <h1 style="margin:0;font-size:26px;color:white;font-weight:600;">
                  Welcome to Resumify 🚀
                </h1>

                <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">
                  Build smarter resumes with AI
                </p>
              </td>
            </tr>

            <!-- 📩 Content -->
            <tr>
              <td style="padding:45px 50px;">
                
                <h2 style="margin:0 0 12px;font-size:22px;color:#111827;">
                  Hi ${fullName},
                </h2>

                <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:25px;">
                  You're all set! Your account has been successfully created.
                </p>

                <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-bottom:30px;">
                  With <strong style="color:#16a34a;">Resumify</strong>, you can:
                </p>

                <!-- ✨ Features -->
                <ul style="padding-left:18px;color:#374151;font-size:14px;line-height:1.8;margin-bottom:35px;">
                  <li>Generate AI-powered resumes in minutes</li>
                  <li>Improve your ATS score instantly</li>
                  <li>Match resumes with job descriptions</li>
                  <li>Create professional cover letters</li>
                </ul>

                <!-- 🚀 CTA -->
                <div style="text-align:center;margin-bottom:35px;">
                  <a href="${domain}" 
                     style="
                        display:inline-block;
                        background:#16a34a;
                        color:white;
                        padding:14px 28px;
                        border-radius:10px;
                        text-decoration:none;
                        font-weight:600;
                        font-size:14px;
                        box-shadow:0 4px 14px rgba(22,163,74,0.3);
                     ">
                     Start Building Your Resume
                  </a>
                </div>

                <!-- 💡 Tip -->
                <div style="background:#ecfdf5;border-left:4px solid #16a34a;padding:15px;border-radius:8px;margin-bottom:25px;">
                  <p style="margin:0;font-size:13px;color:#065f46;">
                    <strong>Pro Tip:</strong> Start with your latest job role for best AI results.
                  </p>
                </div>

                <p style="font-size:13px;color:#9ca3af;text-align:center;">
                  Need help? We're here for you.
                </p>

              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 40px;">
                <div style="height:1px;background:#e5e7eb;"></div>
              </td>
            </tr>

            <!-- 📎 Footer -->
            <tr>
              <td style="padding:25px 40px;text-align:center;">
                
                <p style="margin:0 0 10px;font-size:13px;color:#6b7280;">
                  Support
                </p>

                <a href="${process.env.GMAIL_EMAIL}" 
                   style="color:#16a34a;text-decoration:none;font-size:14px;font-weight:500;">
                 ${process.env.GMAIL_EMAIL}
                </a>

                <p style="margin-top:15px;font-size:12px;color:#9ca3af;">
                  © ${new Date().getFullYear()} Resumify. All rights reserved.
                </p>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
</html>`;
}
