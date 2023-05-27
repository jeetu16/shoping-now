import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_DB_URL: process.env.MONGO_DB_URL || "mongodb://127.0.0.1:27017/shopnow",
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "c7d66bc9f262bdf4b6eba7640837a0eca6a3a600a795c4f8a87c887197f644619c2c4faed0da64cef8d2929602e062323d65d741aaea041fbeabdcf8212ce300",
    JWT_EXPIRY: process.env.JWT_EXPIRY || '1d',
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
    SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
    SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
    SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
    SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,
    SMTP_SENDER_EMAIL: process.env.SMTP_SENDER_EMAIL,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET
}

export default config;