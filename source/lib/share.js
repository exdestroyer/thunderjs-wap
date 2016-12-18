	/**
	 * For weixin
	 */
  //先获取签名
  function YJajax(url, callback, error) {
    $.ajax({
      type: "get",
      url: url,
      jsonp: "callback",
      dataType: "jsonp",
      success: callback,
      error: error
    });
  }

  window.destitle  = '亲们！我刚在这1块钱翻了500倍，大家快来！';
  window.secitle  = '迅雷1元夺宝王牌游戏-开心挖宝箱';
  function initShare(){
    // alert('io')
    YJajax('http://dyactive.vip.xunlei.com/weixin_huiyuan/server.php?type=jweixinSign&url='+ encodeURIComponent(location.href.split('#')[0])  + '&time=' + new Date().getTime(),function(rs){
        if(rs.result == 0){
            wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'wxc5c5b8446a18b2bb', // 必填，公众号的唯一标识
            timestamp:rs.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: rs.data.nonceStr, // 必填，生成签名的随机串
            signature:rs.data.signature, // 必填，签名，见附录1
            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          });
          wx.ready(function(){
                var title = window.destitle,
                desc = window.secitle,
                secitle = window.secitle,
                link = 'http://1.xunlei.com/wap/dbffl3.html?referfrom=y_wap_yydbgw_acti_fflwxfx',
                imgUrl = 'http://1.xunlei.com/wap/img/dbffl2_wx.jpg';
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: desc, // 分享标题
                desc: title, // 分享描述
                link: link, // 分享链接
                imgUrl:imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: '迅雷1元夺宝王牌游戏-开心挖宝箱', // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl:imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                }
            });
            console.log(desc)
        });
        }else{
            wx.error(function(res) {
                console.log(res);
            });
        }
    })
  }


  initShare()