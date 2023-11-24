import { Router } from "express";
import passport from "passport";
import { generateToken } from "../../utils.js";
import { getPasswordReset } from "../../controllers/session.controller.js";





const router = Router();

router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {
    if (!req.user) return res.status(400).send('Invalid User Data')
    const access_token = req.user.access_token;
    res.cookie('UserJWTCookie', access_token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
    });
    req.session.user = req.user
    return res.redirect('/products')
})

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/register'
}), async (req, res) => {
    res.
        cookie("UserJWTCookie", (user.token = access_token), {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        })
    redirect('/login')
})

router.get('/password-reset', (req, res) => {
    const token = req.query.token;
    if(!token) return res.redirect('/login')
    try {
    const decoded = jwt.verify(token, config.PRIVATE_KEY)
    res.render('passwordReset', {email: decoded.email})
    } catch (error) {
    if (error) {
        return res.redirect('/login');
    } else {
        return res.send({ success: false, message: error.message });
    }
    }
  })

router.get('validate-email', (req, res) => {
    res.render('passwordMail'); 
});


router.post('/passwordResetMail',getPasswordReset
),

router.get(
    '/login-github',
    passport.authenticate('github', { scope: ['user:email'] }),
    async (req, res) => { }
)

router.get(
    '/githubcallback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async (req, res) => {
        const user = req.user
        const access_token = generateToken({user})

        res.cookie("UserJWTCookie", access_token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        })
        req.session.user = user
        return res.redirect('/products')
    }
)

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send({ status: 'success', payload: req.user })
})

export default router;