//THIS FILE IS USED TO CONNECT TO THE DATABASE
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');  //to get the value of URI from default.json  

const connectDB =async () => {
    try{
        await mongoose.connect(db,{ 
            useNewUrlParser: true,  //WARNING: connection with node server error 
            useUnifiedTopology: true,
            useCreateIndex : true,
            useFindAndModify: false
        })
        console.log("MongoDB Connected.");
        

    }
    catch(err) {
        console.error(err.message);
        process.exit(1);    //Exit process wth failure
    }
}

module.exports = connectDB;