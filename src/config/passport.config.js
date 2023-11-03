import passport from "passport";
import local from 'passport-local';
import cartModel from "../DAO/models/carts.model.js";
import userModel from "../DAO/models/user.model.js";
import usersManager from "../DAO/mongoManagers/userManagerDB.js";
import githubStrategy from "passport-github2";
import { createHash,generateToken,isValidPassword } from "../utils.js";
import jwt from "passport-jwt";
import config from "./config.js";

const usersManagerImport =new usersManager()

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
            clientID: config.CLIENTID,
            clientSecret: config.CLIENTSECRET,
            callbackURL: config.CALLBACKURL,
        },
        async(accessToken,refreshToken,profile,done)=>{
            try{
                const email=profile._json.email
                const user= await userModel.findOne({email: profile._json.email})
                if (user){
                    const access_token = generateToken({user})
                    user.token=access_token
                    return done(null,user)
                }
              
                const cart = new cartModel()
                const cartid = cart._id
                const newUser={
                    first_name:profile._json.name,
                    last_name:'',
                    age:0,
                    email: profile._json.email,
                    cart:cartid,
                    password:'',
                    role:'user',

                }
                const result= await userModel.create(newUser);
                await result.save()
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
            const access_token = generateToken(user); 
            user.access_token = access_token;
            return done (null,user)
        } catch (error){
            return done (error)
        }
        }
    ))

    passport.use('jwt', new JwtStrategy({
        jwtFromRequest:Extract.fromExtractors([cookieExtractor]),
        secretOrKey: config.PRIVATE_KEY
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