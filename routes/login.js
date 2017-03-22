/**
 * Created by Administrator on 2017/3/22.
 */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var models = require('../model.js');
var User = models.User;
var Blog = models.Blog;

moment.locale('zh-cn');

router.get('/',function(req, res, next){
    res.render('login');
});
router.post('/login',function(req, res, next){
    User.findOne({name:req.body.name},'',function(err, user){
        if(err) return handleError(err);
        console.log(user);
        if(user == null){
            res.json({error:1});
        }else{
            if(user.password == req.body.password){
                req.session.user_id = user._id;
                req.session.from = '微博weibo.com';
                res.json({success:1});
            }else{
                res.json({error:2});
            }
        }
    });
});

module.exports = router;