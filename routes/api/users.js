const express = require('express');
const router = express.Router();
const {check , validationResult} = require('express-validator');
const User = require('../../models/User');  //to bring in the User model
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');     //to encrypt the password
const jwt = require('jsonwebtoken');

const config = require("config");   //for jwt webtoken 

//  @route  POST api/users
//  @desc   Register User
//  @access Public

router.post('/', [
    check('name','Name is required').not().isEmpty(),   //property , Error message
    check('email','Please include a valid email').isEmail(),
    check('password','Passowrd must be of 6 digits or more').isLength({min:6})
],
async(req,res)=> {

    const errors = validationResult(req);   //extracts the validation error from the req object and makes it available for result object
    if(!errors.isEmpty())
        return res.status(400).json({errors : errors.array()})  
    
    //FOR USER REGISTRATION (onwwards)
    const {name,email,password} = req.body; //to pull these fields from req.body

    try{
        //SEE IF THE USER EXIST
        let user = await User.findOne({email}); //to find the user by email
        if(user)
            return res.status(400).json({errors: [{ msg:"User already exists!" }]});
        

        //GET USERS GRAVATAR (image)
        const avatar = gravatar.url(email,{
           s:'200' , //default size
           r:'pg' , //rating of image (censored)
           d:'mm'  // default image of user icon, we can also write 404 so it says "File not found error" 
        })
       
        user = new User({   
            name,
            email,
            avatar,
            password,
        })  
        //This does not save the user, it just creates an instance of User.
        // We need to call user.save() to save the user with these details
        
       //ENCRYPT PASSWORD
       const salt = await bcrypt.genSalt(10);   
      
       user.password = await bcrypt.hash(password,salt);    //encrypted password

       await user.save();   // to save the user to the database

       //RETURN JSON WEBTOKEN
       const payload = {
           user :{
               id : user.id
           }
       }

       jwt.sign(payload, config.get('jwtSecret'), {expiresIn:360000000000}, (err,token) =>{
           if(err) throw err;
           res.json({token});
       });
        
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }

});

module.exports = router;