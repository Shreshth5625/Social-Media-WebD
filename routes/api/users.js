const express = require('express');
const router = express.Router();
const {check , validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');  //to bring in the User model
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

    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(400).json({errors : errors.array()})
    
    const {name,email,password} = req.body;

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

       jwt.sign(payload, config.get('jwtSecret'), {expiresIn:36000}, (err,token) =>{
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