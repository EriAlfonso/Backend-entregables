import { sessionRepository } from "../services/index.js";

export default class sessionController {
    getLogin(req, res) {
        if (sessionRepository.isUserLoggedIn(req)) {
            sessionRepository.loginRedirect(res);
        } else {
            res.render("login", {});
        }
    }

    async getUserByEmail(req, res) {
        try {
            const { email } = req.body;
            const user = await sessionRepository.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(200).json({ user });
        } catch (error) {
            console.error("Error fetching user by email:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    getRegister(req, res) {
        if (sessionRepository.isUserLoggedIn(req)) {
            sessionRepository.registerRedirect(res);
        } else {
            res.render("register", {});
        }
    }

    getLogout(req, res) {
        sessionRepository.clearSessionCookie(res);
        sessionRepository.destroySession(req, res, () => {
            res.redirect("/products");
        });
    }

    getProfile(req, res) {
        const user = req.session.user;
        const userData= sessionRepository.getCurrent(user)
        res.render("profile", userData);
    }

    async getPasswordReset(req, res) {
        const token = req.query.token; 
        try {
            const varifyToken = await sessionRepository.verifyToken(token);
    
            if (varifyToken.success) {
                const userEmail = varifyToken.email;
                return res.render('passwordReset', { email: userEmail });
            } else {
                return res.render('passwordMail',);
            }
        } catch (error) {
            console.error('Error in password reset:', error);
            return res.status(500).send('Internal server error');
        }};
        

    async getMailReset(req, res) {try {
        const email = req.body.email
        const response = sessionRepository.emailValidation(email)
        res.status(200).send({success: true, message: await response.message})
    } catch (error) {
        res.status(500).send({success: false, message: error.message})
    }
}
    getPasswordMail(req, res) {
        res.render("passwordMail", {})
        }

        newPassword = async (req, res) => {
            try {
                const pass = req.body.password;
                const mail = req.body.email
                const response = await sessionRepository.newPassword(mail, pass)
                if (response.success) {
                    res.status(200).send("Password successfully changed!");
                } else {
                    res.status(400).send("Failed to change password: " + response.message);
                }
            } catch (error) {
                res.status(500).send("Internal server error");
            }
        }
}
const sessionControllerimp = new sessionController();
const {
    getLogin,
    getLogout,
    getProfile,
    getRegister,
    getPasswordMail,
    getPasswordReset,
    getUserByEmail,
    getMailReset,
    newPassword
} = sessionControllerimp;
export {
    getLogin,
    getLogout,
    getProfile,
    getRegister,
    getPasswordMail,
    getPasswordReset,
    getUserByEmail,
    getMailReset,
    newPassword
};
