
if (!function() {}.bind) {
    Function.prototype.bind = function(context) {
        var self = this
            , args = Array.prototype.slice.call(arguments);

        return function() {
            return self.apply(context, args.slice(1));
        }
    };
}
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (prefix){
        return this.slice(0, prefix.length) === prefix;
    };
}
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

Function.prototype.method = function(name, func) {

    this.prototype[name] = func;

    return this;

};

if(String.prototype.trim) { //判断下浏览器是否自带有trim()方法

    String.method('trim', function () {

        return this.replace(/^\s+|\s+$/g, '');

    });

    String.method('ltrim', function () {

        return this.replace(/^\s+/g, '');

    });

    String.method('rtrim', function () {

        return this.replace(/\s+$/g, '');

    })

}

//HTMLElement.prototype.getElemTop=function(){
//    var elem=this;
//    var total=0;
//    //将elem的offsetTop累加到total中
//    total+=elem.offsetTop;
//    //只要elem的offsetParent不是null
//    while(elem.offsetParent){
//        //将elem换成offsetParent
//        elem=elem.offsetParent;
//        //将elem的offsetTop累加到total中
//        total+=elem.offsetTop;
//    }
//    return total;
//}

//判断浏览器是否支持 placeholder属性
function isPlaceholder(){
    var input = document.createElement('input');
    return 'placeholder' in input;
}
if (!isPlaceholder()) {//不支持placeholder 用jquery来完成
    $(document).ready(function() {
        if(!isPlaceholder()){
            $("input").not("input[type='password']").each(//把input绑定事件 排除password框
                function(){
                    if($(this).val()=="" && $(this).attr("placeholder")!=""){
                        $(this).val($(this).attr("placeholder"));
                        $(this).focus(function(){
                            if($(this).val()==$(this).attr("placeholder")) $(this).val("");
                        });
                        $(this).blur(function(){
                            if($(this).val()=="") $(this).val($(this).attr("placeholder"));
                        });
                    }
                });
            //对password框的特殊处理1.创建一个text框 2获取焦点和失去焦点的时候切换
           $("input[type='password']").each(function(){
               if($(this).val()=="" && $(this).attr("placeholder")!=""){
                   var pwdField=$(this);
                   var pwdVal      = pwdField.attr('placeholder');
                   pwdField.after('<input class="pwdPlaceholder" type="text" value='+pwdVal+' autocomplete="off" />');
                   var pwdPlaceholder = pwdField.next('.pwdPlaceholder');
                   //pwdPlaceholder.css("color","#999")
                   pwdPlaceholder.show();
                   pwdField.hide();
                   $(pwdPlaceholder).focus(function(){
                       $(this).hide();
                       pwdField.show();
                       pwdField.focus();
                   });

                   pwdField.blur(function(){
                       if(pwdField.val() == '') {
                           pwdPlaceholder.show();
                           pwdField.hide();
                       }
                   });
               }

            });
        }
    });

}

function setCookie(name,value) {
    var Days = 10; //此 cookie 将被保存 30 天
    var exp  = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    if((typeof value == "string")&&(value.length > 0)){
        document.cookie = name + "="+ escape(value) + ";expires=" + exp.toGMTString();
    }else{
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null)
            document.cookie=name +"="+cval+";expires="+exp.toGMTString();
    }
}
function getCookie(name) {
    // (^| )name=([^;]*)(;|$),match[0]为与整个正则表达式匹配的字符串，match[i]为正则表达式捕获数组相匹配的数组；
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) {
        return unescape(arr[2]);
    }
    return null;
}

$.fn.extend({
    limitWord:function(param) {
        param=$.extend({
            "num":100
        },param);
        $(this).each(function(index,element){
            var curNum= $.trim($(this).text()).length;
            var curText= $.trim($(this).text());
            if(curNum>param.num){
                $(element).text(curText.substring(0,param.num)+"......");
            }
        })
        return $(this);
    }
});

window.getHeight= function(){
    if(window.innerHeight!= undefined){
        return window.innerHeight;
    }
    else{
        var B= document.body, D= document.documentElement;
        return Math.min(D.clientHeight, B.clientHeight);
    }
}

function once(fn) {
    var result;

    return  function() {
        if(fn) {
            result = fn.apply(this, arguments);
            fn = null;
        }
        return result;
    };
}

$(".modal_box1 .btn").on("click",function(){
    $(this).parents(".modal_box1").fadeOut(200);
})
$(".my_collect .r").on("click",function(){
    $(".modal_box1").fadeIn("200");
})

$(".person .panel_body a").on("click",function(e){
    e.preventDefault();
    var href=$(this).attr("href");
    var position=$(href).offset().top-200;
    $("html,body").animate({"scrollTop":position});
})

function getH(){
    var style=$(".person .m1");
    var h=parseFloat(style.outerHeight());
    var FHEIGHT=h;
    var wHeight=getHeight();
    var lower=wHeight-wHeight*90/100;
    var UPLEVEL=(wHeight-FHEIGHT)/2;
    var DOWNLEVEL=UPLEVEL+FHEIGHT;
    //console.log(UPLEVEL);
    //console.log(DOWNLEVEL);
    $(window).on("scroll",function(){
        checkFloor(UPLEVEL,DOWNLEVEL,lower);
    }).trigger("scroll");

}

getH();
var num=true;
function checkFloor(UPLEVEL,DOWNLEVEL,lower){

    $(".person .m").each(function(i,e){
        var innerTop=$(e).offset().top-$(document).scrollTop();//元素的上边线
        var innerBottom=innerTop+$(e).outerHeight();//元素的下边线
        if($(e).is(".m1")){
            innerTop+=100;
        }
        //if($(e).is(".mod2")){
        //    innerTop+=50;
        //}

        //if($(e).is(".mod3")){
        //    innerTop+=50;
        //}211.149.242.79
        if((innerTop>=UPLEVEL)&&(innerTop<DOWNLEVEL)){
            modIn(e);
        }else{
            //modOut(e);
        }
    });
}
function modIn(e){
    if($(e).is(".m1")){
        //open($(".person .swipe_nav .panel.first .wrap"));
        $(".person .swipe_nav .panel.first .wrap a").addClass("active").parents(".panel").siblings().find(".wrap a").removeClass("active");
    }

    if($(e).is(".m3")){
        //open($(".person .swipe_nav .panel:nth-child(2) .wrap"));
        $(".person .swipe_nav .panel:nth-child(2) .wrap a").addClass("active").parents(".panel").siblings().find(".wrap a").removeClass("active");
    }
}

function modOut(e){
    if($(e).is(".m1")){
       close($(".person .swipe_nav .panel.first .wrap"));
    }
    if($(e).is(".m3")){
        close($(".person .swipe_nav .panel:nth-child(2) .wrap"));
        //console.log($(".person .swipe_nav .panel.first .wrap"));
    }
}
numUp("#svg1",0.003,1.8);
numUp("#svg2",0.003,2.3);
numUp("#svg3",0.005,1.2);
numUp("#svg4",0.005,1.66667);
function numUp(elem,speed,per){
    //speed 0.02一秒走200%；
    //speed 0.01一秒走100%；
    //speed 0.001一秒走10%；
    //speed 0.002一秒走20%；
    //speed 0.005一秒走50%；
    //per 1~100 1代表轨道走100%，2代表轨道走50%，4代表轨道走25%
    speed=speed?speed:0.01;

    if ($(elem).length){
        var svg = $(elem);
        var circle = svg.find(".progress");
        var r=parseInt(circle.attr("r"));
        var perimeter = Math.PI * 2 * r;
        var maxParent=svg.find(".max");//数字最大值父容器
        var max=parseInt(maxParent.text());
        var num=0;//数字初始值；
        var percent=0;//百分比
        var time=setInterval(function(){
            percent+=speed;
            num=parseInt(max*per*percent);
//                            circle.setAttribute('stroke-dasharray', perimeter * num/max + " " + perimeter);
            circle.attr('stroke-dasharray', perimeter * percent+ " " + perimeter);
//                            num+=1;
            maxParent.text(num)
            if(num>=max){
                maxParent.text(max);//设置回最大值，以防数字溢出
                clearInterval(time);
            }
        },10);
    }else{
        return false;
    }
    // var circle = document.querySelectorAll("circle")[1];
}

$(window).on("scroll",function(){
    var scrollH=$(this).scrollTop();
    if($(".activity .modL").length){
        var top=$(".activity .modL").offset().top;
        if(scrollH>top){
            //$(".person .mainLf").animate({"top":"100px"},function(){
            //    $(this).addClass("fix");
            //});

            $(".activity .modR").addClass("fix");
        }else{
            $(".activity .modR").removeClass("fix");
        }
    }

    //$(".swipe_nav .panel.first .wrap").trigger("click");
    if($(".person .m1").length){
        var top=$(".person .m1").offset().top;

        if(scrollH>top){
            //$(".person .mainLf").animate({"top":"100px"},function(){
            //    $(this).addClass("fix");
            //});

            $(".person .mainLf").addClass("fix");
        }else{
            $(".person .mainLf").removeClass("fix");
        }
        //if(scrollH<=118){
        //    ////$(".person .mainLf").removeClass();
        //    //$(".person .mainLf").animate({"top":"0"},function(){
        //    //    $(this).removeClass("fix");
        //    //});
        //    //$(".person .mainLf").removeClass("fix");
        //}
    }

});

var disabled="yes";
$(".base_box .b i").on("click",function(){
    $(this).parents(".b").siblings(".b").find("i").removeClass("active").siblings("input").removeClass("active").attr('disabled',"true");
    if(disabled=="yes"){
        $(this).addClass("active").siblings("input").addClass("active").removeAttr('disabled').focus();
        disabled="no";

    }else{
        $(this).removeClass("active").siblings("input").removeClass("active").attr('disabled',"true").blur();
        disabled="yes";
    }
})
//$(".base_box .b input").on("blur",function(){
//    //$(this).removeClass("active").attr('disabled',"true").siblings("i").removeClass("active");
//    //disabled="yes";
//})

$(".login_box .in input,.regist_box .in input").on("focus",function(){
    $(this).parents(".in").addClass("active")
})
$(".login_box .in input,.regist_box .in input").on("blur",function(){
    $(this).parents(".in").removeClass("active")
})
var swi="login";
$(".switch").on("click",function(e){
    if(swi=="login"){
        login_regist(swi);
        swi="regist";
    }else{
        login_regist(swi);
        swi="login";
    }

}).trigger("click");
$("#goLogin").on("click",function(e){
    e.preventDefault();
    login_regist("login");
});
$("#goRegist").on("click",function(e){
    e.preventDefault();
    login_regist("regist");
});
function login_regist(swi){
    if(swi=="login"){
        $(".switch").css("backgroundImage","url(/static/images/icon/login6.png)");
        $(".free.log").removeClass("active animated bounceIn").css("opacity","0");
        $(".free.reg").addClass("active animated bounceIn").css("opacity","1");
        $(".login_box").animate({"opacity":"1"},300).addClass("active");
        $(".regist_box").animate({"opacity":"0"},300).removeClass("active");
    }
    if(swi=="regist")
    {
        $(".switch").css("backgroundImage","url(/static/images/icon/login7.png)");
        $(".free.log").addClass("active animated bounceIn").css("opacity","1");
        $(".free.reg").removeClass("active animated bounceIn").css("opacity","0");
        $(".login_box").animate({"opacity":"0"},300).removeClass("active");
        $(".regist_box").animate({"opacity":"1"},300).addClass("active");
    }
}

function job_box(){
    $(".job_box .panel_title").on("click",function(){
        var flag=true;
        if(flag){
            $(this).addClass("active");
            $(this).siblings(".panel_body").slideDown();
            $(this).parent().siblings().find(".panel_title").removeClass("active");
            $(this).parent().siblings().find(".panel_body").slideUp();
            flag=false;
        }else{
            $(this).removeClass("active");
            $(this).siblings(".panel_body").slideUp();
            flag=true;
        }
    })
}
job_box()

$(".focus input").on("blur",function(){
    $(this).parents(".focus").css("border","1px solid #ddd")
})
$(".focus input").on("focus",function(){
    $(this).parents(".focus").css("border","1px solid #ad9641")
})
$(".alertW").on("click",function(){
    $(".modal_box").fadeIn(200);
})
$(".modal_box .btn").on("click",function(){
    $(this).parents(".modal_box ").fadeOut(200);
});
function swipe_nav(){
    $(".swipe_nav .wrap").on("click",function(e){
        var flag=true;
        if($(this).hasClass("disabled")){
            return false;
        }
        if(flag){
            open($(this));
            flag=false;
        }else{
            //close($(this));
            //flag=true;
        }
    })
}

function open(me){
    me.find("i").text("－");
    me.find(".panel_title").addClass("active").end()
        .parent(".panel").siblings().find(".panel_body").slideUp()
        .parent(".panel").find(".panel_title").removeClass("active")
        .find("i").text("﹢");
    me.siblings(".panel_body").slideDown();
}

function close(me){
    me.find("i").text("﹢");
    me.siblings(".panel_body").slideUp();
}
swipe_nav();

$(".cate_box").on("mouseleave",function(){
    $(this).find(".c").removeClass("active");
    //console.log($(this).find(".c"));
})
$(".cate_box .c").on("mouseover",function(){
    $(this).addClass("active").siblings().removeClass("active");
});
$(".acti_list li .con span").limitWord({"num":"26"})

$("#car .prev").hover(function(){
    $(this).find("i").toggleClass("fa-angle-left").toggleClass("fa-long-arrow-left")
});
$("#car .next").hover(function(){
    $(this).find("i").toggleClass("fa-angle-right").toggleClass("fa-long-arrow-right")
});


$('.sel').change(function () {    // 选择后替换内容并恢复箭头方向
    //$('span').html($('.sel').find('option:selected').html());
    //$('.sel_mask').find('img').attr('src','arrow_down.png');
    $(this).siblings("span").html($(this).find("option:selected").html());
    $(this).siblings("img").attr("src","images/order1.png");
})
$('.sel').blur(function () {      //什么也不选恢复箭头方向
    $(this).siblings("img").attr('src','images/order1.png');
    $(this).parents(".sel_mask").css("border","1px solid #ddd")
})
$('.sel').click(function(){     // 点击后更改箭头方向
    $(this).parents(".sel_mask").css("border","1px solid #11b55f")
    $(this).siblings("img").attr('src','images/order1_h.png');
})

$(".categories").on("mouseover",function(){
    $(this).children("i").addClass("fa-caret-up");
})
$(".categories").on("mouseout",function(){
    $(this).children("i").removeClass("fa-caret-up");
})

$(".checkbox").on("click",function(){
    var checked=$(this).find("input:checkbox").prop("checked");//true false
   if(checked){
       $(this).addClass("active").parent().addClass("active")
   }else{
       $(this).removeClass("active").parent().removeClass("active")
   };

});

$(".getCode").on("click",function()
{
    var me=$(this), email = $.trim($("[name=email]").val()), time= 60;

    $("[name=code]").val("");

    if(!(/^[a-z\d]+@[a-z\d]+\.[a-z]+$/i.test(email)))
    {
        layui.layer.msg("邮箱地址格式不正确");
        return ;
    }

    layui.layer.msg("验证码发送中...");

    $.post(window.url, {email:email}, function(res)
    {
        layui.layer.msg(res.msg);

        if(1 == res.code)
        {
            me.addClass("disabled").text("60s").attr('disabled',"true");

            var djs=setInterval(function()
            {
                time--;
                me.text(time+"s");
            
                if(time<0)
                {
                    clearInterval(djs);
                    me.removeClass("disabled").removeAttr("disabled").text("点击获取验证码");
                }
            },1000);
        }
        
    }, "json");
    

    //$('#button').removeAttr("disabled"); 移除disabled属性
});

function nextP(){
    if(!$('#indexs li').is(':animated')){
        var pli = $('#indexs li').first().clone();
        $('#indexs').append(pli);
        $('#indexs li').first().animate({"margin-left":"-90px"},500,function(){
            $('#indexs li').first().remove();
        })
    }
}
function beforeP(){
    if(!$('#indexs li').is(':animated')){
        var pli2 =$('#indexs li').last().clone();
        $('#indexs').prepend(pli2);
        $('#indexs li').first().css('margin-left','-90px');
        $('#indexs li').first().animate({'margin-left':0},500,function(){
            $('#indexs li').last().remove();
        })
    }
}

$('#pointer .r_btn').click(function(){

    if(li_lenp>4){
        nextP();
    }

})
$('#pointer .l_btn').click(function(){
    if(li_lenp>4){
        beforeP();
    }
})


$('.sel').on("change",function () {    // 选择后替换内容并恢复箭头方向
    //$('span').html($('.sel').find('option:selected').html());
    //$('.sel_mask').find('img').attr('src','arrow_down.png');
    $(this).siblings("span").html($(this).find("option:selected").html());
    //$(this).siblings("img").attr("src","images/order1.png");
    $(this).siblings("i").addClass("fa-caret-up");

});

//$('.sel').on("focus",function(){
//    $(this).siblings("i").addClass("fa-caret-up");
//})

$('.sel').on("blur",function () {      //什么也不选恢复箭头方向
    //$(this).siblings("img").attr('src','images/order1.png');
    $(this).siblings("i").removeClass("fa-caret-up");
    $(this).parents(".sel_mask").css("border","1px solid #ddd")
})
$('.sel').on("click",function(){     // 点击后更改箭头方向
    $(this).parents(".sel_mask").css("border","1px solid #db8329")
    //$(this).siblings("img").attr('src','images/order1_h.png');
    $(this).siblings("i").addClass("fa-caret-up");
})

$(".flow_tab .tab_list a").on("click",function(e)
{
    e.preventDefault();
})

$(".flow_tab .tab_list").on("mouseover","a",function(){
    var index=$(this).index();
    var curr=parseInt($(this)[0].className.slice(1,2))-1;
    $(this).addClass("active");
    $(this).siblings("a").removeClass("active");
    $(this).parents('.tab_list')
        .siblings('.tab_box')
        .children('.tb').eq(index).stop().animate({"opacity":1},300).addClass("active")
        .siblings(".tb").stop().animate({"opacity":0},300).removeClass("active");

    if(curr>=4){
        $(this).parents('.tab_list')
            .siblings('.tab_box')
            .children('.tb').eq(curr).stop().animate({"opacity":1},300).addClass("active")
            .siblings(".tb").stop().animate({"opacity":0},300).removeClass("active");
    }
    if($(this).parent()[0].className.endsWith("fl")){
        $(".flow_tab .tab_list.fr").find("a").removeClass("active");
    }
    if($(this).parent()[0].className.endsWith("fr")){
        $(".flow_tab .tab_list.fl").find("a").removeClass("active");
    }

}).trigger("mouseover");


$(".tab .tab_list a").on("click",function(e){
    e.preventDefault();
})
$(".tab .tab_list").on("mouseover","a",function(){
    var index=$(this).index();
    $(this).addClass("active");
    $(this).siblings("a").removeClass("active");
    $(this).parents('.tab_list')
        .siblings('.tab_box')
        .children('.tb').eq(index).stop().animate({"opacity":1},300).addClass("active")
        .siblings(".tb").stop().animate({"opacity":0},300).removeClass("active");
}).trigger("mouseover");

$(".footer_list").on("click","a",function(){
    var index=$(this).index();
    $(this).addClass("active");
    $(this).siblings("a").removeClass("active");
    $(this).parents('.tab_list')
        .siblings('.tab_box')
        .children('.tb').eq(index).stop().animate({"opacity":1},300).addClass("active")
        .siblings(".tb").stop().animate({"opacity":0},300).removeClass("active");
}).trigger("mouseover");

layui.use('layer', function()
{
    window.layer = layui.layer;
});