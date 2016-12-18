import VueResource from "vue-resource";

import Util from './lib/util.js';
import nativeSchema from './lib/tool-nativeSchema.js'
import md5 from 'blueimp-md5';

//import WebSocket from 'ws';
//import VideoPlayer from 'vue-video-player'
//import playerArea from './components/videoPlayer.vue'

Vue.use(VueResource);

// VideoPlayer.config({
// 	hls: true // default true（直播功能的支持） 
// })

// 聊天表情哈希表 
const expressMap = {
	'[大笑]': `<img src="${MISCPATH}img/play/expression/exp1.png" class="img-face">`,
	'[大哭]': `<img src="${MISCPATH}img/play/expression/exp2.png" class="img-face">`,
	'[尴尬]': `<img src="${MISCPATH}img/play/expression/exp3.png" class="img-face">`,
	'[坏笑]': `<img src="${MISCPATH}img/play/expression/exp4.png" class="img-face">`,
	'[色]': `<img src="${MISCPATH}img/play/expression/exp5.png" class="img-face">`,
	'[哭笑]': `<img src="${MISCPATH}img/play/expression/exp6.png" class="img-face">`,
	'[g大笑]': `<img src="${MISCPATH}img/play/expression/exp7.gif" class="img-face">`,
	'[g大哭]': `<img src="${MISCPATH}img/play/expression/exp8.gif" class="img-face">`,
	'[g尴尬]': `<img src="${MISCPATH}img/play/expression/exp9.gif" class="img-face">`,
	'[g坏笑]': `<img src="${MISCPATH}img/play/expression/exp10.gif" class="img-face">`,
	'[g色]': `<img src="${MISCPATH}img/play/expression/exp11.gif" class="img-face">`,
	'[g哭笑]': `<img src="${MISCPATH}img/play/expression/exp12.gif" class="img-face">`
}

// 自定义文本过滤器，处理聊天表情符号替换为对应图片
Vue.filter('expression', function(value) {

	return value.replace(/(\[g?[\u4e00-\u9fa5]{1,2}])/ig, (text, p1, p2) => {
		// console.log(p1,p2)
		if (expressMap[p1]) {
			return expressMap[p1]; 
		} else {
			return p1;
		}

	})
})

new Vue({
	el: '#main_wrap',
	data: {
		firstIn: true, //是否第一次进入，防止在websocket重连是重复拉取最近的聊天消息
		roomid: 0, //房间id
		playerid: 0, //主播id
		userid: 'ios-v-56dc2c7c8f55697224da5c9fd3f562ce', //userid，作为游客身份时伪造以构建websocket连接并拉取消息
		msgList: [], //消息列表
		medalList: [], //勋章列表
		playerList: [], //推荐主播列表
		roomState: 0, //房间状态，0:未开始，1:开始播放中，2:已结束
		playerImage: '', //主播封面
		playerAvatar: "", //主播头像
		playerName: "", //主播名称
		videoUrl:'',
		wapVideoUrl:'',
		roomUserNum:0,
		isPause:false,
		player: null, //视频播放器实例，非主播信息
		ws: null, //websocket实例
		ticker: '', //websocket连接触发器
		host: "", //websocket连接域名
		port: "", //websocket连接端口号
		isShare:false,
		lastPlayer:0,
		waittime:0,
		nowtime:0,
		waiting:false,
		platform:1,
		isLive:false

	},

	components: {

	},
	computed: {

	},
	ready: function() {

		this.initPage();
	},
	watch: {
		msgList() {
			this.$nextTick(() => {

				let [list, box] = [this.$els.chatlist, this.$els.chatbox]
				box.scrollTop = list.scrollHeight

			})
		}
	},
	methods: {
		initPage() {
			if (!Util.getCookie('userid')) {

				Util.setCookie('userid', `${Util.isIos()?'ios':'android'}-v-${md5(new Date().valueOf())}`)
			}

			this.$set('userid', Util.getCookie('userid'))
			this.$set('roomid', Util.getUrlParams('roomid'))
			this.$http.jsonp(`${DYDOMAIN}/caller?c=room&a=getInfo&roomid=${this.roomid}`).then((res) => {

				let data = res.data.data;
				this.$set('lastPlayer',data.room_info.last_playerid)
				if (data.room_info.wap_video_url) {
				//var wap_video_url = 'http://flv2.jiuwo.xunlei.com/live/11831/playlist.m3u8';
				//var wap_video_url = 'http://hls.jiuwo.xunlei.com/live/12335.m3u8';
				//var wap_video_url = 'http://hls.jiuwo.xunlei.com/live/10454.m3u8';
				this.$set('wapVideoUrl',data.room_info.wap_video_url)
			//	this.$set('platform',1)
				//this.wapVideoUrl = 
				//console.log(this.$els.video)
					//$('.video').html('<video id="myplayer" class="vjs-default-skin"  autoplay="false" x-webkit-airplay="allow" webkit-playsinline >')
				this.$els.video.innerHTML = '<video id="myplayer" class="vjs-default-skin" webkit-playsinline playsinline autoplay="false" x-webkit-airplay="allow" x5-video-player-type="h5" x5-video-player-fullscreen="false" >'
				this.player = videojs(document.getElementById('myplayer'), {
					height: document.documentElement.clientHeight,
					width:  document.documentElement.clientWidth ,
					bigPlayButton: false,
					textTrackDisplay: false,
					posterImage: false,
					autoplay: false,
					errorDisplay: false,
					// type: "video/ogg", 
					// src: 'http://www.w3school.com.cn/i/movie.ogg'
				}).ready(() => {
					// $('.video').css({
					// 	'height': $(window).height() + 'px',
					// 	'width': '100%'
					// })
					//alert(`${window.screen.height},${document.body.clientHeight},${document.documentElement.clientHeight}`)
					 this.$els.video.style.height = document.documentElement.clientHeight + 'px';
					 this.$els.video.style.width = '100%';
					// alert(document.documentElement.clientWidth)
					this.player.on('play', (err) => {

						this.$set('isPause',false)
						
						this.player.on('waiting', (err) => {
							//alert(this.waiting)
							this.waiting = !this.waiting

							if (this.waiting == true) {
								this.waittime = new Date().valueOf()
							}
							
							//this.roomState = 3;
							//alert('waiting')
						})
						//this.roomState = 3;
					//alert('play')
					})
					this.player.on('error', (err) => {
						this.roomState = 2;
						//alert('error')
					})
					this.player.on('timeupdate', (err) => {
						this.nowtime = new Date().valueOf()
						
						if(this.waiting == true){
							//alert(this.nowtime - this.waittime)
							if (this.nowtime - this.waittime > 7000 ) {

								//this.roomState = 2;
								//alert('opps')
							}
							
						}
						//this.roomState = 3;
						//alert('timeupdate')
					})
					this.player.on('pause', (err) => {
						//alert('pause')
						this.$set('isPause',true)
						//this.roomState = 3;
						//alert('pause')
					})
					this.player.on('ended', (err) => {
						this.roomState = 2;
						//alert('end')
					})
				//	alert(this.wapVideoUrl)
					this.player.src({
						type: "application/x-mpegURL",
						src: this.wapVideoUrl
					})
				});

				this.$set('playerid', data.room_info.playerid)
					//this.player.src({type: "application/x-mpegURL", src:'http://hls.stream2.show.xunlei.com/live/1061_598038784/playlist.m3u8'})
					//this.player.src({type: "application/x-mpegURL", src:'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8'})
					// this.playerImage = data.

				
				this.$http.jsonp(`${DYDOMAIN}/caller?m=app&c=user&a=getTicker`).then((res) => {
					this.$set('ticker', res.data.data.ticker);
					this.$set('host', '10.10.39.7');
					this.$set('port', '3434');
					this.reConnect();

				}, (err) => {

				});
				} else {
					this.$set('roomState',2)
				}
				this.renderPlayer()
			}, (err) => {

			});



		},
		inRoom(ws) {

			let msg = {
				"topicName": "default",
				"messageId": ''
			};
			msg.payload = JSON.stringify({
				"cmd": "inroom",
				"refrom": 1,
				"userid": this.userid,
				"roomid": this.roomid,
				"guid": this.userid
			});

			let message = JSON.stringify(msg);

			ws.send(message);

			//console.log('进入房间' + this.roomid);

		},
		onMessage(msg) {
			
			let data = JSON.parse(msg.data);
			//console.log(data)
			if (data.topicName == "msg") {

				let pdata = JSON.parse(data.payload).data;

				var chatmsg = pdata.filter((item) => {
					if (this.firstIn === true) {
						console.log(item)
						if (item.cmd == 'onlastchat') {
							//console.log(item)
							this.$set('firstIn', false)
							this.renderMedal(item.chat_list)
							this.msgList = this.msgList.concat(item.chat_list)
						}
						if (item.cmd == 'onnoticemsg') {
							//console.log(item)
							this.msgList = this.msgList.concat(item)
						}



					}
						if (item.cmd == 'oninroom') {
							console.log(item)
							
							this.msgList = this.msgList.concat(this.renderMedal([{"user":item,"cmd":"oninroom"}]))
							//this.msgList = this.msgList.concat(item)
						}

						if (item.cmd == 'onendplay') {
							this.$set('roomState',2)
						}
					return item.cmd == 'onsendchat' /*||item.cmd == 'onlastchat'*/ ;
				});


			//	console.log(this.msgList)
				this.renderMedal(chatmsg)

				this.msgList = this.msgList.concat(chatmsg).slice(-20)
					//console.log(this.msgList)

			}

		},
		reConnect() {

			let wsUrl = `ws://${this.host}:${this.port}?ticker=${this.ticker}`;
			this.ws = new WebSocket(wsUrl);

			this.ws.onopen = (evt) => {
				this.inRoom(this.ws)
			};
			this.ws.onmessage = (msg) => {
				this.onMessage(msg)
			};
			this.ws.onclose = () => {
				this.reConnect()
			}
		},
		renderMedal(chatmsg) {

			
			for (let item of chatmsg) {

				if (item.cmd != 'gift' && item.cmd != 'onlastchat' && item.cmd != 'onnoticemsg') {
					//let userInfo = item.user;
					let [userInfo, medalList, giftImg] = [
						item.user, [], ''
					]

					if (parseInt(userInfo.vip) > 0) {
						medalList.push(`${WAPMISCPATH}img/vip/${userInfo.vip}.png`)
					}
					if (parseInt(userInfo.shouhu) > 0) {
						medalList.push(`${WAPMISCPATH}img/shouhu/${userInfo.shouhu}.png`)
					}
					//	console.log(userInfo.guizu)
					if (parseInt(userInfo.guizu) > 0) {
						medalList.push(`${WAPMISCPATH}img/guizu/${userInfo.guizu}.png`)
					}
					if (parseInt(userInfo.level) > 0) {
						medalList.push(`${WAPMISCPATH}img/caifu/${userInfo.level}.png`)
					}
					if (userInfo.medal) {
						for (let medal of userInfo.medal) {
							if (medal.level == 0 || medal.medal == 'fansLv' || medal.medal == 'shoes') {
								continue
							}
							medalList.push(`${WAPMISCPATH}img/medal/${medal.medal}/${medal.level}.png`)
						}
					}


					const chatobj = Object.assign(item, {
						'medalList': medalList
					});
					console.log(item)
					if (item.type == 'gift') {
						giftImg = `<img src="${item.gift.url}" class="img-gift" alt="${item.gift.name}">`;
						chatobj.gift.img = giftImg;
					}


				}


			}
			return chatmsg
		},
		startPlay() {
			//alert(1)
			this.$set('roomState', 1)
			//	if (this.player.paused()) {
			this.player.play()
			//	}

		},
		hideShare(){
			this.$set('isShare',false)
		},
		jumpToApp() {
			if (Util.isWeixin()) {
				//alert(1)
				this.$set('isShare',true)
			} else {

			nativeSchema.loadSchema({
				// 某个schema协议，例如login,
				schema: `jiuwo.xunlei.com/wap/room/play.html`,

				//schema头协议，
				protocal: `jiuwo://invoke?roomid=${this.roomid}&platform=1&video_url=${encodeURIComponent(this.videoUrl)})`,

				//发起唤醒请求后，会等待loadWaiting时间，超时则跳转到failUrl，默认3000ms
				loadWaiting: "3000",

				//唤起失败时的跳转链接，默认跳转到应用商店下载页
				failUrl: "http://jiuwo.xunlei.com/act/app/wap",

				// Android 客户端信息,可以询问 Android同事
				apkInfo: {
					PKG: "com.xunlei.xllive",
					CATEGORY: "",
					ACTION: ""
				}
			});	
			}

		},
		renderPlayer() {
			this.$http.jsonp(`${DYDOMAIN}/caller?c=player&a=getSimpleInfo&playerid=${this.playerid||this.lastPlayer}`).then((res) => {

				if (res.data.data) {
					this.$set('playerImage', res.data.data.player_image)
					this.$set('playerAvatar', res.data.data.icon)
					this.$set('playerName', res.data.data.nickname)
					this.$set('platform', res.data.data.platform)
					this.$set('isLive',res.data.data.is_live)
				}


			}, (res) => {

			});

			this.$http.jsonp(`${DYDOMAIN}/caller?m=app&c=player&a=getHotRecommendList`).then((res) => {
				if (res.data.data.list) {
					let list = res.data.data.list;
					//list.length = 8;
					this.$set('playerList', list.slice(0, 8))
				}

			}, (res) => {

			});
		},
		goLogin(){
			window.location.href = "http://act.vip.xunlei.com/waplogin/login.html?url=" + encodeURIComponent(location.href);
		}
	}


})