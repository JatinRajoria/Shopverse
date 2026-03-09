const { subscribeToQueue } = require("./broker");
const { sendEmail } = require("../email");

module.exports = function () {
  // AUTH_NOTIFICATION.USER_CREATED -> jis queue se authentation service pr data dal rhe the ussi se subscribe krenge
  subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {
    // console.log("Received data from queue: ", data);

    // lastname conditional deke rkha tha isliye ye conditional hai
    const emailHTMLTemplate = `
    <h1>Welcome to Our Services!</h1>
    <p>Dear ${data.fullName.firstName + " " + (data.fullName.lastName || "")},</p>
    <p>Thank you for registering with us. We're excited to have you on board!</p>
    <p>Best regards,<br/>The Team</p>
    `;

    await sendEmail(
      data.email,
      "Welcome to Our Service",
      "Thank you for registering with us!",
      emailHTMLTemplate,
    );
  });
  // jesse hi user create hoga toh authentication service queue me object format me data dalegi aur fir notifcation service jese hi queue me koi data ayega vo niakl kar abhi usse console krwa kr rkhegi


  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETED", async (data) => {
    const emailHTMLTemplate = `
    <h1>Payment Successful!</h1>
    <p>Dear ${data.username},</p>
    <p>We have received your payment of ${data.currency} ${data.amount} for the order ID: ${data.orderId}.</p>
    <p>Thank you for your purchase!</p>
    <p>Best regards,<br/>The Team</p>
    `;

    await sendEmail(
      data.email,
      "Payment Successful",
      "We have received you payment",
      emailHTMLTemplate,
    );
  });


//   payment jab apki failed ho jaye
  subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_FAILED", async (data) => {
    const emailHTMLTemplate = `
        <h1>Payment Failed</h1>
        <p>Dear ${data.username},</p>
        <p>Unfortunately, your payment for the order ID: ${data.orderId} has failed.</p>
        <p>Please try again or contact support if the issue persists.</p>
        <p>Best regards,<br/>The Team</p>
        `;
    await sendEmail(
      data.email,
      "Payment Failed",
      "Your payment could not be processed",
      emailHTMLTemplate,
    );
  });
};
