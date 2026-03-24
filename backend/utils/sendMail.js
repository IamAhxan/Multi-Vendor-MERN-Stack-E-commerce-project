import nodemailer from 'nodemailer';

const sendMail = async (options) => {
    console.log("Attempting to send mail to:", options.email);
    console.log("Using SMTP_MAIL:", process.env.SMTP_MAIL);
    console.log("Using SMTP_SERVICE:", process.env.SMTP_SERVICE);

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Port 587 is STARTTLS, so secure is false
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, '') : ''
        },
        tls: {
            rejectUnauthorized: false // Helps avoid connection issues on some networks
        }
    })

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: options.email,
        subject: options.subject,
        // text: options.text,
        text: options.message,
    }
    await transporter.sendMail(mailOptions)
}

export default sendMail