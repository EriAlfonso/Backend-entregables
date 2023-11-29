import { Router } from "express";
import passport from "passport";
import { generateToken } from "../../utils.js";
import { getPasswordReset} from "../../controllers/session.controller.js";
import { sessionRepository } from "../../services/index.js";





const router = Router();

router.post('/login', passport.authenticate('login', '/login'), async (req, res) => {
    if (!req.user)
    return res.status(400).send('Invalid User Data')
    const access_token = req.user.access_token;
    res.cookie('UserJWTCookie', access_token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
    });
    req.session.user = req.user
    return res.redirect('/products')
})

router.post('/register', passport.authenticate('register', '/register'
), async (req, res) => {
    const user = { _id: req.user._id }
    const access_token = generateToken(user)
    res.cookie("UserJWTCookie", access_token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
    });
    return res.redirect('/login'); 
});

router.get('/passwordReset', (req, res) => {
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
    const currentUser= sessionRepository.getCurrent(req.user.userData)
    res.send({ status: 'success', payload: currentUser })
})

export default router;