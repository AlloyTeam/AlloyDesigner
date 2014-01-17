(function(){
    var $ = function(id){
        return document.getElementById(id);
    };
    var Main = {
        init: function(){
            this.renderIntro();
            window.onload = function(){
                Main.flashPic();
            };
        },

        renderIntro: function(){
            var data = {
                list: [
                    {intro: "Chrome WebStore插件支持", subIntro: "从WebStore安装插件，轻松打开视觉稿进行体验、开发、测试", color: "rgb(41, 50, 225)"},
                    {intro: "嵌入代码库方式，全面支持IE7+", subIntro: "&lt;script src='alloydesigner.js' type='text/javascript'>&lt;/script>", color: "rgb(203, 0, 9)"},
                    {intro: "收藏夹工具支持，无需手动嵌入代码", subIntro: "添加至Chrome、Mordern IE收藏栏使用", color: "rgb(30, 170, 56)"},
                    {intro: "强大记忆恢复功能", subIntro: "刷新后恢复上次状态，无需重新调整视觉稿位置", color: "rgb(255, 77, 16)"},
                    {intro: "便利的快捷键操作", subIntro: "使用易记的快捷键操作，进一步提高开发效率", color: "rgb(255, 77, 16)"},
                    {intro: "稳固的基础功能", subIntro: "固定视觉稿，调节透明度，测试开发等基础功能强健", color: "rgb(255, 77, 16)"},
                    {intro: "丰富的开发辅助工具", subIntro: "包含测距工具、CSS助手与取色器等快捷工具", color: "rgb(255, 77, 16)"},
                ]
            };

            Utils.renderTmpl("list", data);
        },

        flashPic: function(){
            var picLength = 3; 
            var flashPic = document.getElementById("flashPic");
            var i = 0;
            var delayTime = 4000;
            var animateTime = 1000;
            var animateObj = {
                stop: function(){}
            };

            var imgArr = [];

            var timer;

            //预加载图片
            for(var i = 0; i < picLength; i ++){
                var img = new Image();
                imgArr.push(img);

                img.src = "images/intro" + (i + 1) + ".png";
                img.onload = function(){
                };
            }

            var changePic = function(){
                animateObj = Utils.animate(flashPic, {opacity: 0}, animateTime, function(){
                    i ++;
                    i %= picLength;

                    flashPic.onload = function(){
                        animateObj = Utils.animate(flashPic, {opacity: 1}, animateTime,function(){
                            timer = setTimeout(function(){
                                changePic();
                            }, delayTime);
                        });
                    }
                    flashPic.src = "images/intro" + (i + 1) + ".png";
                });
            };

            timer = setTimeout(function(){
                changePic();
            }, delayTime);

            flashPic.onmouseover = function(){
                clearTimeout(timer);
                animateObj.stop();
                flashPic.style.opacity = "1";
            };

            flashPic.onmouseout = function(){
                animateObj.stop();
                clearTimeout(timer);
                changePic();
            };
        }
    };

    Main.init();
})();
