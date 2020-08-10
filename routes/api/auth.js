const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');  //to bring in the User model

const {check , validationResult} = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//  @route  GET api/auth
//  @desc   test route
//  @access Public

//THIS IS A PROTECTED ROUTE
router.get('/', auth, async (req,res)=>{    //auth here is the middleware , 
    
    //TO GET THE DETAILS OF THE USER WHEN WE MAKE A GET REQUEST  
    try{
        const user = await User.findById(req.user.id).select('-password'); //passed req.user beacause of decoded req.user in auth.js middleware
        // -password will not return the password from the user
        res.json(user);
    }
    catch (err){
        console.error(err.message);
        res.status(500).send('Server error.');
    }
});

//  @route  POST api/auth
//  @desc   Authenticate user and get token
//  @access Public

router.post('/', [
    check('email','Please include a valid email').isEmail(),
    check('password','Password is required').exists()
],
async(req,res)=> {

    const errors = validationResult(req);   //extracts the validation error from the req object and makes it available for result object
    if(!errors.isEmpty())
        return res.status(400).json({errors : errors.array()})  
    
    //FOR USER LOGIN (onwwards)
    const {email,password} = req.body; //to pull these fields from req.body (**)

    try{
        //SEE IF THE USER EXIST FOR LOGIN BY EMAIL
        let user = await User.findOne({email}); //to find the user by email (**)
        if(!user)
            return res.status(400).json({errors: [{ msg:"Invalid Credentials." }]});
        

        //TO CHECK IF THE PASSWORD MATCHES 
        const isMatch = await bcrypt.compare(password, user.password);    //takes in plain text and encrypted password from(**)
        //****** DO NOT FORGET TO PUT AWAIT OR ELSE IT WILL MATCH FOR ANY PASSWORD/

        if(!isMatch){
            return res.status(400).json({errors: [{ msg:"Invalid Credentials." }]}); 
        }


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