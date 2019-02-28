 //动态计算屏幕的宽度，从而得到网页的fontSize大小
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if(clientWidth>750) clientWidth=750;//这里限制最大的宽度尺寸，从而实现PC端的两边留白等
            docEl.style.fontSize = 10 * (clientWidth / 320) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

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


$(function(){
    $(".modal_box1 .btn").on("click",function(){
        $(this).parents(".modal_box1").fadeOut(200);
    })
    $(".my_collect .r").on("click",function(){
        $(".modal_box1").fadeIn("200");
    })

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

    $(".swipe_login.v1").on("click",function(){
        $(this).find(".HiddenList").slideToggle();
    });

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
            //$(".switch").css("backgroundImage","url(/static/images/mobile/login6.png)");
            $(".switch").find("img").attr({"src":"/static/images/mobile/login6.png"});
            $(".free.log").removeClass("active animated bounceIn").css("opacity","0");
            $(".free.reg").addClass("active animated bounceIn").css("opacity","1");
            $(".login_box").animate({"opacity":"1"},300).addClass("active");
            $(".regist_box").animate({"opacity":"0"},300).removeClass("active");
        }
        if(swi=="regist")
        {
            //$(".switch").css("backgroundImage","url(/static/images/mobile/login7.png)");
            $(".switch").find("img").attr({"src":"/static/images/mobile/login7.png"});
            $(".free.log").addClass("active animated bounceIn").css("opacity","1");
            $(".free.reg").removeClass("active animated bounceIn").css("opacity","0");
            $(".login_box").animate({"opacity":"0"},300).removeClass("active");
            $(".regist_box").animate({"opacity":"1"},300).addClass("active");
        }
    }


    $(".getCode").on("click",function(){
        var me=$(this);
        me
            .addClass("disabled")
            .text("60s")
            .attr('disabled',"true");

        var djs=setInterval(function(){
            var time=parseInt(me.text());
            time--;
            me.text(time+"s");
            if(time<0){
                clearInterval(djs);
                me.removeClass("disabled").removeAttr("disabled").text("点击获取验证码");
            }
        },1000);

        //$('#button').removeAttr("disabled"); 移除disabled属性
    });




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



    $('.sel').on("change",function () {    // 选择后替换内容并恢复箭头方向
        //$('span').html($('.sel').find('option:selected').html());
        //$('.sel_mask').find('img').attr('src','arrow_down.png');
        $(this).siblings("span").html($(this).find("option:selected").html());
        //$(this).siblings("img").attr("src","/static/images/mobile/order1.png");
        $(this).siblings("i").addClass("fa-caret-up");

    });

    //$('.sel').on("focus",function(){
    //    $(this).siblings("i").addClass("fa-caret-up");
    //})

    $('.sel').on("blur",function () {      //什么也不选恢复箭头方向
        //$(this).siblings("img").attr('src','/static/images/mobile/order1.png');
        $(this).siblings("i").removeClass("fa-caret-up");
        $(this).parents(".sel_mask").css("border","1px solid #ddd")
    })
    $('.sel').on("click",function(){     // 点击后更改箭头方向
        $(this).parents(".sel_mask").css("border","1px solid #db8329")
        //$(this).siblings("img").attr('src','/static/images/mobile/order1_h.png');
        $(this).siblings("i").addClass("fa-caret-up");
    })

    $(".tab1 .tb .st a:nth-child(3n)").css("margin-right","0");

    var curr;
    $(".body_r .btn").on("click",function(){
        $("html,body").removeClass("ovh");
        //$(".phone_header").addClass("is_shown")
        //$(".body_r").removeClass("is_shown");
        //$(".body_l").addClass("is_shown");
        $(".phone_header").animate({"left":"0"},300);
        $(".body_l").animate({"left":"0"},300);
        $(".body_r").animate({"left":"100%"},300);
        //console.log(curr);
        //
        //$("html,body").animate({"scrollTop":curr});

        //window.scrollTo(0,curr);
        $(".body_r").animate({"left":"100%"},300);

        //$(".body_l").css({"transform":"translateX(0%)"});
        //$(".body_r").css({"transform":"translateX(100%)"});

    })
    $(".filter").on("click",function(){
        $("html,body").addClass("ovh");

        //$(".phone_header").removeClass("is_shown")
        //$(".body_l").removeClass("is_shown");
        //$(".body_r").addClass("is_shown");
        $(".phone_header").animate({"left":"-100%"},300);
        $(".body_l").animate({"left":"-100%"},300);
        $(".body_r").animate({"left":"0%"},300);
        //curr=$(window).scrollTop();

        //$(".body_r").animate({"left":"0%"},300);

        //$(".body_l").css({"transform":"translateX(-100%)"});
        //$(".body_r").css({"transform":"translateX(0)"});

    })


    var xx,yy,XX,YY,swipeX,swipeY ;
    $("div")[0].addEventListener('touchstart',function(event){
        //event.stopPropagation();//阻止冒泡
        //event.preventDefault();//阻止浏览器默认事件
        xx = event.targetTouches[0].screenX ;
        yy = event.targetTouches[0].screenY ;
        swipeX = true;
        swipeY = true ;
    })
    $("div")[0].addEventListener('touchmove',function(event){
        XX = event.targetTouches[0].screenX ;//targetTouches是当前对象上所有触摸点的列表;绑定事件的那个结点上的触摸点的集合列表 位于当前DOM元素上的手指的一个列表。
        YY = event.targetTouches[0].screenY ;

        if(swipeX && Math.abs(XX-xx)-Math.abs(YY-yy)>0)  //左右滑动
        {
            //event.stopPropagation();//阻止冒泡
            //event.preventDefault();//阻止浏览器默认事件
            swipeY = false ;
            //左右滑动
        }
        else if(swipeY && Math.abs(XX-xx)-Math.abs(YY-yy)<0){  //上下滑动
            swipeX = false ;
            //上下滑动，使用浏览器默认的上下滑动
        }
    })
    $("div")[0].addEventListener('touchend',function(event){
        //event.stopPropagation();//阻止冒泡
        //event.preventDefault();//阻止浏览器默认事件
    })


    function GetSlideDirection(startX, startY, endX, endY) {
        var dy = startY - endY;
        //var dx = endX - startX;
        var result = 0;
        if(dy>0) {//向上滑动
            result=1;
        }else if(dy==0){//向下滑动
            result=0;
        }else{
            result=2;
        }
        return result;
    }

//滑动处理
    var scrollH;
    up_down();
    function up_down(){
        var startX, startY;
        var moveX, moveY;
        var number=0;
        var pH=$(".phone_header").height();
        document.addEventListener('touchstart',function (ev) {
            startX = ev.touches[0].pageX;//touches是当前屏幕上所有触摸点的列表;当前屏幕上所有触摸点的集合列表 当前位于屏幕上的所有手指的一个列表。
            startY = ev.touches[0].pageY;

        }, false);

        //document.addEventListener('touchmove',function (ev) {
        //    //moveX = ev.touches[0].pageX; //获取当前点击位置x坐标
        //    //moveY = ev.touches[0].pageY; //获取当前点击位置y坐标
        //    //console.log(ev.targetTouches[0]);
        //
        //    //console.log(parseInt((startY-moveY)/pH*100));
        //    //if((Math.abs(startY-moveY)/pH*100)>=100){
        //    //    return false;
        //    //}
        //    //$(".phone_header .top_1").css("transform","translateY("+parseInt((Math.abs(startY-moveY)/pH*100))+"%)");
        //    //$(".phone_header .top_2").css("transform","translateY("+parseInt(100-(Math.abs(startY-moveY)/pH*100))+"%)")
        //    //$("#box").css("height",vh);
        //})

        document.addEventListener('touchend',function (ev) {
            var endX, endY;
            endX = ev.changedTouches[0].pageX;//changedTouches是涉及当前事件的触摸点的列表。触发事件时改变的触摸点的集合 涉及当前事件的手指的一个列表
            endY = ev.changedTouches[0].pageY;
            var target=ev.target;
            //console.log(scrollH);
            //console.log(ev.target.className=="swipe_control fr");
            //if(target.className=="iconfont icon-caidan"){
            //    target=target.parentNode;
            //}
            ////console.log(target);
            //if(target.className=="swipe_control fr"){
            //    return false;
            //}
            var direction = GetSlideDirection(startX, startY, endX, endY);
            switch(direction) {
                case 0:
                    //console.log("无动作");
                    break;
                case 1:
                    // 向上
                    //console.log("上拉");
                    //    if(clicked){
                    //        return false;
                    //    }


                    //if(scrollH>pH/*||scrollH==undefined*/){
                    //    if(swipeX && Math.abs(XX-xx)-Math.abs(YY-yy)>0)  //左右滑动
                    //    {
                    //        //event.stopPropagation();//阻止冒泡
                    //        //event.preventDefault();//阻止浏览器默认事件
                    //        swipeY = false ;
                    //        //左右滑动
                    //    }
                    //    else if(swipeY && Math.abs(XX-xx)-Math.abs(YY-yy)<0){  //上下滑动
                    //        swipeX = false ;
                    //        //上下滑动，使用浏览器默认的上下滑动
                    //        $(".phone_header .top_2").removeClass("is_shown");
                    //        $(".phone_header .top_1").addClass("is_shown");
                    //    }
                    //}

                    break;
                case 2:
                    // 向下
                    //console.log("下拉");
                    if(ev.target.className=="swipe_nav"||$(ev.target).parents("#swipe_nav").length){
                        return false;
                    }
                    //if(scrollH<=0/*||scrollH==undefined*/){
                    //    //console.log(Math.abs(startY-endY));
                    //
                    //    if(swipeX && Math.abs(XX-xx)-Math.abs(YY-yy)>0)  //左右滑动
                    //    {
                    //        //event.stopPropagation();//阻止冒泡
                    //        //event.preventDefault();//阻止浏览器默认事件
                    //        swipeY = false ;
                    //        //左右滑动
                    //    }
                    //    else if(swipeY && Math.abs(XX-xx)-Math.abs(YY-yy)<0){  //上下滑动
                    //        swipeX = false ;
                    //        //上下滑动，使用浏览器默认的上下滑动
                    //        $(".phone_header .top_1").removeClass("is_shown");
                    //        $(".phone_header .top_2").addClass("is_shown");
                    //    }
                    //
                    //}
                    break;

                default:
            }
        }, false);
    }

    //function scroll_no(){
    //    $("body").on("touchmove",function(event){
    //        event.preventDefault;
    //    }, false);
    //
    //    //$("body").on("touchend",function(){
    //    //    $(this).off("touchmove");
    //    //})
    //}

    //function scroll_yes(){
    //    $("body").off("touchmove");
    //}
    if($(".phone_header").length){
        var main=$(".phone_header");
        var hammertime = new Hammer(main[0]);
        hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        hammertime.on("panup", scrollFun);
        hammertime.on("pandown", scrollFun);
        function scrollFun(event){
            //if(event.target.offsetParent.className=="categories"){
            //    return false;
            //}
            //console.log($(event.target).parents(".swipe_nav").length);
            //console.log($(event.target).hasClass("swipe_nav"));
            //event.srcEvent.cancelBubble=true;
            if($(event.target).parents(".swipe_nav").length||$(event.target).hasClass("swipe_nav")){
                //event.stopPropagation();//阻止冒泡
                //event.preventDefault();//阻止浏览器默认事件
                is_scroll=false;
                return false;
            }else if($(event.target).parents(".categories").length){
                //alert(33);
                return false;
            }else{
                //alert(44);
                if(event.type=="panup"){
                    //上滑
                    //console.log("上拉");
                    $(".phone_header .top_2").removeClass("is_shown");
                    $(".phone_header .top_1").addClass("is_shown");
                    return false;
                }
                if(event.type=="pandown"){
                    //下滑
                    //console.log("下拉");
                    $(".phone_header .top_1").removeClass("is_shown");
                    $(".phone_header .top_2").addClass("is_shown");
                    return false;
                }
            }
            return false;


        }

    }
    var is_scroll=true;
    $(window).on("scroll",function (e) {
         scrollH=$(window).scrollTop();
            //console.log(scrollH);
        if(is_scroll){
            this.swi();
        }else{
            console.log("不能滚了");
            return false;
        }

    });
    if($(".phone_header").length){
        var pH=$(".phone_header").height();
    }
    window.swi=function(){
        if(scrollH>pH){
            $(".phone_header .top_1").removeClass("is_shown");
            $(".phone_header .top_2").addClass("is_shown");
        }else{
            $(".phone_header .top_2").removeClass("is_shown");
            $(".phone_header .top_1").addClass("is_shown");
        }

    }

    var open=true;
    $(".categories .cate_tit").on("click",function()
    {
        $(this).find("i").toggleClass("fa-minus");

        var has = $(this).next(".cate_box").hasClass("user_box");

        if(has)
        {
            if($(this).next(".cate_box").css('display') == 'block')
            {
                $(this).next(".cate_box").hide();
            }
            else
            {
                $(this).next(".cate_box").show();
            }
        }
        else
        {
            $(this).next(".cate_box").slideToggle();

            

            if(open){
               $("html,body").addClass("ovh");
               open=false;
            }else{
               $("html,body").removeClass("ovh");
               open=true;
            }
        }
    });
   
    $(".cate_box .panel_title").on("click",function(e){
        var target= e.target;
        e.preventDefault();
        var href=$(this).prop("href");
        if($(target).parents(".categories.v1").length){
            if(!$(this).find("i").length){
                window.location.href=href;
            }
            return false;
        }
        if(!$(this).find("i").length){
            window.location.href=href;
        }

        $(this).next(".panel_body").slideToggle().end().parents(".panel").siblings().find(".panel_body").slideUp();
        $(this).find("i").toggleClass("fa-minus").parents(".panel").siblings().find("i").removeClass("fa-minus");
    })



    function isMobile(){
        return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/))
        );
    }
    var pwidth=$(window).width();
    var  show_swipe=false;
    //var clicked=false;
    $(".swipe_control").on("click",function(e){
        //clicked=true;
        is_scroll=true;
        if(show_swipe){
            $(".swipe_nav").animate({left:"-"+pwidth+"px"},300,"swing",function(){
            });
            //$(".swipe_nav>ul>.panel").each(function(){
            //    $(this).stop().animate({left:"-100px",'opacity':'0'},1000,"easeOutElastic",function(){
            //    })
            //});
            show_swipe=false;
        }else{
            var  itemTime=0;
            $(".swipe_nav").animate({left:"0px"},300,"swing",function(){
            });
            $(".swipe_nav>ul>.panel").css({left:"-100px",'opacity':'0'})
            $(".swipe_nav>ul>.panel").each(function(index,element){
                itemTime+=200;
                $(element).stop().delay(itemTime).animate({left:"0",'opacity':'1'},2000,"easeOutElastic", function () {

                })
            });
            show_swipe=true;
        }
    })
    //$(".swipe_control").on("touchend",function(){
    //
    //})

    $(".swipe_nav .panel_title").click(function(e)
    {
        e.preventDefault();
        var href=$(this).prop("href");
        var target= e.target;

        if(target.nodeName=="SPAN"&&target.className=="tiao")
        {
            window.location.href=href;
        }

        if($(this).find("i").length&&e.target.className!="tiao")
        {
            $(this).next("div.panel_body").slideToggle();
        }

        if($(this).find("i").length<=0){
            window.location.href=href;
        }

    });

    $(".swipe_search").click(function()
    {
        var search_con=$(".search_con");
        if(search_con.hasClass("active-search"))
        {
            //search_con.removeClass("active-search")
            search_con.removeClass("active-search")
        }
        else
        {
            search_con.addClass("active-search")
        }
    });

    $(".flow_tab .tab_list a").on("click",function(e)
    {
        e.preventDefault();
    });

    $(".flow_tab .tab_list").on("click","a",function()
    {
        var index=$(this).index();
        $(this).addClass("active");
        $(this).siblings("a").removeClass("active");
        $(this).parents('.tab_list').parent('.in')
            .siblings('.tab_box')
            .children('.tb').eq(index).stop().animate({"opacity":1},300).addClass("active")
            .siblings(".tb").stop().animate({"opacity":0},300).removeClass("active");
    }).trigger("click");

    $(".tab .tab_list a").on("click",function(e){
        e.preventDefault();
    });

    $(".tab .tab_list").on("click","a",function(){
        var index=$(this).index();
        $(this).addClass("active");
        $(this).siblings("a").removeClass("active");
        $(this).parents('.tab_list')
            .siblings('.tab_box')
            .children('.tb').eq(index).stop().animate({"opacity":1},300).addClass("active")
            .siblings(".tb").stop().animate({"opacity":0},300).removeClass("active");
    }).trigger("click");

    $(".footer_list").on("click","a",function(){
        var index=$(this).index();
        $(this).addClass("active");
        $(this).siblings("a").removeClass("active");
        $(this).parents('.tab_list')
            .siblings('.tab_box')
            .children('.tb').eq(index).stop().animate({"opacity":1},300).addClass("active")
            .siblings(".tb").stop().animate({"opacity":0},300).removeClass("active");
    }).trigger("mouseover");
});
