import user from "../Models/user_model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
import { errorHandler } from "../utils/error.js";
import User from "../Models/user_model.js";
export const signup = async (req, res , next) => {
  const { username, email, password } = req.body;
  const hashed_password = bcryptjs.hashSync(password, 10);
  const newUser = new user({ username, email, password: hashed_password });
  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};
export const signin = async(req,res,next) =>{
  const {email,password} = req.body
  try
  {
    const validuser = await user.findOne({email})
    if(!validuser){ return next(errorHandler(404,'User not found'))}
    const validpassword = bcryptjs.compareSync(password,validuser.password)
    if (!validpassword){
      return next(errorHandler(403,"Invalid Password"))
    }
    const token = jwt.sign({id:validuser._id},process.env.JWT_Secret)
    const {password:pass,...rest} = validuser._doc
    res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
  }
  catch(error){
    next(error);
  }
}

export const google = async (req,res,next) => {
  try{
   const user = await User.findOne({email : req.body.email})
   if(user){
    const token = jwt.sign({id:user._id},process.env.JWT_Secret)
    const { password : pass, ...rest} = user._doc
    res.cookie('access_token',token,{httpOnly: true}).status(200).json(rest)
   }
   else{
    const generatedpassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
    const hashedpassword = bcryptjs.hashSync(generatedpassword,10)
    const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() +  Math.random().toString(36).slice(-4),
    email: req.body.email, password: hashedpassword , avatar : req.body.photo })
    await newUser.save()
    const token = jwt.sign({id:user._id},process.env.JWT_Secret)
    const { password : pass, ...rest} = user._doc
    res.cookie('access_token',token,{httpOnly: true}).status(200).json(rest)
   }
  }
  catch(error){
   next(error)
  }
}

export const signOut = async(req,res,next) => {
  try{
    res.clearCookie("access_token")
    res.status(200).json("Logged Out")
  }
  catch(error){
    next(error)
  }

}

