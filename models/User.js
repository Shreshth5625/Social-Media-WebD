//THIS IS USED TO ADD FIELDS TO THE USER PROFILE 
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{ type:String , required:true },
    email:{ type:String , required:true, unique:true},  //so no two users can register with the same email
    password:{ type:String , required:true },
    avatar:{ type:String},
    date:{ type:Date , default:Date.now },
});

module.exports = User = mongoose.model('user',UserSchema);  //model name and schema