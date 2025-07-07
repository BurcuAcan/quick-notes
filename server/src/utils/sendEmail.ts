import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const sendEmail = async (options: EmailOptions) => {
  const msg = {
    to: options.to,
    from: process.env.EMAIL_FROM || 'test@example.com', // Your verified SendGrid sender
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error: any) {
    console.error('Error sending email:', error.response?.body || error);
  }
};

export default sendEmail;
