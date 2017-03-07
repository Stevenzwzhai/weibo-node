$(function(){
    var username=document.cookie.split(";")[0].split("=")[1];
    if(username != null){
        $("input[name='name']").val(username);
        $("input[name='remember']").attr('checked',true);
    }
    createCode();
});
function toLogin(){
    $("button#login").click();
}
function trueLogin(){
        $("#userForm").validate({
            rules: {
                name: {
                    required: true,
                    login_name: true,
                    number_check: true,
                    minlength: 3
                },
                password: {
                    required: true,
                    minlength: 6
                },
                QRcode: {
                    required: true
                }
            },
            submitHandler:function(){
                if(validate()) {
                    var data = $("#userForm").serializeObject();
                    console.log(data);
                    $.ajax({
                        url: '/login',
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        async: true,
                        success: function (e) {
                            if (e.success == 1) {
                                toastr.success("登录成功，正在跳转......");
                                if ($("input[name='remember']").val() == 'true') {
                                    document.cookie = "name=" + data.name;
                                    console.log(document.cookie);
                                }
                                window.location.href = '/index';
                            }
                            if (e.error == 1) {
                                toastr.error("该用户不存在");
                                $("input[name='name']").val("");
                                $("input[name='password']").val("");
                                createCode();
                            }
                            if (e.error == 2) {
                                toastr.error("密码错误");
                                $("input[name='password']").val("");
                                createCode();
                            }
                        },
                        error: function (msg) {
                            console.log(msg.responseText);
                        }
                    });
                }
            }
        });
}
