import passport from "passport";
import local from 'passport-local';
import userModel from "../DAO/models/user.model.js";
import githubStrategy from "passport-github2";
import { createHash,generateToken,isValidPassword } from "../utils.js";
import jwt from "passport-jwt";
import { config } from 'dotenv';
config()



const LocalStrategy = local.Strategy
const JwtStrategy = jwt.Strategy
const Extract =jwt.ExtractJwt

const cookieExtractor = req => {
    const token = (req?.cookies) ? req.cookies['UserJWTCookie'] : null
    return token
}


const initializePassport =() =>{

    
    passport.use ('github', new githubStrategy(
        {
            clientID: 'Iv1.f272c727f54cf4e3',
            clientSecret:'066cab59a63d1fadfd934dbe0a96b32535e14140',
            callbackURL: 'http://localhost:8080/api/session/githubcallback'
        },
        async(accessToken,refreshToken,profile,done)=>{
            try{
                const user= await userModel.findOne({email: profile._json.email})
                if (user){
                    return done(null,user)
                }
                const newUser={
                    first_name:profile._json.name,
                    email:profile._json.email,
                    password:''

                }
                const result= await userModel.create(newUser)
                return done(null,result)
            }
            catch(error){
                return done(error)
            }
        }
    ))

    passport.use('register', new LocalStrategy({
        passReqToCallback:true,
        usernameField:'email'
    }, async(req,username,password,done) =>{
        const {first_name,last_name,email,age,role} =req.body
        try{
            const user= await userModel.findOne({email:username})
            if (user){
                return done (null,false)
            }
            const newUser= {
                first_name,
                last_name,
                email,
                age,
                password:createHash(password),
                role
            }
            const result = await userModel.create(newUser)
            const access_token = generateToken(result) 
            return done(null, access_token)
        }
        catch(error){
            return done (error)
        }
    }))

    passport.use ('login', new LocalStrategy(
        { usernameField: 'email'},
        async(username,password, done)=>{
            try{
            const user= await userModel.findOne({email:username}).lean().exec()
            if (!user){
                return done (null,false)
            }
            if(!isValidPassword(user,password)){
                console.error('Invalid Password')
                return done (null,false)
            }
            const access_token = generateToken(user) 
            user.access_token = access_token;
            return done (null,user)
        } catch (error){
            return done (error)
        }
        }
    ))

    passport.use('jwt', new JwtStrategy({
        jwtFromRequest:Extract.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.PRIVATE_KEY
    },
    async(jwt_payload,done)=>{
        try{
            return done(null,jwt_payload)
        }
        catch(error){
            return done(error)
        }

    }))


    passport.serializeUser((user,done)=>{
        done (null,user._id)
    })
    passport.deserializeUser(async(id,done)=>{
        const user =await userModel.findById(id)
        done(null,user)
    })
}

export default initializePassport