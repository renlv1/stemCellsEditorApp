<template>
  <div id="app" :class="`${$lang}`">
    <div class="ajax-loading" v-show="$store.state.showLoading">
      <div class="loading-content">
        <img src="@img/loading2.gif" alt="">
        <p>{{$store.state.showLoading !== true ? $store.state.showLoading : `${$lang === 'cn' ? '正在加载中...' : 'Loading...'}`}}</p>
      </div>
    </div>
    <!--<web-nav class="nav" v-if="$store.state.user.id" />-->
    <!--<transition name="zoom">
      <keep-alive>
        <router-view class="main-container" v-if="$route.meta.keepAlive" />
      </keep-alive>
    </transition>
    <transition name="zoom">
      <router-view class="main-container" v-if="!$route.meta.keepAlive" />
    </transition>-->
      <router-view class="main-container"/>
  </div>
</template>
<script>
export default {
  data () {
    return {
      showList: false,
      chatTotal: 0,
      user: {}
    }
  },
  created () {
   // this.$store.dispatch('getUserInfo')
  },
  mounted(){
    let u = navigator.userAgent
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      this.$store.commit('SET_DEVICE', 0)
    } else {
      this.$store.commit('SET_DEVICE',1)
    }
    if (isIos) {
      this.$store.commit('SET_DEVICE', 1)
    } else {
      this.$store.commit('SET_DEVICE', 0)
    }
  },
  components: {
    //webNav: require('@/components/nav').default,
  },
}
</script>

<style lang="less">
@import "assets/css/reset.less";
@import "assets/css/common.less";
#app {
  font-size: 16px;
  color: #191919;
  word-break: break-all;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  padding-left: 280px;
  padding-top: 80px;
  @media @mob{
    padding:0 ;
    .main-container{
      padding: 80px 17px 20px;
      max-width: 100%;
      width: 100%;
      min-width: 100%;
    }
  }
}

.ajax-loading{
  position: fixed;
  z-index: 999999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  .loading-content{
    position: absolute;
    width: 150px;
    height: 150px;
    background: rgba(0,0,0,.8);
    text-align: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .vCenter;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    border-radius: 10px;
    padding-bottom: 0.2rem;
  }

  img{
    width: 80px;
    text-align: left;
    margin-bottom: .16rem;
  }
}
.zoom-leave{
  display: none;
}
.zoom-enter-to{
  @media @pc{
    transition: .35s;
  }
}
.zoom-enter{
  // transform: scale(.88);
  transform: translateY(5px);
  opacity: .2;
}
.v-modal{
  background: radial-gradient(#ebf4fd, #a7bcdc) !important;
}
.nav{
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100%;
  background: #fff;
  z-index: 3;
}
.main-container{
  padding: 40px 60px;
}
</style>


