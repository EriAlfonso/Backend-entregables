import userDTO from "../DTO/users.dto.js";
import userModel from "../DAO/models/user.model.js";
import config from "../config/config.js";
import nodemailer from "nodemailer";
import  jwt  from "jsonwebtoken";

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
        res.redirect('/profile');
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
                console.log('Password Reset Sent:', result);
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


    NewPassword = async (email, pass) => {
        console.log(email, pass)
        try {
            const user = await this.userDAO.getUserByEmail(email);
            if (!user) return { success: false, message: 'Usuario no encontrado' }
            if (user.password === pass) return { success: false, message: 'No puedes usar el mismo password' };
            user.password = createHash(pass);
            await user.save()
            return ({ success: true, message: 'Password actualizado con exito' })
        } catch (error) {
            return ({ succes: false, message: error.message })
        }
    }
}

