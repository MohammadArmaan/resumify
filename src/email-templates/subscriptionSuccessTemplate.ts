type SubscriptionEmailProps = {
    fullName: string;
    plan: "MONTHLY" | "YEARLY";
    pricing: "RECOMMENDED" | "ENTERPRISE";
    expiry: Date;
    uuid: string;
};

export function subscriptionSuccessTemplate({
    fullName,
    plan,
    pricing,
    expiry,
    uuid,
}: SubscriptionEmailProps) {
    return `
    <div style="font-family: Arial, sans-serif; background:#f0fdf4; padding:20px;">
        <div style="max-width:600px; margin:auto; background:white; border-radius:10px; padding:24px; border:1px solid #bbf7d0;">
            
            <h2 style="color:#16a34a; margin-bottom:10px;">
                🎉 Subscription Activated!
            </h2>

            <p style="color:#374151; font-size:14px;">
                Hi <strong>${fullName}</strong>,
            </p>

            <p style="color:#374151; font-size:14px;">
                Your subscription has been successfully activated. You're now enjoying premium features 🚀
            </p>

            <div style="margin:20px 0; padding:16px; background:#ecfdf5; border-radius:8px; border:1px solid #bbf7d0;">
                <p style="margin:6px 0;"><strong>Plan:</strong> ${pricing}</p>
                <p style="margin:6px 0;"><strong>Billing:</strong> ${plan}</p>
                <p style="margin:6px 0;"><strong>Valid Until:</strong> ${expiry.toDateString()}</p>
                <p style="margin:6px 0;"><strong>Subscription ID:</strong> ${uuid}</p>
            </div>

            <p style="color:#374151; font-size:14px;">
                📄 Your invoice is attached with this email for your records.
            </p>

            <p style="color:#374151; font-size:14px;">
                If you have any questions, feel free to reach out to our support team anytime.
            </p>

            <div style="margin-top:24px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
                   style="display:inline-block; padding:10px 16px; background:#16a34a; color:white; text-decoration:none; border-radius:6px; font-size:14px;">
                   Go to Dashboard
                </a>
            </div>

            <p style="margin-top:30px; font-size:12px; color:#6b7280;">
                Thank you for choosing us 💚
            </p>

        </div>
    </div>
    `;
}