const express = require('express');
const router = express.Router();

const {check , validationResult} = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');


//  @route  POST api/post
//  @desc   Create Post 
//  @access Private
router.post('/', [auth , [
    check('text','Text is required').not().isEmpty()
]],
 async(req,res)=> {
    const errors = validationResult(req);

    if(!errors.isEmpty())
        return res.status(400).json({ errors : errors.array()})
    
    try {
        const user = await  User.findById(req.user.id).select('-password');

        const newPost = new Post({ 
            text : req.body.text,
            name : user.name,
            avatar : user.avatar,
            user : req.user.id
        });

        const post = await newPost.save();
        res.json(post)

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }


 });

//  @route  GET api/post
//  @desc   Get all Posts 
//  @access Private 
router.get('/', auth, async(req,res) =>{
    try {
        //GET ALL POSTS OF A USER
        const posts = await Post.find().sort({ date : -1}); //to sort it by the most recent one
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
})

//  @route  GET api/posts/:id
//  @desc   Get Posts by id 
//  @access Private 
router.get('/:id', auth, async(req,res) =>{
    try {
        //GET ALL POSTS OF A USER
        const post = await Post.findById(req.params.id);
        if(!post)
            return res.status(404).json({msg : 'Post not Found'});
        
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId')
            return res.status(404).json({msg : 'Post not Found'});
         
        res.status(500).send('Server Error'); 
    }
})

//  @route  DELETE api/posts/:id
//  @desc   Delete Posts by id 
//  @access Private 
router.delete('/:id', auth, async(req,res) =>{
    try {
        //GET ALL POSTS OF A USER
        const post = await Post.findById(req.params.id);

        //to check if the post exists
        if(!post)   
            return res.status(404).json({msg : 'Post not Found'});
         
        //CHECK ON THE USER
        if(post.user.toString() != req.user.id) //to compare string and object id
            return res.status(401).json({msg: 'User not authorized'})
        
        
        await post.remove();
        res.json('Post is removed')
        
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId')
            return res.status(404).json({msg : 'Post not Found'});
         
        res.status(500).send('Server Error'); 
    }
})


//  @route  PUT api/posts/like/:id
//  @desc   Like a post
//  @access Private 
router.put('/like/:id', auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        //CHECK IF THE POST IS ALREADY LIKED BY A USER
        if( post.likes.filter(like => like.user.toString() === req.user.id).length > 0  ) { //filter method takes in a function
            return res.json(400).json({msg: 'Post already liked.'})
        } 

        post.likes.unshift({ user : req.user.id }); //add the user to the start of the array 

        await post.save();   //save it back to database
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


//  @route  PUT api/posts/unlike/:id
//  @desc   Unlike a post
//  @access Private 
router.put('/unlike/:id', auth, async(req,res) => {
    try {
        const post = await Post.findById(req.params.id);

        //CHECK IF THE POST IS ALREADY LIKED BY A USER
        if( post.likes.filter(like => like.user.toString() === req.user.id).length === 0  ) { //filter method takes in a function
            return res.json(400).json({msg: 'Post has not yet been liked.'})
        } 

        //GET REMOVE INDEX
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex,1);  

        await post.save();   //save it back to database
        res.json(post.likes);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

module.exports = router;