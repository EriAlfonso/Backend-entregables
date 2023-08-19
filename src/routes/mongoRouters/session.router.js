import { Router } from "express";
import userModel from "../../DAO/models/user.model.js";
import { createHash, isValidPassword } from "../../utils.js";
import passport from "passport";
const router = Router();

router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {
if (!req.user)return res.status(400).send ('Invalid User Data')
    req.session.user = req.user
    return res.redirect('/products')
})

router.post('/register',  passport.authenticate('register', {
    failureRedirect: '/register'
}), async (req, res) => {
    res.redirect('/login')
})

export default router;