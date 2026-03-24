const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

if (!resend) {
  console.warn('RESEND_API_KEY is missing. Email service will be disabled.');
}

const sendEmail = async (to, subject, html) => {
  try {
    if (!resend) {
      console.log(`Mock Email sent to ${to}: ${subject}`);
      return { success: true, data: { status: 'mocked' } };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Golf Charity <noreply@golfcharity.com>',
      to,
      subject,
      html
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email service error:', err);
    return { success: false, error: err.message };
  }
};

module.exports = { sendEmail };
