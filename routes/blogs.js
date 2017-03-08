var express = require('express');
var router = express.Router();
var models = require('../model.js');
var User = models.User;
var Blog = models.Blog;
var UploadFile = models.UploadFile;
var mongoose = require('mongoose');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var crypto = require('crypto');
/**
 * 展示所有博客
 */
router.get('/all',function(req, res, next){
    /*Blog.find()
        .populate('user')
        .exec(function(err, blogs) {
            if(err) return handleError(err);
            for(var i = 0; i < blogs.length; i ++){
                var image_array = [];
                UploadFile.find({'blog' : blogs[i]._id},function(err, uploadfiles){
                    if(err) return handleError(err);
                    image_array = uploadfiles;
                })
                blogs[i].attach = image_array
                console.log(blogs[i].attach);
            }
            res.json(blogs);
        });*/
    Blog.find().then(function(blog) {
        UploadFile.find({'blog' : blogs[i]._id}).then(function(uploadfiles) {
            res.json({
                blog: blog,
                uploadfiles: uploadfiles
            });
        });
    });
});
/**
 * 添加一个blog
 */
router.post('/create', function(req, res, next){

    //保存上传图片逻辑
    var form = new multiparty.Form();//实例一个multiparty
    form.uploadDir = "./public/uploadfiles/";//设置文件储存路径
    //开始解析前台传过来的文件
    form.parse(req, function(err, fields, files) {
        console.log(fields);
        //先保存博客
        var blog = new Blog({
            user:req.session.user_id,
            from:req.session.from,
            content:fields.content[0],
            praise:0
        });
        blog.save(function(err){
            if(err) return handleError(err);
            console.log(blog);
            //保存上传图片
            var filesTmp = JSON.stringify(files);
            var pr = JSON.parse(filesTmp);
            if(err){
                console.log('parse error: ' + err);
            }else{
                for(var i = 0; i < pr.attach_image.length; i ++ ){
                    var inputFile = files.attach_image[i];//获取第一个文件
                    //console.log(inputFile);
                    var finalname = inputFile.originalFilename;//获取文件名称
                    //获取文件后缀
                    var suffix = finalname.split('.').pop().toLowerCase();
                    var new_path = "./public/uploadfiles/" + crypto.createHash('md5').update(finalname).digest('hex') + '.' + suffix;//获取文件名
                    var old_path = inputFile.path;//获取文件原路径
                    fs.renameSync(old_path, new_path);
                    /**
                     * 保存到uploadfile数据表
                     */
                    var uploadfile = new UploadFile({
                        filename: crypto.createHash('md5').update(finalname).digest('hex') + '.' + suffix,
                        filesize: inputFile.size,
                        filetype: inputFile.headers['content-type'],
                        created_at: new Date(),
                        blog: blog._id
                    });
                    uploadfile.save(function(err, uploadfile){
                        if(err) return handleError(err);
                        console.log(uploadfile);
                    });
                }
            }
        });
    });
    res.send({success:1});
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