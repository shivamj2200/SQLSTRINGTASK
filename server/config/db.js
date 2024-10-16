const mongoose = require('mongoose');
const DB_OPTIONS={
    dbName : process.env.DB_NAME
}
const connectdb = () =>{
    return mongoose.connect(process.env.DATABASE_URL,DB_OPTIONS)
    .then(()=>console.log(`Database connected successfully`));
}

module.exports = connectdb;