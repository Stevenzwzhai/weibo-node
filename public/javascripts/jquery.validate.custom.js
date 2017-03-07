//登录名只能由中文、英文、数字、和下划线组成
jQuery.validator.addMethod("login_name", function(value, element) {
    var char = /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/;
    return this.optional(element) || char.test(value);
}, $.validator.format("登录名只能包含中文、英文、数字、下划线"));
//登录名不能为纯数字
jQuery.validator.addMethod("number_check", function(value, element) {
    var reg = /^[\d]+$/i;
    if(reg.test(value)){
        return false;
    }else{
        return true;
    }
}, $.validator.format("不能为纯数字"));