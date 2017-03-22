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


router.get('/logout', function(req, res, next){
    req.session.user_id = null;
    res.redirect('/');
});


module.exports = router;
