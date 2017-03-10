var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name:String,
    password:String,
    avatar:String,
    certification:Number,
    level:Number
});
exports.User = mongoose.model('user', UserSchema);
var BlogSchema = mongoose.Schema({
    blog_id: String,
    user:  {type : mongoose.Schema.Types.ObjectId, ref : 'user'},
    created_at: { type : Date, default : Date.now },
    updated_at: Date,
    from: String,
    content: String,
    attach: [{ filename : String }],
    comments: [{content : String, data: Date, user_id : Number}],
    praise : Number
});
exports.Blog = mongoose.model('blog', BlogSchema);
var UploadFileSchema = mongoose.Schema({
    filename:String,
    filesize:Number,
    filetype:String,
    created_at:Date,
    blog:{type: mongoose.Schema.Types.ObjectId, ref: 'blog'}
});
exports.UploadFile = mongoose.model('uploadfile', UploadFileSchema);