var express = require('express');
var router = express.Router();
var models = require('../model.js');
var User = models.User;
var Blog = models.Blog;
var UploadFile = models.UploadFile;
var mongoose = require('mongoose');

/**
 * 添加一个附件
 */
router.post('/create',function(req, res, next){
    res.json(req.body);
});
module.exports = router;