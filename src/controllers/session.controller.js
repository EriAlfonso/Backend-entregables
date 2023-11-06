import { sessionRepository } from "../services/index.js";

export default class sessionController {
    getLogin(req, res) {
        if (sessionRepository.isUserLoggedIn(req)) {
            sessionRepository.loginRedirect(res);
        } else {
            res.render("login", {});
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
            res.redirect('/products');
        });
    }

    getProfile(req, res) {
        const user = req.session.user;
        res.render("profile", user);
    }
}
const sessionControllerimp = new sessionController();
const { getLogin, getLogout, getProfile, getRegister } = sessionControllerimp
export { getLogin, getLogout, getProfile, getRegister }