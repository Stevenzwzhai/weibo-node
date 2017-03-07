$.ajaxSetup({
	headers:{'X-CSRF-Token' : $('meta[name=_token]').attr('content')},
	beforeSend: function(request) {
	    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	}
});
Date.prototype.toHyphenDateString = function() {
    var year = this.getFullYear();
    var month = this.getMonth() + 1;
    var date = this.getDate();
    if (month < 10) { month = "0" + month; }
    if (date < 10) { date = "0" + date; }
    var hours = this.getHours();
    var mins = this.getMin
    var mins = this.getMinutes();
    var second = this.getSeconds();
    return year + "-" + month + "-" + date + " " + hours + ":" + mins + ":" + second;
};
/**
 * 格式化日期
 */
function formatDate(s){
    var t = Date.parse(new Date(s));
    var newDate = new Date();
    newDate.setTime(t);
    return newDate.toLocaleString();
}
(function($){
  $.fn.serializeObject = function() {
    if ( !this.length ) { return false; }

    var $el = this,
      data = {},
      lookup = data; //current reference of data

      $el.find(':input[type!="checkbox"][type!="radio"], input:checked').each(function() {
        // data[a][b] becomes [ data, a, b ]
        var named = this.name.replace(/\[([^\]]+)?\]/g, ',$1').split(','),
            cap = named.length - 1,
            i = 0;

        for ( ; i < cap; i++ ) {
            // move down the tree - create objects or array if necessary
            lookup = lookup[ named[i] ] = lookup[ named[i] ] ||
                ( named[i+1] == "" ? [] : {} );
        }

        // at the end, psuh or assign the value
        if ( lookup.length != undefined ) {
             lookup.push( $(this).val() );
        }else {
              lookup[ named[ cap ] ]  = $(this).val();
        }

        // assign the reference back to root
        lookup = data;
      });

    return data;
  };
})(jQuery);

function expandAll() {
    if (!check()) {
        return;
    }
    var zTree = $.fn.zTree.getZTreeObj("tree");
    expandNodes(zTree.getNodes());
    if (!goAsync) {
        curStatus = "";
    }
}

function check() {
    if (curAsyncCount > 0) {
        return false;
    }
    return true;
}
function beforeAsync() {
    curAsyncCount++;
}
function onAsyncSuccess(event, treeId, treeNode, msg) {
    curAsyncCount--;
    if (curStatus == "expand") {
        expandNodes(treeNode.children);
    } else if (curStatus == "async") {
        asyncNodes(treeNode.children);
    }

    if (curAsyncCount <= 0) {
		curStatus = "";
    }
}
function expandNodes(nodes) {
            if (!nodes) return;
            curStatus = "expand";
            var zTree = $.fn.zTree.getZTreeObj("tree");
            for (var i=0, l=nodes.length; i<l; i++) {
                zTree.expandNode(nodes[i], true, false, false);//展开节点就会调用后台查询子节点
                if (nodes[i].isParent && nodes[i].zAsync) {
                    expandNodes(nodes[i].children);//递归
                } else {
                    goAsync = true;
                }
            }
        }
function fns(datar,pid){
    var result = [] , temp;
    for(var i in datar){
        if(datar[i].pid == pid){
            result.push(datar[i]);
            temp = fns(datar,datar[i].id);
            if(temp.length>0){
                datar[i].children=temp;
            }
        }
    }
    return result;
}
function sf(a){
    if(!a){return ''}
    var html='';
    for(var i=0;i<a.length;i++){
      if(a[i].children != undefined){
    	  html+='<li class="dropdown"><a href="'+a[i].url+'" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">'+a[i].display_name+'<span class="caret"></span></a><ul class="dropdown-menu">';
    	  html+=sf(a[i].children);
    	  html+='</ul></li>\n';
      }else{
    	  html+='<li><a href="'+getRootPath()+ '/public/' + a[i].url+'">'+a[i].display_name+'</a></li>';
      }
    };
    return html;
}
function getRootPath(){

    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp

    var curWwwPath=window.document.location.href;

    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp

    var pathName=window.document.location.pathname;

    var pos=curWwwPath.indexOf(pathName);

    //获取主机地址，如： http://localhost:8083

    var localhostPaht=curWwwPath.substring(0,pos);

    //获取带"/"的项目名，如：/uimcardprj

    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);

    return(localhostPaht+projectName);

}
function showCheck(a){
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.clearRect(0,0,1000,1000);
    ctx.font = "22px 'Microsoft Yahei'";
    ctx.fillText(a,0,24);
    ctx.fillStyle = "black";
}
var code ;
function createCode(){
    code = "";
    var codeLength = 4;
    var selectChar = new Array(1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','j','k','l','m','n','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z');
    for(var i=0;i<codeLength;i++) {
        var charIndex = Math.floor(Math.random()*60);
        code +=selectChar[charIndex];
    }
    if(code.length != codeLength){
        createCode();
    }
    showCheck(code);
    $("input#J_codetext").val("").attr('placeholder',"输入验证码");
}
/**
 * 验证码验证方法
 * @returns {boolean}
 */
function validate () {
    var inputCode = document.getElementById("J_codetext").value.toUpperCase();
    var codeToUp=code.toUpperCase();
    if(inputCode.length <=0) {
        document.getElementById("J_codetext").setAttribute("placeholder","输入验证码");
        createCode();
        return false;
    }
    else if(inputCode != codeToUp ){
        toastr.error('验证码错误');
        document.getElementById("J_codetext").value="";
        document.getElementById("J_codetext").setAttribute("placeholder","验证码错误");
        createCode();
        return false;
    }
    return true;
}