const nodemailer = require('nodemailer');
//options is an opbject that contains the subject..of an email
exports.sendMail = async (options) => {

    //1.create a transporter
    //machine from nodejs server to the user

    const transporter = nodemailer.createTransport({

        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    //2.Define the mail options
    const mailOptions = {
        from: "lynn <fullstackdev>",
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    //3.send the mail
    await transporter.sendMail(mailOptions);
};