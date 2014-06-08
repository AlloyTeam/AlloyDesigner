(function(M){
        var initRequest = function(option){
            var success = option.success;
            var url = option.url;
            var method = option.method;
            var data = option.data;

            var dataArr = [];
            for(var i in data){
                dataArr.push(i + "=" + data[i]);
            }

            if(method == "GET"){
                url += "?" + dataArr.join("&");
            }

            url += "&" + Math.random();

            var script = document.createElement("script");
            script.setAttribute("type","text/javascript");
            script.onload = function(){
                try{
                    var _this = this;
                    setTimeout(function(){
                        _this.parentNode.removeChild(_this);

                        script = null;
                    }, 300);
                }catch(e){
                }
            };

            script.src = url;

            document.body.appendChild(script);
    };

    var createInstance = function(){
        var xmlHttp;

        return new XMLHttpRequest();

        try{
            // Firefox,Opera 8.0+,Safari
            xmlHttp = new XMLHttpRequest();
        }catch(e){
            // Internet Explorer
            try{
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            }catch(e){
                try{
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }catch(e){
                    return false;
                }
            }
        }

        return xmlHttp;
    };

    var encodeHtmlSimple = function(sStr){
        sStr = sStr.replace(/&/g,"&amp;");
        sStr = sStr.replace(/>/g,"&gt;");
        sStr = sStr.replace(/</g,"&lt;");
        sStr = sStr.replace(/"/g,"&quot;");
        sStr = sStr.replace(/'/g,"&#39;");
        return sStr;
    };

        //将&#转为实际字符
    var converToReal = function(str){
        if(! str) return "";
        var reg = /\&#(\d+);/g;

        return str.replace(reg, function(w, d){
            return String.fromCharCode(d)
        });
    };

    /**
	 * 转义attribute 
	 * @param {String} str 需要转义的字符
	 */
	var encodeAttr = function(str){
        var sStr;
		sStr = str;
		sStr += '';
		sStr = sStr.replace(/&/g,"&amp;");
		sStr = sStr.replace(/>/g,"&gt;");
		sStr = sStr.replace(/</g,"&lt;");
		sStr = sStr.replace(/"/g,"&quot;");
		sStr = sStr.replace(/'/g,"&#39;");
		sStr = sStr.replace(/=/g,"&#61;");
		sStr = sStr.replace(/`/g,"&#96;");
		return sStr;		
	}	

    var getTmpl = function(tmplStr, data){
        var result;

        var varHtml = "";
        for(var i in data){
            varHtml += "var " + i + " = data." + i + ";";
        }

        tmplStr = tmplStr.replace(/\s+/g, " ");
        tmplStr = varHtml + "var __result = ''; ?>" + tmplStr + "<?";
        tmplStr += " return __result;";
        tmplStr = tmplStr.replace(/<\?=([^\?]+)\?>/g, "' + $1 + '").replace(/<\?\+([^\?]+)\?>/g, "' + _Utils.encodeHtmlSimple($1) + '").replace(/<\?-([^\?]+)\?>/g, "' + _Utils.encodeAttr($1) + '").replace(/<\?/gi, "';").replace(/\?>/g,"__result += '");

        var str = new Function("data", "_Utils", tmplStr);
        result = str(data, Utils);

        return result;
    };

    //保留上次的el地址，便于清除
    var lastRenderEls = {};

    var renderTmpl = function(id, data, isAppend){
        var tmplNode = document.getElementById(id);
        var tmplString = tmplNode.innerHTML;
        var result = getTmpl(tmplString, data);

        if(! lastRenderEls[id]) lastRenderEls[id] = [];

        if(! isAppend){
            //清除上次的渲染
            for(var i = 0; i < lastRenderEls[id].length; i ++){
                var lastItem = lastRenderEls[id][i];

                lastItem.parentNode.removeChild(lastItem);
            }
        }

        lastRenderEls[id] = [];


        var div = document.createElement("div");
        div.innerHTML = result;

        var divChildren = div.childNodes;

        while(divChildren.length > 0){
            lastRenderEls[id].push(divChildren[0]);

            tmplNode.parentNode.insertBefore(divChildren[0], tmplNode);
        }
    };
        var addEvent = function(proxyNode, selector, eventType, func){//为代理节点添加事件监听
                var proName = "",flag = 0;
                if(typeof(selector) == "string"){

                    flag = 1;
                    switch(true){
                        case /^\./.test(selector) :
                            proName = "className";
                            selector = selector.replace(".", "");
                            selector = new RegExp(" *" + selector + " *");
                            break;
                        case /^\#/.test(selector) :
                            proName = "id";
                            selector = new RegExp(selector.replace("#", ""));
                            break;
                        default: 
                            selector = new RegExp(selector.toLowerCase());
                            proName = "tagName";
                    }

                }

                var addEvent = window.addEventListener ? "addEventListener" : "attachEvent";
                var eventType = window.addEventListener ? eventType : "on" + eventType;

                proxyNode[addEvent](eventType,function(e){

                        function check(node){

                            if(flag){
                                var name = node[proName];

                                if(proName == 'tagName') name = name.toLowerCase();
                                if(selector.test(name)){

                                    func.call(node, e);
                                    return;
                                };
                            }else{
                                if(selector == node){
                                    func.call(node, e);
                                    return;
                                };
                            }

                            if(node == proxyNode || node.parentNode == proxyNode) return;
                            check(node.parentNode);
                        }

                        check(e.srcElement);
                });
    };
      //读取元素的css属性值
      var css = function(el, property){
        try{
            return el.currentStyle[property] || el.style[property];
        }catch(e){
            var computedStyle = getComputedStyle(el);
            return computedStyle.getPropertyValue(property);
        }
      };

          //执行动画   类似jquery animate
      var animate = function(el, endCss, time, callBack){
         var FPS = 60;
         var everyStep = {}, currStyle = {};

         for(var i in endCss){
           var currValue = parseInt(this.css(el, i));
           currStyle[i] = currValue;

           everyStep[i] = parseInt(parseInt(endCss[i]) - currValue) / time;
         }

         //当前frame
         var frame = 0, timer;

         function step(){
           frame ++;

           //当前时间 ms
           var t = frame / FPS * 1000;

           //对时间做缓动变换

           //标准化当前时间
           var t0 = t / time;

           //变换函数
           var f = function(x, p0, p1, p2, p3){

             //二次贝塞尔曲线
             //return Math.pow((1 - x), 2) * p0 + (2 * x) * (1 - x) * p1 + x * x * p2; 

             //基于三次贝塞尔曲线 
             return p0 * Math.pow((1 - x), 3) + 3 * p1 * x * Math.pow((1 - x), 2) + 3 * p2 * x * x * (1 - x) + p3 * Math.pow(x, 3);
           }

           //对时间进行三次贝塞尔变换 输出时间
           var t1 = f(t0, 0.3, 0.82, 1.0, 1.0) * time;

           for(var i in everyStep){
             if(i == "opacity") el.style[i] = (currStyle[i] + everyStep[i] * t1);
             else el.style[i] = (currStyle[i] + everyStep[i] * t1) + "px";
           }

           if(frame == time / 1000 * FPS){
             clearInterval(timer);
             callBack && callBack();
           }
         }

         timer = setInterval(step, 1000 / FPS);

         return {
            stop: function(){
                clearInterval(timer);
            }
         };

      };

      var getUrlParam = function (n) { 
            var m = window.location.search.match(new RegExp('(\\?|&)' + n + '=([^&]*)(&|$)'));   
            return !m ? '' : decodeURIComponent(m[2]);  
        };

      var getParentData = function(node, dataName){
        var parentNode = node;

        while(parentNode){
            if(parentNode.dataset && parentNode.dataset[dataName]){
                return parentNode.dataset[dataName];
            }

            parentNode = parentNode.parentNode;
        }

      };
      var parentIs =  function(el, parentSelector, func){
            if(! el) return;

            var proName;
            var selector = parentSelector;

            var parentNode;

            switch(true){
                case /^\./.test(selector) :
                    proName = "className";
                    selector = selector.replace(".", "");
                    selector = new RegExp(" *" + selector + " *");
                    break;
                case /^\#/.test(selector) :
                    proName = "id";
                    selector = new RegExp(selector.replace("#", ""));
                    break;
                default: 
                    selector = new RegExp(selector.toLowerCase());
                    proName = "tagName";
            }

            var flag = 0;

            function checkParent(el){
                if(selector.test(el[proName])){
                    parentNode = el;
                    flag = 1;
                    return;
                }else{
                    if(el.parentNode){
                        checkParent(el.parentNode);
                    }else{
                    }
                }
            }

            checkParent(el);

            if(flag){
                func && func(parentNode);
            }

            return flag;
        };

    var scrollData = {
        scrollEl: [],
        bindScroll: function (el, func) {
            // check if bottom
            el.addEventListener('scroll', function () {
                var scrollTop, scrollHeight, height;
                if(el == window){
                    scrollTop = el.pageYOffset;
                    scrollHeight = document.body.scrollHeight;
                    height = window.innerHeight;
                }else{
                    scrollTop = el.scrollTop;
                    scrollHeight = el.scrollHeight;
                    height = el.offsetHeight;
                }

                if(height + scrollTop > scrollHeight - 2){
                    func();
                }
            });
        },
        push: function(el, func) {
            this.bindScroll(el, func);
        }
    };

      var addClass = function(el, className){
        if(el.className.match(className)){
        }else{
          el.className += " " + className;
        }
      };

      var removeClass = function(el, className){
        el.className = el.className.replace(new RegExp(" ?" + className), "");
      };

   var utils = {
        request: initRequest,
        getTmpl: getTmpl,
        renderTmpl: renderTmpl,
        addEvent: addEvent,
        animate: animate,
        css: css,
        getUrlParam: getUrlParam,
        getParentData: getParentData,
        parentIs: parentIs,
        addClass: addClass,
        removeClass: removeClass,
        scrollData: scrollData,
        encodeHtmlSimple: encodeHtmlSimple,
        encodeAttr: encodeAttr
    };

    window.Utils = utils;
})();
