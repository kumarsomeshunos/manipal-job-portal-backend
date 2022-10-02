import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function SendEmail(email, subject, text) {

    console.log("Sending email to " + email);

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: subject,
            text: text
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.log(error);
    }
}



