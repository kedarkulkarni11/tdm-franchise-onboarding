// Email notification utility
// This creates the email content for the Gmail MCP tool or falls back to mailto
export function buildNotificationEmail(recipientEmail, recipientName, appId) {
  const trackingUrl = `${window.location.origin}${window.location.pathname}#/dashboard/${appId}`;

  const subject = `The Detailing Mafia — Franchise Application Received (${appId})`;

  const htmlBody = `
<div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
  <div style="background: #111827; padding: 32px; text-align: center;">
    <h1 style="color: #ffffff; font-size: 24px; margin: 0;">THE DETAILING MAFIA</h1>
    <p style="color: #9CA3AF; font-size: 12px; letter-spacing: 2px; margin: 4px 0 0;">FRANCHISE DIVISION</p>
  </div>

  <div style="padding: 32px;">
    <h2 style="color: #111827; font-size: 20px; margin: 0 0 16px;">Welcome, ${recipientName}!</h2>
    <p style="color: #6B7280; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      Thank you for your interest in becoming a Detailing Mafia franchise partner. Your application has been successfully received and is now being reviewed by our team.
    </p>

    <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
      <p style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px;">Your Application ID</p>
      <p style="color: #B91C1C; font-size: 24px; font-weight: 700; font-family: monospace; margin: 0;">${appId}</p>
      <p style="color: #9CA3AF; font-size: 12px; margin: 8px 0 0;">Keep this ID safe — you'll need it to track your progress</p>
    </div>

    <div style="text-align: center; margin: 0 0 24px;">
      <a href="${trackingUrl}" style="display: inline-block; background: #B91C1C; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 15px;">
        Track Your Application
      </a>
    </div>

    <h3 style="color: #111827; font-size: 16px; margin: 32px 0 12px;">What happens next?</h3>
    <ol style="color: #6B7280; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
      <li>Our Regional Sales Manager will contact you within 24 hours</li>
      <li>You'll receive the Franchise Evaluation Form</li>
      <li>A video call will be scheduled to discuss the opportunity</li>
      <li>You'll be invited to visit our Head Office & Experience Centre</li>
    </ol>
  </div>

  <div style="background: #F9FAFB; padding: 24px 32px; border-top: 1px solid #E5E7EB;">
    <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
      The Detailing Mafia Franchise Division<br>
      Built on Excellence. Scaled on Systems.
    </p>
  </div>
</div>`;

  const textBody = `Welcome, ${recipientName}!

Thank you for your interest in becoming a Detailing Mafia franchise partner. Your application has been successfully received.

Your Application ID: ${appId}

Track your application: ${trackingUrl}

What happens next:
1. Our Regional Sales Manager will contact you within 24 hours
2. You'll receive the Franchise Evaluation Form
3. A video call will be scheduled to discuss the opportunity
4. You'll be invited to visit our Head Office & Experience Centre

— The Detailing Mafia Franchise Division`;

  return { subject, htmlBody, textBody, trackingUrl };
}

export function buildStepUpdateEmail(recipientEmail, recipientName, appId, stepTitle, stepNum, totalSteps) {
  const trackingUrl = `${window.location.origin}${window.location.pathname}#/dashboard/${appId}`;
  const progress = Math.round((stepNum / totalSteps) * 100);

  const subject = `TDM Franchise — Step Completed: ${stepTitle} (${appId})`;

  const textBody = `Hi ${recipientName},

Your franchise application (${appId}) has been updated.

Step Completed: ${stepTitle} (Step ${stepNum} of ${totalSteps})
Overall Progress: ${progress}%

Track your application: ${trackingUrl}

— The Detailing Mafia Franchise Division`;

  return { subject, textBody, trackingUrl };
}
