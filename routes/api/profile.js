const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');  //we get the profile by userid which is in the token

const Profile = require('../../models/Profile');
const User = require('../../models/User');  //since avatar & name of the user are in this model

const { check, validationResult } = require('express-validator');


//  @route  GET api/profile/me
//  @desc   Get current user's profile
//  @access Private 

router.get('/me',auth, async (req,res)=> {
    try {
        const profile = await Profile.findOne({user : req.user.id}).populate('user',['name','avatar']);    

        if(!profile)
        {
            res.status(400).json({msg :"There is no profile for this user"});
        }
        res.json(profile);  //if profile exists send the profile

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//  @route  POST api/profile/
//  @desc   Create or Update a user's profile
//  @access Private

router.post('/', [auth,[    //we pass auth and validation middleware
    check('status','Status is required').notEmpty(),    //****** 
    check('skills','Skills are required').notEmpty()
] ],
 async (req,res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors : errors.array()})
    
    const {
        company,
        location,
        website,
        bio,
        skills,
        status,
        githubusername,
        youtube,
        twitter,
        instagram,
        linkedin,
        facebook
        } = req.body;    
    
    //BUILD PROFILE OBJECT
    const profileFields = {};
    profileFields.user = req.user.id;

    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio= bio;
    if(status) profileFields.status = status;
    if(githubusername) profileFields.githubusername = githubusername;
    if(skills)
        profileFields.skills = skills.split(',').map( skill => skill.trim());  //skills were separated with ","

    //BUILD SOCIAL OBJECT
    profileFields.social = {};  
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    
    try {
        let profile = await Profile.findOne({user : req.user.id});

        if(profile){
            //UPDATE THE USER PROFILE
            profile = await Profile.findOneAndUpdate(
                {user : req.user.id},
                {$set:profileFields},
                {new : true}
            );

            return res.json(profile);
        }

        //CREATE THE PROFILE IF NOT FOUND 
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status().send("Server Error")
    }

});

//  @route  GET api/profile/
//  @desc   Get all profiles
//  @access Public

router.get('/', async (req,res) =>{
    try {
        const profiles = await Profile.find().populate('user' , ['name','avatar'] );
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//  @route  GET api/profile/:user_id
//  @desc   Get profile by userID
//  @access Private

router.get('/user/:user_id', async (req,res) =>{ 
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user' , ['name','avatar'] );
        res.json(profile);

        if(!profile){
            res.status(400).json({msg: "Profile not found."});
        }

    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId')
        {
            return res.status(400).json({msg: "Profile not found."});
        }
        res.status(500).send('Server Error');
    }
});

//  @route  DELETE api/profile/
//  @desc   Delete profile,user and posts
//  @access Private

router.delete('/', auth ,async (req,res) =>{
    try {
        //Remove user profile
        await Profile.findOneAndRemove({user : req.user.id}); //no need of a variable so directly call
        
        //Remove User
        await User.findOneAndRemove({_id : req.user.id}); 
        res.json({msg : "User Deleted." });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//  @route  PUT api/profile/
//  @desc   Add profile experience
//  @access Private

router.put('/experience', [auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','Company is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty(),
]], async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors : errors.array()});
    
    const {title, company, location, to, from, current, description} = req.body;

    const newExp = {title, company, location, to, from, current, description}; //creates an object with data that the user submits

    //WORKING WITH MONGODB NOW
    try {
        const profile = await Profile.findOne({user: req.user.id});

        profile.experience.unshift(newExp); //to add at beginning
        await profile.save();

        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }

});

//  @route  DELETE api/profile/experience/exp_id:
//  @desc   Delete experience from profile 
//  @access Private

router.delete('/experience/:exp_id', auth, async(req,res) =>{
    try {
        const profile = await Profile.findOne({user: req.user.id});
        
        //Get the remove index
        const removeIndex = profile.experience.map(item =>item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//  @route  PUT api/profile/
//  @desc   Add profile education
//  @access Private

router.put('/education', [auth,[
    check('school','School is required').not().isEmpty(),
    check('degree','Degree is required').not().isEmpty(),
    check('fieldofstudy','Field of study is required').not().isEmpty(),
    check('from','From date is required').not().isEmpty(),
]], async(req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors : errors.array()});
    
    const {school, degree, fieldofstudy, from, to, current, description} = req.body;

    const newEdu = {school, degree, fieldofstudy, to, from, current, description}; //creates an object with data that the user submits

    //WORKING WITH MONGODB NOW
    try {
        const profile = await Profile.findOne({user: req.user.id});

        profile.education.unshift(newEdu); //to add at beginning
        await profile.save();

        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }

});

//  @route  DELETE api/profile/education/exp_id:
//  @desc   Delete education from profile 
//  @access Private

router.delete('/education/:edu_id', auth, async(req,res) =>{
    try {
        const profile = await Profile.findOne({user: req.user.id});
        
        //Get the remove index
        const removeIndex = profile.education.map(item =>item.id).indexOf(req.params.exp_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})
module.exports = router;