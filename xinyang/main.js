var $ = function(name){
    return document.getElementById(name);
};

var canOper = 1;
var curr;
var count = 0;

var EventHelper = {
    //绑定tap事件
    bindTap: function(el, func){
        var startTime, touchmoveFlag = 0;
        var DTIME = 150, DDISTANCE = 10;

        var x0 = 0, y0 = 0;

        //touchstart时候记录位置 与时间
        el.ontouchstart = function(e){
            startTime = + new Date;
            touchmoveFlag = 0;

            x0 = e.pageX;
            y0 = e.pageY;

        };

        el.ontouchmove = function(e){
            touchmoveFlag = 1;

            var x = e.pageX;
            var y = e.pageY;
            var distance = Math.abs(x - x0) + Math.abs(y - y0);

            //如果偏移距离小于distance则认为没有偏移
            if(distance < DDISTANCE){
                touchmoveFlag = 0;
            }else{
                touchmoveFlag = 1;
            }
        };

        el.ontouchend = function(e){

            var dTime = + new Date - startTime;

            //如果时间在阈值内 则认为tap事件
            if(dTime < DTIME && ! touchmoveFlag){
                func.call(e.target, e);
            }
        };
    },

    onTap: function(){

        this.bindTap(document.body, function(e){
            if(! canOper) return;
            var target = e.target;
            Utils.parentIs(target, ".coins", function(node){
                Utils.addClass(node, "active");

                if(node.id == "up"){
                    Utils.addClass($("down"), "hide");

                    curr = "up";
                }else{
                    Utils.addClass($("up"), "hide");
                    curr = "down";
                }

                canOper = 0;

                setTimeout(function(){
                    Utils.addClass($("wrapper"), "fadeOut");
                    setTimeout(function(){
                        $("title").innerHTML = "一个好的断言<br />会决定一段时间的运气";
                        Utils.removeClass($("wrapper"), "fadeOut");


                        setTimeout(function(){
                            Utils.addClass($("wrapper"), "fadeOut");
                            Utils.addClass(node, "hide");
                            setTimeout(function(){
                                $("title").innerHTML = "即将揭晓，命运的安排";
                                Utils.removeClass($("wrapper"), "fadeOut");

                                setTimeout(function(){
                                    var result = cal(node);

                                    if(result){
                                        $("title2").innerHTML = "断言成功<br />它会给你带来好运的";
                                        Utils.addClass($("title2"), "success");
                                    }else{
                                        $("title2").innerHTML = "断言失败<br />";
                                        Utils.addClass($("title2"), "error");
                                    }

                                    Utils.removeClass($("wrapper"), "fadeOut");

                                    setTimeout(function(){
                                        Utils.removeClass($("title2"), "hide");

                                        count ++;

                                        window.localStorage.setItem(getKey(), count);
                                    }, 1000);

                                }, 3000);
                            }, 3000);

                        }, 3000);
                    }, 2000);
                }, 4000);
                
            });
        });
    }
};

EventHelper.onTap();

window.ontouchstart = window.ontouchend = function(e){
    e.preventDefault();
};

function cal(node){
    var m = Math.random();
    var result = 0;

    if(m > 0.5){
        Utils.addClass(node, "down");

        if(curr == "down") result = 1;
    }else{
        Utils.removeClass(node, "down");
        if(curr == "up") result = 1;
    }
    Utils.removeClass(node, "hide");

    return result;
}

var getKey = function(){
   var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth();
    var day = time.getDate();

    var key = [year, month, day].join("_");

    return key;
 
};

function check(){
    var key = getKey();
    count = ~~ window.localStorage.getItem(key);

    if(count > 4){
        canOper = 0;

        $("title").innerHTML = "断言太多了<br />明天再来吧";
    }
}

check();
