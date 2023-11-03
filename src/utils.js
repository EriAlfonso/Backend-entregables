import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from './config/config.js';


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const createHash =(password)=> {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const isValidPassword =(user,password) => {
    return bcrypt.compareSync(password, user.password)
}
export const generateToken = (user) => {
    console.log(user)
    const token = jwt.sign( user, config.PRIVATE_KEY, {expiresIn: '10m'})
    return token
}

export default __dirname