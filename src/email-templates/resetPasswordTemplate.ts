export function resetPasswordTemplate(fullName: string, resetUrl: string) {
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
                
                <img src="${process.env.DOMAIN}/logo.webp" width="70" style="margin-bottom:15px;" />

                <h1 style="margin:0;font-size:26px;color:white;font-weight:600;">
                  Resumify
                </h1>

                <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">
                  Password Reset Request
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
                  We received a request to reset your password. Click the button below to set a new password.
                </p>

                <!-- 🔐 CTA -->
                <div style="text-align:center;margin-bottom:30px;">
                  <a href="${resetUrl}" 
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
                     Reset Password
                  </a>
                </div>

                <p style="font-size:13px;color:#6b7280;margin-bottom:20px;text-align:center;">
                  This link will expire in <strong>10 minutes</strong>.
                </p>

                <!-- ⚠️ Security -->
                <div style="background:#ecfdf5;border-left:4px solid #16a34a;padding:15px;border-radius:8px;margin-bottom:25px;">
                  <p style="margin:0;font-size:13px;color:#065f46;">
                    If you didn’t request this, you can safely ignore this email.
                  </p>
                </div>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:25px 40px;text-align:center;">
                <p style="font-size:12px;color:#9ca3af;">
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
