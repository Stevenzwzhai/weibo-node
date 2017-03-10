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
router.post('/create', function(req, res, next){
    var blog = new Blog({
        blog_id:req.body.blog_id,
        user:req.session.user_id,
        from:req.session.from,
        content:req.body.content,
        praise:0
    });
    blog.save(function(err){
        if(err) return handleError(err);
        res.json(blog);
    });
});
/**
 * 添加blog附件
 */
router.post('/createImgByBlogId', function(req, res, next){
    //保存上传图片逻辑
    var form = new multiparty.Form();//实例一个multiparty
    form.uploadDir = "./public/uploadfiles/";//设置文件储存路径
    //开始解析前台传过来的文件
    form.parse(req, function(err, fields, files){
        console.log('new blog'+fields.blog_id[0]);
        var filesTmp = JSON.stringify(files);
        var pr = JSON.parse(filesTmp);
        if(err){
            console.log('parse error: ' + err);
        }else{
            for(var i = 0; i < pr.attach_image.length; i ++ ){
                var inputFile = files.attach_image[i];//获取第一个文件
                var finalname = inputFile.originalFilename;//获取文件名称
                //获取文件后缀
                var suffix = finalname.split('.').pop().toLowerCase();
                var new_path = "./public/uploadfiles/" + crypto.createHash('md5').update(finalname + fields.blog_id[0]).digest('hex') + '.' + suffix;//获取文件名
                var old_path = inputFile.path;//获取文件原路径
                fs.renameSync(old_path, new_path);
                var uploadfile = new UploadFile({
                    filename: crypto.createHash('md5').update(finalname + fields.blog_id[0]).digest('hex') + '.' + suffix,
                    filesize: inputFile.size,
                    filetype: inputFile.headers['content-type'],
                    created_at: new Date()
                });
                uploadfile.save(function(err, uploadfile){
                    if(err) return handleError(err);
                    Blog.update({'blog_id':fields.blog_id[0]},{'$addToSet':{'attach':{'filename':uploadfile.filename}}},function(err, res){
                        if(err) return handleError(err);
                        console.log(res);
                    });
                });
            }
        }
    });
    res.json({success:'图片上传成功'});
});
/**
 * 删除指定id博客
 */
router.get('/delete/:id',function(req, res, next){
    var id = mongoose.Types.ObjectId(req.params.id);
    //删照片
    Blog.findOne({_id:id}, 'attach', function(err, blog){
        if(err) return handleError(err);
        console.log(blog.attach);
        for(var i = 0; i<blog.attach.length; i++){
            //删文件
            fs.unlinkSync("./public/uploadfiles/" + blog.attach[i].filename);
            //删除数据
            UploadFile.remove({_id:blog.attach[i]._id}, function(err){
                if(err) return handleError(err);
            });
        }
        //删完照片删博客
        Blog.remove({_id:id}, function(err){
            if(err) return handleError(err);
            res.json({success:1});
        });
    });
});
/**
 * 初始化新建博客
 */
router.get('/new', function(req, res, next){
    var blog = new Blog({
        blog_id: req.session.user_id + new Date().getTime() + 'blog',//生成博客的业务id
        user:  req.session.user_id,
        created_at: new Date(),
        from: '微博weibo.com',
        praise : 0
    });
    console.log(blog);
    res.json(blog);
})
module.exports = router;