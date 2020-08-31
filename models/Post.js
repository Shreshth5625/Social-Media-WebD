const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    //WE WANT THE SCHEMA TO BE CONNECTED TO A USER
    user : {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    text : {type : String, required : true},
    name : {type : String},
    avatar : {type : String},
    likes : [{  type : mongoose.SchemaTypes.ObjectId, ref : 'users' }], //this is an array for likes on post
    comments : [{   
            user : {type : Schema.Types.ObjectId, ref : 'users'},
            text : {type : String, required : true},
            name : {type : String},
            avatar : {type : String},
            date : {type : Date, default : Date.now} 
        }],
    date : {type : Date, default : Date.now}    
});

module.exports = Post = mongoose.model('post',PostSchema); 