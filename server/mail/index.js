import nodemailer from "nodemailer";

// create transporter
let mail;

export async function mailInit() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();
  mail = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });
}

export async function sendEmail({
  from = "hari.mahat@hari.dev",
  to = "info@hari.dev",
  subject,
  text,
  html,
}) {
  try {
    // send mail with defined transport object
    let info = await mail.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log("Message sent: %s", info);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {}
}
