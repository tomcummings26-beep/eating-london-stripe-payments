// src/lib/sendPurchaseConfirmation.ts
import sgMail from '@sendgrid/mail'

// ✅ Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const templateHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>eating.london — Credit Confirmation</title>
</head>
<body style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 32px;">
  <table width="100%" style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px;">
    <tr>
      <td align="center">
        <img src="https://raw.githubusercontent.com/tomcummings26-beep/eating-london-assets/main/eating-london.png" alt="Eating London" width="160" style="margin-bottom: 24px;" />
        <h2 style="margin: 0 0 12px 0;">Thank you for your purchase 🎉</h2>
        <p style="margin: 0 0 16px 0; color: #666;">
          Your alert credits have now been <strong>added to your account</strong>.
        </p>
        <p style="font-size: 16px; margin: 0 0 24px 0;">
          You now have <strong>{{credits}}</strong> available credit{{pluralS}}.
        </p>
        <a href="https://app.eating.london/dashboard"
          style="background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block; margin-bottom: 12px;">
          View My Dashboard
        </a>
      </td>
    </tr>
  </table>
</body>
</html>
`

export async function sendPurchaseConfirmation(email: string, credits: number) {
  try {
    const html = templateHtml
      .replace('{{credits}}', credits.toString())
      .replace('{{pluralS}}', credits > 1 ? 's' : '')

    await sgMail.send({
      to: email,
      from: 'alerts@eating.london', // ✅ verified sender in SendGrid
      subject: '🎉 Your eating.london credits are now active',
      html,
    })

    console.log(`📧 Purchase confirmation email sent to ${email}`)
  } catch (err: any) {
    console.error('⚠️ Failed to send SendGrid confirmation email:', err.message)
  }
}
