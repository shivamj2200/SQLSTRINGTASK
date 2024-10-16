require('dotenv').config();
// const jwt = require('jsonwebtoken')
const db  = require("../models/userModel");

const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    // console.log('SECRET KEY:',  process.env.ACCESS_SEKRET_KEY);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify the token using the secret key
    const verifiedToken = jwt.verify(token, process.env.ACCESS_SEKRET_KEY);
    // console.log('eeeee')
    // console.log(verifiedToken)
    let user = await db.findById(verifiedToken.data.id);
          if (user) {
            req.user = verifiedToken.data;
            next();
          } else {
            throw new Error("User not found");
          }
    console.log(user)
    // next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token: ' + err.message });
  }
};

module.exports = { authenticate };
// 