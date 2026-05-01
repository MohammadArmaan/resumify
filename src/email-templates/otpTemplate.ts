export function otpEmailTemplate(otp: string) {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="background:#f0fdf4;padding:0;margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          
          <table width="600" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;box-shadow:0 6px 30px rgba(0,0,0,0.08);overflow:hidden;">
            
            <!-- 🌿 Header -->
            <tr>
              <td style="background:linear-gradient(135deg, #16a34a, #22c55e);text-align:center;padding:40px;">
                
                <img src="/logo.webp" width="70" style="margin-bottom:15px;" />

                <h1 style="margin:0;font-size:26px;color:white;font-weight:600;">
                  Resumify
                </h1>

                <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">
                  AI Resume Builder
                </p>
              </td>
            </tr>

            <!-- 📩 Content -->
            <tr>
              <td style="padding:45px 50px;">
                
                <h2 style="margin:0 0 12px;font-size:22px;color:#111827;">
                  Verify your email
                </h2>

                <p style="font-size:14px;color:#6b7280;margin-bottom:30px;">
                  Enter the code below to activate your Resumify account and start building AI-powered resumes.
                </p>

                <!-- 🔢 OTP Box -->
                <div style="background:#f0fdf4;border:2px dashed #bbf7d0;border-radius:12px;padding:30px;text-align:center;margin-bottom:30px;">
                  
                  <p style="font-size:12px;color:#16a34a;font-weight:600;letter-spacing:1px;margin-bottom:15px;">
                    VERIFICATION CODE
                  </p>

                  <div style="font-size:34px;font-weight:700;letter-spacing:10px;color:#16a34a;font-family:monospace;">
                    ${otp}
                  </div>

                  <p style="margin-top:15px;font-size:12px;color:#6b7280;">
                    Expires in 10 minutes
                  </p>
                </div>

                <!-- ⚠️ Security -->
                <div style="background:#ecfdf5;border-left:4px solid #16a34a;padding:15px;border-radius:8px;margin-bottom:25px;">
                  <p style="margin:0;font-size:13px;color:#065f46;">
                    <strong>Security Tip:</strong> Never share this code with anyone.
                  </p>
                </div>

                <p style="font-size:13px;color:#9ca3af;text-align:center;">
                  Didn’t request this? You can safely ignore this email.
                </p>

              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 40px;">
                <div style="height:1px;background:#e5e7eb;"></div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:25px 40px;text-align:center;">
                
                <p style="margin:0 0 10px;font-size:13px;color:#6b7280;">
                  Need help?
                </p>

                <a href="${process.env.GMAIL_EMAIL}" style="color:#16a34a;text-decoration:none;font-size:14px;font-weight:500;">
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
