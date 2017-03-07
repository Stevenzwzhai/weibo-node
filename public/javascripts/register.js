function toRegister(){
    $("button#register").click();
}
function trueRegister(){
    $("#userForm").validate({
       rules: {
           name: {
               required: true,
               login_name: true,
               number_check: true,
               minlength: 5
           },
           password: {
               required: true,
               minlength: 6
           }
       },
        submitHandler:function(){
            var data = $("#userForm").serializeObject();
            console.log(data);
            $.ajax({
                url: '/register',
                type: 'POST',
                dataType: 'json',
                data: data,
                async: true,
                success: function (e) {
                    if(e.success == 1){
                        toastr.success("注册成功");
                        window.location.href = '/index';
                    }else if(e.success == 2){
                        toastr.error("该用户名已被注册");
                    }
                },
                error: function (msg) {
                    console.log(msg.responseText);
                }
            });
        }
    });
}
