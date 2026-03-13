import emailjs from '@emailjs/browser';

// EmailJS configuration — set these in your .env file:
//   VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
//   VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
//   VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

/**
 * Send application confirmation email to applicant
 */
export async function sendApplicationConfirmationEmail({ fullName, email, appId, city, state }) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    console.warn('EmailJS not configured — skipping email send. Set VITE_EMAILJS_* env vars.');
    return { success: false, reason: 'not_configured' };
  }

  const dashboardUrl = `${window.location.origin}${window.location.pathname}#/dashboard/${appId}`;

  const templateParams = {
    to_name: fullName,
    to_email: email,
    app_id: appId,
    city: city || 'N/A',
    state: state || 'N/A',
    dashboard_url: dashboardUrl,
    from_name: 'The Detailing Mafia',
  };

  try {
    const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    console.log('Email sent successfully:', result.text);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, reason: 'send_failed', error };
  }
}
