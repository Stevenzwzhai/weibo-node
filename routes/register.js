/**
 * Created by Stevenzwzhai on 2017/3/22.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var models = require('../model.js');
var User = models.User;
var Blog = models.Blog;

moment.locale('zh-cn');

router.get('/', function(req, res, next){
    res.render('register');
});
router.post('/register', function(req, res, next){
    User.find({name: req.body.name},function(err,result){
        if(err) return handleError(err);
        if(result.length == 0){
            var user = new User({
                name: req.body.name,
                password: req.body.password,
                level: 1,
                avatar: 'avatar_default.jpg'
            });
            user.save(function(err, user){
                if(err) return handleError(err);
                req.session.user_id = user._id;
                res.json({success:1});
            });
        }else{
            res.json({success:2});
        }
    });
});

module.exports = router;
