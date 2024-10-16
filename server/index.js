require('dotenv').config();
const express = require('express')
const userRouter = require('./routes/index')
const db = require('./config/db');
const cors = require('cors');
const app =  express();
db();
app.use(cors());
const port  =  process.env.PORT||4000;

app.use(express.json());
// Serve static files from the uploads directory
// app.use('/uploads', express.static('uploads'));
app.use('/api/v1',userRouter)
// app.use(express.urlencoded({exteded:true}))
//global error handler 
app.use((req,res,next)=>{
    const error = new Error("This is not valid end point");
    error.status = 404;
    next(error)
})
app.use((err,req,res,next)=>{
    res.status(err.status).json({error:err.message || "Something went wrong"})
})
app.listen(port,(err)=>{
    if(err){
        console.log(`Error in running server:- ${err}`);
        return ;
    }
    console.log(`Server runingon port ${port}`)
})

module.exports = app