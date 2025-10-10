import fs from 'fs'
import path from 'path'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendPurchaseConfirmation(email: string, credits: number) {
  const templatePath = path.join(process.cwd(), 'src/app/emails/purchaseConfirmation.html')
  let html = fs.readFileSync(templatePath, 'utf8')

  // simple replacements
  html = html
    .replace('{{credits}}', credits.toString())
    .replace('{{pluralS}}', credits > 1 ? 's' : '')

  const msg = {
    to: email,
    from: 'alerts@eating.london',
    subject: '🎉 Your eating.london credits are now active',
    html,
  }

  await sgMail.send(msg)
}
