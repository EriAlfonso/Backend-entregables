import userDTO from "../DTO/users.dto.js";
import userModel from "../DAO/models/user.model.js";
import config from "../config/config.js";
import nodemailer from "nodemailer";
import { createHash } from "../utils.js";
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"

export default class sessionService {
    constructor(userDAO) {
        this.userDAO = userDAO;
    }

    async createUser(data) {
        return this.userDAO.createUser(data);
    }
    async getUserById(id) {
        return this.userDAO.getUserById(id);
    }
    async getUsers() {
        return this.userDAO.getUsers();
    }
    async getUserByEmail(email) {
        return this.userDAO.getUserByEmail(email);
    };
    async getUserByEmailCode(email, verificationCode) {
        return this.userDAO.getUserByEmailCode(email, verificationCode)
    };
    async updateUser(id, data) {
        return this.userDAO.updateUser(id, data)
    }
    async deleteUser(id) {
        return this.userDAO.deleteUser(id)
    }

    isUserLoggedIn(req) {
        return !!req.session?.user;
    }

    loginRedirect(res) {
        res.redirect('/logout');
    }

    registerRedirect(res) {
        res.redirect('/products');
    }

    clearSessionCookie(res) {
        res.clearCookie('UserJWTCookie');
    }

    destroySession(req, res, callback) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
            callback();
        });
    }
    
    getCurrent(user){
        const {iat,exp,...userData} = user; 
        return userData;
    }
    
        sendResetEMail = async (email) => {
            try {
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    port: 587,
                    auth: {
                        user: config.MAIL_USER,
                        pass: config.MAIL_PASS
                    }
                })
                const token = jwt.sign({ email }, config.PRIVATE_KEY, { expiresIn: "1h" })
                const resetLink = `http://localhost:8080/passwordReset?token=${token}`;
                const mailOptions = {
                    from: config.MAIL_USER,
                    to: email,
                    subject: 'Password Reset Request',
                    html: `<p>Hello,</p>
                    <p>We received a request to reset your password. If you did not make this request, ignore this email.</p>
                    <p>To reset your password, please click the following link:</p>
                    <a href="${resetLink}">Reset Password</a>
                    <p>This link will expire in 1 hour.</p>
                    <p>Thank you,</p>
                    <p>IcarusGames</p>`
                }
                const result = await transport.sendMail(mailOptions);
            }
            catch (error) {
            console.error('Error Sending mail:', error);
            }
        };

    emailValidation = async (email) => {
        try {
            const user = await this.userDAO.getUserByEmail(email);
            if (user) {
                await this.sendResetEMail(email);
                return { success: true, message: 'Password reset email sent successfully.' };
            } else {
                return { success: false, message: 'Email address not found. Please enter a registered email.' };
            }
        } catch (error) {
            console.error('Error in email validation:', error);
            return { success: false, message: 'Error validating email. Please try again later.' };
        }
    }

    async verifyToken(token) {
        try {
            if (!token) {
                return res.status(400).send('Invalid token'); 
            }
    
            const user = jwt.verify(token, config.PRIVATE_KEY); 
            const userEmail = user.email; 
            return { success: true, email: userEmail };
        } catch (error) {
            console.error('Token verification error:', error);
            return { success: false, error: 'Token verification failed' };
        }
    };

    newPassword = async (email, pass) => {
        try {
            const user = await this.userDAO.getUserByEmail(email);
            if (!user) return { success: false, message: 'Usuar Not Ffound' }
            const passwordMatch = await bcrypt.compare(pass, user.password);
            if (passwordMatch) return { success: false, message: 'New Password Cant Be The Same As Old Password' };
            const newPass=createHash(pass)
            user.password = newPass
            await user.save()
            return ({ success: true, message: 'New Password Set' })
        } catch (error) {
            return ({ succes: false, message: error.message })
        }
    }
}

