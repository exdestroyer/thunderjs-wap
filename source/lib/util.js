var Util = {
	isUndef: function(a) {
		return typeof a == "undefined";
	},
	isNull: function(a) {
		return typeof a == "object" && !a;
	},
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
	isWeixin: function() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			return true;
		} else {
			return false;
		}
	},
	isShouLei: function() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/thunder/i) == "thunder") {
			return true;
		} else {
			return false;
		}
	},
	isIos: function() {

		if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
			return true
		} else {
			return false
		}
	},
	isAndroid: function() {
		if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) {
			return true
		} else {
			return false
		}
	},
	isShouLei: function() {
		if (window.XLJSWebViewBridge) {
			return true;
		} else {
			return false;
		}
	},
    login : function(url,loginedFun,noreLoad){
        // alert('login111')
           try {
            var callback = JSON.stringify({"callback":"refreshAct"})
            window.share.goToLoginPageAndCallback(callback);
          } catch (e) {
            if(this.isShouLei()){
            var ClientOldJson = clientInterface.data.getUserInfo;
            clientInterface.data.getUserInfo({
                "source":'',
                "forceLogin":1
            },function(rs){
                 if(rs.userInfo.userID){
                     window.SLUserInfo = rs;
                     Util.setShouLeiCookie(rs.userInfo);
                 } else {
                     window.SLUserInfo = null;
                     Util.clearShouLeiCookie();
                 }
                 if(typeof loginedFun == 'function'){
                     loginedFun();
                 }
                 if(!noreLoad){//异步的时候不要relaod,如果要reload写在function
                     window.location.reload();
                 }
            })
          } else {
            window.location.href = url || "http://act.vip.xunlei.com/waplogin/login.html?url=" + encodeURIComponent(location.href);
          }
          }
    },
	haslogin: function() {
		try {
			if (xlQuickLogin.isLogined() === true) {
				return true
			} else {
				return false;
			}

		} catch (e) {
			try {
				// alert('window.share.getUserId');
				var userid = window.share.getUserId();
				if (userid <= 0) {
					return false;
				} else {
					return true;
				}

			} catch (e) {
				// alert('sessionid');
				if (this.isShouLei()) {
					// alert(window.SLUserInfo+'null')
					if (!this.isNull(window.SLUserInfo)) {
						var isLogin = window.SLUserInfo.isLogin;
					} else {
						isLogin = 0;
					}

					if (isLogin == 0) {
						return false;
					} else {
						return true;
					}
				} else {
					// alert('sessionid');
					var sessionid = this.getCookie("sessionid");
					var userid = this.getCookie("userid");
					if (!sessionid || !userid) {
						return false;
					}
					return true;
				}
				return false;
			}
		}

	},
}

module.exports = Util;