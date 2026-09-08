// // const nodemailer = require('nodemailer');
// const { Resend } = require('resend');

// // transporter vo action hota hai jo humare email ko send(share) krta hai sbhi jgh
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     // type: 'OAuth2',
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//     // clientId: process.env.CLIENT_ID,
//     // clientSecret: process.env.CLIENT_SECRET,
//     // refreshToken: process.env.REFRESH_TOKEN,
//   },
// });

// // Verify the connection configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('Error connecting to email server:', error);
//   } else {
//     console.log('Email server is ready to send messages');
//   }
// });

// // Function to send email
// const sendEmail = async (to, subject, text, html) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
//       to, // list of receivers
//       subject, // Subject line
//       text, // plain text body
//       html, // html body
//     });

//     console.log('Message sent: %s', info.messageId);
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

// // sendEmail("jatinrajoria14@gmail.com", "Test Subject", "This is a test email", "<b>This is a test email</b>");

// module.exports = { sendEmail };



// const nodemailer = require('nodemailer');
const { Resend } = require('resend');

// Resend email service
const resend = new Resend(process.env.Shopverse_ResendAPI);

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Shopverse <onboarding@resend.dev>',
      to: [to],
      subject,
      text,
      html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return;
    }

    console.log('Message sent:', data.id);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// sendEmail(
//   "jatin1212@gmail.com",
//   "Test Subject",
//   "This is a test email",
//   "<b>This is a test email</b>"
// );

module.exports = { sendEmail };