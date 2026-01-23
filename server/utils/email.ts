import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    console.log(apiKey);

    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not defined");
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendVerificationEmail(email: string, token: string) {
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}`;

  await getResend().emails.send({
    from: process.env.EMAIL_FROM || "noreply@flipmashirt.com",
    to: email,
    subject: "FlipMaShirt email verification",
    html: `
      <h1>Welcome to FlipMaShirt!</h1>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verifyUrl}">Verify Email</a>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create an account, you can ignore this email.</p>
    `,
  });
}
