<style>
  .video-js.vjs-custom-skin button.vjs-big-play-button { display: none!important; }
</style>
<template>
  <video-player :options="videoOptions" @player-state-changed="playerStateChanged"  v-ref:videoplayer></video-player>
</template>

<script>
import {
  videoPlayer
} from 'vue-video-player'
export default {
  components: {
    videoPlayer
  },
ready(){

},
  data() {
    return {
      roomid:0,
      videoOptions: {

        source: {
          type: "application/x-mpegURL",
          src: "http://hls.jiuwo.xunlei.com/live/100128.m3u8",
           withCredentials: false
          //src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8"
        //  src: "http://hls.stream2.show.xunlei.com/live/1341_596938079/playlist.m3u8"
          
          
        },
        poster: "",
        autoplay: false,
        muted: false,
        controls: false,
        playsinline: true,
        preload: false,
        height:$(window).height(),
        live:true,
       // 'html5': { hls: { withCredentials: false } }
      }
    }
  },
    // computed: {
    //   player() {
    //     console.log(this.$refs.videoPlayer)
    //     return this.$refs.videoPlayer.player
    //   }
    // },
  methods: {

    playerStateChanged(playerCurrentState) {
      console.log(playerCurrentState)
    }
  }
}
</script>