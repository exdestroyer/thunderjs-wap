export default  {

	setCookie: function(name, value, hours, isBaseDomain) {
		//console.log(config['domain'])
		var domain = ".jiuwo.xunlei.com";
		if (arguments.length > 2) {
			var expireDate = new Date(new Date().getTime() + hours * 3600000);
			// if (name.indexOf('isNotAgain') != -1) {
			//     console.log(expireDate);
			// }

			if (isBaseDomain != undefined && isBaseDomain == 1) {

				document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; domain=.xunlei.com; expires=" + expireDate.toGMTString();
			} else {
				// alert(expireDate.toGMTString());
				document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; domain=.jiuwo.xunlei.com; expires=" + expireDate.toGMTString();
			}
		} else {
			document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; domain=" + domain;
		}

	},
	getCookie: function(name) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	},
	getUrlParams: function(key) {
		var url = location.search.replace(/^\?/, '').split('&');
		var paramsObj = {};
		for (var i = 0, iLen = url.length; i < iLen; i++) {
			var param = url[i].split('=');
			paramsObj[param[0]] = param[1];
		}
		if (key) {
			return paramsObj[key] || '';
		}
		return paramsObj;
	},
    isWeixin: function (){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true;
        } else {
            return false;
        }
    },
    isShouLei:function(){
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/thunder/i) == "thunder") {
        return true;
    } else {
        return false;
    }
  },
  isIos:function(){

  		if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
  			return true
  		} else {
  			return false
  		}
  },
  isAndroid:function(){
  	if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) {
  		return true
  	} else {
  		return false
  	}
  }
}

//module.exports = Util;