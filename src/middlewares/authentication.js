import jwt from "jsonwebtoken";
import config from "../config/config.js";

export function auth(req, res, next) {
    if (req.session?.user) return next();
    res.redirect("/login");
}
export function authenticateToken(req, res, next) {
    const token = req.cookies.UserJWTCookie;
    if (!token) {
        return res.redirect("/login");
    }
    jwt.verify(token, config.PRIVATE_KEY, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
}


