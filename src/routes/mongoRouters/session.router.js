import userModel from "../../DAO/models/user.model.js";
import { Router } from "express";
import passport from "passport";
import { createHash,isValidPassword } from "../../utils.js";

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

router.get(
    '/login-github',
    passport.authenticate('github', {scope: ['user:email'] }),
    async(req, res) => {}
)

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/'}),
    async(req, res) => {
        console.log('Callback: ', req.user)
        req.session.user = req.user
        console.log(req.session)
        res.redirect('/products')
    }
)
export default router;