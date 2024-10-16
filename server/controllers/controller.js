const User = require("../models/userModel")
const tokenGenrator =  require('../helpers/auth')
// const bcrypt = require('../helpers/bycript');
const createUser = async(req,res)=>{
   try {
     const user  = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        role:req.body.role
     })
   
     return res.status(200).json({
      
        message:"user create succesfully"
     })
   } catch (err) {
    return res.status(500).json({
        message: err.message
    })
   }
}

const loginUser = async(req,res)=>{
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "You are not a registered user" });
        }
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
          }

          const payload =  {
              id: user.id,
              role: user.role,
          }
          const { access_token } = await tokenGenrator.generatedToken(payload);
          
          return res.status(200).json({
            data: {
              name: user.name,
              access_token,
              role:user.role
            },
            message: "User successfully logged in",
          });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error" });
    }
}


const logoutUser  = async(req,res)=>{
  res.status(200).json({ message: "User successfully logged out" });
}

module.exports = {
    createUser,
    loginUser,
    logoutUser
}