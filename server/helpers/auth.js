require('dotenv').config();
const jwt = require("jsonwebtoken");
module.exports.generatedToken = async(data)=>{
  try{
    const access_token =  await jwt.sign(
      {data},
      process.env.ACCESS_SEKRET_KEY,
      { expiresIn: "1d" }
    )
    return {access_token};
  } catch (err) {
    console.log(err);
  }
}