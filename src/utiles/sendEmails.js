import nodemailer from "nodemailer";

export async function sendEmails({ to, subject, html, attachments = [] }) {
  const transporter = nodemailer.createTransport({
    host: "local host",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: "eng.amrabdelwahab02@gmail.com",
      pass: "tcmx ojqq yowa iwvy",
    },
  });
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <eng.amrabdelwahab02@gmail.com>',
    to,
    subject,
    html,
    attachments,
  });
  if (info.accepted.length > 0) return true;
  return false;
 
}
