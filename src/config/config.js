import { config } from "dotenv";
config();
export default {
    PERSISTENCE: process.env.PERSISTENCE,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    RFRESH_TOKEN: process.env.RFRESH_TOKEN,
    MONGO_URL: process.env.MONGO_URL,
    CLIENTID: process.env.CLIENTID,
    CLIENTSECRET: process.env.CLIENTSECRET,
    MONGO_SECRET: process.env.MONGO_SECRET,
    MONGO_NAME:process.env.MONGO_NAME,
    CALLBACKURL :process.env.CALLBACKURL,
    NODE_ENV: process.env.NODE_ENV,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS:process.env.MAIL_PASS,
    STRIPE_KEY:process.env.STRIPE_KEY,
    PORT:process.env.PORT
}