import userDTO from "../DTO/users.dto.js";
import userModel from "../DAO/models/user.model.js";
import usersManager from "../DAO/mongoManagers/userManagerDB.js";
export default class sessionService{
    constructor(userDAO) {
        this.userDAO = userDAO;
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
}

