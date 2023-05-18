import transporter from "../config/tranporterConfig.js";
import config from "../config/index.js";


const sendMailToUser = async(options) => {
    const message = {
        from: config.SMTP_SENDER_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(message);
}

export default sendMailToUser;