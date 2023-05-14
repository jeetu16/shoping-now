import dotenv from 'dotenv';
dotenv.config();

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_DB_URL: process.env.MONGO_DB_URL || "mongodb://localhost:27017/",
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "c7d66bc9f262bdf4b6eba7640837a0eca6a3a600a795c4f8a87c887197f644619c2c4faed0da64cef8d2929602e062323d65d741aaea041fbeabdcf8212ce300",
    JWT_EXPIRY: process.env.JWT_EXPIRY || '1d',
    S3_REGION: process.env.S3_REGION,
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY
}

export default config;