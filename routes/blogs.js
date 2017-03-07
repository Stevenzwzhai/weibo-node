var express = require('express');
var router = express.Router();
var models = require('../model.js');
var User = models.User;
var Blog = models.Blog;
var mongoose = require('mongoose');


/**
 * 获得所有博客
 */
router.get('/all',function(req, res, next){
    Blog.find()
        .populate('user')
        .exec(function(err, blogs) {
            if(err) return handleError(err);
            res.json(blogs);
        });
});
/**
 * 添加一个blog
 */
router.post('/create',function(req, res, next){
    var content = req.body.content;
    var blog = new Blog({
        user:req.session.user_id,
        from:req.session.from,
        content:content,
        praise:0
    });
    blog.save(function(err){
        if(err) return handleError(err);
        console.log('saved');
        res.json(blog);
    });
});
/**
 * 删除指定id博客
 */
router.get('/delete/:id',function(req, res, next){
    var id = mongoose.Types.ObjectId(req.params.id);
    Blog.remove({_id:id}, function(err){
        if(err) return handleError(err);
        res.json({success:1});
    });
});
module.exports = router;