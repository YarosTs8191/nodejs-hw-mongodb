import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } =
  process.env;

console.log('SMTP ENV:', {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
});

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendResetPasswordEmail = async (to, resetLink) => {
  const mailOptions = {
    from: SMTP_FROM,
    to,
    subject: 'Reset your password',
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password (valid for 5 minutes):</p>
      <a href="${resetLink}">${resetLink}</a>
    `,
  };
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email send result:', result); // Лог для успіху
    return result;
  } catch (err) {
    console.error('Nodemailer error:', err); // Лог для фейлу
    throw err;
  }
};
