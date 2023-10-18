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
}