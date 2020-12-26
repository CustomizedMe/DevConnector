const express = require('express');
const router = express.Router();
const { check, validationResult } =  require('express-validator/check');
const auth = require('../../middleware/auth');

//Bringing the models
const Post =  require('../../models/Post');
const Profile =  require('../../models/Profile');
const User =  require('../../models/User');


// @route POST api/posts
// @desc Create a post 
// @access Private
router.post('/',[auth, [
    check('text', 'Test is required')
    .not()
    .isEmpty()
]
],
async  (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    try {
        
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text : req.body.text,
            name : user.name,
            avatar: user.avatar,
            user:req.user.id
        });

        const post = await newPost.save();
        res.json(post);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

}
);
// @route Get api/posts
// @desc get all posts 
// @access Private
router.get('/', auth , async (req,res) => {
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/posts/:id
// @desc Dlets posts 
// @access Private
router.get('/:id', auth , async (req,res) => {
    try {
        const posts = await Post.findById(req.params.id);
        //Check on user
        if(post.user.toString() !== req.user.id ){
            return res.status(401).json({msg : 'User not authorized'});
        }
        await this.post.remove();
        res.json({msg : 'Removed'});
    } catch (err) {
        if (err.kind=== 'ObjectId'){
            return res.status(404).json({ msg : 'Post not found'});
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// @route POST api/posts/:id
// @desc Create a post 
// @access Private
router.get('/',auth, async (req, res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if (!post){
            return res.status(404).json({ msg : 'Post not found'});
        }
        
    } catch (err) {
        console.error(err.message);
        if (err.kind=== 'ObjectId'){
            return res.status(404).json({ msg : 'Post not found'});
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router;
