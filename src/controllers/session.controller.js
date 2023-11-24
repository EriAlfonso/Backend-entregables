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
        res.render("profile", user);
    }

    async getPasswordReset(req, res) {
        const { email } = req.body; 
        const user = await sessionRepository.getUserByEmail(email);
                if (!user) {
                return res.render('error', { message: 'User not found' });
                }
                return res.render('success', { message: 'Password reset email can be sent.' });
        }

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
};
