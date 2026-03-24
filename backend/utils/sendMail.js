import nodemailer from 'nodemailer';

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || 'gmail',
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, '') : ''
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