const { subscribeToQueue } = require('./broker');
const { sendEmail } = require('../email');

module.exports = function () {
    // AUTH_NOTIFICATION.USER_CREATED -> jis queue se authintation service pr data dal rhe the ussi se subscribe krenge
    subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {
    // console.log("Received data from queue: ", data);

    // lastname conditional deke rkha tha isliye ye conditional hai
    const emailHTMLTemplate = `
    <h1>Welcome to Our Services!</h1>
    <p>Dear ${data.fullName.firstName + " " + (data.fullName.lastName || "")},</p>
    <p>Thank you for registering with us. We're excited to have you on board!</p>
    <p>Best regards,<br/>The Team</p>
    `;

    await sendEmail(data.email, "Welcome to Our Service", "Thank you for registering with us!", emailHTMLTemplate);
})

}

// jesse hi user create hoga toh authentication service queue me object format me data dalegi aur fir notifcation service jese hi queue me koi data ayega vo niakl kar abhi usse console krwa kr rkhegi