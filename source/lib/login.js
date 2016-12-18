var LoginModel = {};

//require('./cookie.js');

window.ROOMAPI = window.ROOMAPI || {};

var login_callbacks = $.Callbacks('unique memory');

var logout_callbacks = $.Callbacks('unique memory');


window.ROOMAPI.login_callbacks = login_callbacks;

// var U = require('./common.js');

window.ROOMAPI = window.ROOMAPI || {};

window.ROOMAPI.userData = null;

// var getUserIcon = require('../index/getUserIcon.js');
//是否缓存的判断标识
//var is_debug = U.getUrlParam(window.location.href, 'is_debug') || 0;
//var xl9 = window.xl9;
LoginModel.init = function(_model, _events) {
    var model = _model;
    var TYPE = xlQuickLogin.TYPE;
    var Util = xlQuickLogin.Util;
    LoginModel.login_callbacks = login_callbacks;
    LoginModel.loginout_callbacks = logout_callbacks;
    xlQuickLogin.init({
        loginID: '158',
        registerID: 'act',
        // UI_THEME: 'popup',
        useCdn: 1,
        THIRD_LOGIN_TARGET_PARENT: true,
        // 登录成功后回调函数，当 SET_ROOT_DOMAIN == true 时该项可用
        LOGIN_SUCCESS_FUNC: function() {
            refreshVipUserInfo(login_callbacks);
        },
        // 注册成功后回调函数，当 SET_ROOT_DOMAIN == true 时该项可用
        REGISTER_SUCCESS_FUNC: function() {
            location.reload();
        },
        // 关闭按钮回调函数，只适用弹窗主题
        POPUP_CLOSE_FUNC: function() {},
        //登出后的回调
        LOGOUT_FUNC: function() {
            // logout_callbacks && logout_callbacks.fire();

        }
    });
};

logout_callbacks.add(function(config) {
    if (config['url']) {
        window.location.href = config['url'];
    } else {
        window.location.reload();
    }
});



function login() {
    // if (xl9 && xl9.isThunder()) {
    //     xl9.api.showLoginDlg(function(err) {});
    // } else {
    //     xlQuickLogin.popup();
    // }

};
//调用退出
function logout(url) {
    window.userData = null;
    xlQuickLogin.logout();
    // if (xl9 && xl9.isThunder()) {
    //     xl9.api.logout(function(err) {});
    // } else {
    //     xlQuickLogin.logout();
    // }
    // clearCookie();
    // logout_callbacks.fire({
    //     url: url
    // });
}
//刷新登录信息
// function refleshLogininfo() {

//     var url = DYDOMAIN + '/caller?c=user&a=getInfo?rt=' + Math.random();
//     $.ajax({
//         type: "GET",
//         url: url,
//         data: '',
//         dataType: 'jsonp',

//         success: function(json) {
//             var tipcookie = function(cname, name) {
//                 if (json[name]) setCookie(cname, json[name], 24 * 3600);
//             };

//             tipcookie('vip_nickname', 'nickname');
//             tipcookie('vip_usrname', 'usrname');

//         }
//     });
// }
//获得没缓存的url
function getnocacheurl(urlstr) {
    var returnurl = "";
    var cachetime = new Date().getTime();
    var index = urlstr.indexOf("cachetime=");
    var param = urlstr.indexOf("?");
    if (index == -1) {
        if (param == -1) {
            returnurl = urlstr + "?cachetime=" + cachetime;
        } else {
            returnurl = urlstr + "&cachetime=" + cachetime;
        }
    } else {
        if (param == -1) {
            returnurl = urlstr.substring(0, index) + "?cachetime=" + cachetime;
        } else {
            returnurl = urlstr.substring(0, index) + "&cachetime=" + cachetime;
        }
    }
    return returnurl.replace('&&', '&').replace('?&', '?');
}
window.userData = null;



//刷新当前页面的用户会员信息

//判读是否登录
function haslogin() {
    return xlQuickLogin.isLogined();
}

//初始化登录模块
LoginModel.init();
// if (haslogin()) {
//     var jwcookie = getCookie('jwcookie');
//     var vipSessionid = getCookie('vip_sessionid');
//     var sessionid = getCookie('sessionid');

// }
// window.ROOMAPI.refreshMPinfo = function(callback) {
//     var callback = callback || null;
//     window.refreshVipUserInfo(callback, true);
// }

window.haslogin = haslogin;
window.login = login;
window.logout = logout;
// window.refleshLogininfo = refleshLogininfo;
// window.ROOMAPI.refreshVipUserInfo = window.refreshVipUserInfo = refreshVipUserInfo;
//module.exports = LoginModel;