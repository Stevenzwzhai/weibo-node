var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var moment = require('moment');
var models = require('../model.js');
var User = models.User;
var Blog = models.Blog;

moment.locale('zh-cn');

router.get('/',function(req, res, next){
    res.redirect('/index');
});
/* GET home page. */
router.get('/index', function(req, res, next) {
    if(req.session.user_id == null){
        res.redirect('/login');
    }
    User.findOne({'_id':req.session.user_id}, '', function(err, user){
        if(err) return handleError(err);
        //console.log(users);
        res.render('index', { title: '新浪微博', user: user});
    });

});
router.get('/register', function(req, res, next){
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
router.get('/login',function(req, res, next){
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
router.get('/logout', function(req, res, next){
    req.session.user_id = null;
    res.redirect('/');
});


module.exports = router;
