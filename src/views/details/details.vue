<template>
    <div class="wrap details-wrap">
        <div class="head">
            <div class="head-l">
                <div class="buddha"><img v-show="userImgUrl" :src="userImgUrl" alt=""></div>
                <div class="info-user">
                    <div class="text-info">
                        <div class="name">{{userName}}</div>
                        <div class="date">{{changeDate(updateAt,'-')}} 发表</div>
                    </div>
                </div>
            </div>
            <div class="head-r"> + 关注 </div>
        </div>
        <div class="main">
            <div class="title">{{title}}</div>
            <!--<div class="img-box">
                <swiper :options="swiperOption" ref="mySwiper">
                    <swiper-slide  v-for="(item,index) in imageUrlArray" :key="index">
                        <img class="logo-img" style="-webkit-user-select: none;margin: auto;cursor: zoom-in;" :src='item' alt="">
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </div>-->
            <div class="textp">
                <div class="article" v-html="content"></div>
            </div>
        </div>
    </div>
</template>

<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import { formatURL } from '@/common/utils/formatURL'
  export default {
    data() {
      return {
        commId: '',
        updateAt: '',
        userName: '',
        userImgUrl: '',
        title: '',
        imageUrlArray: [],
        content: '',
        descriptions: '',
        swiperOption: { //以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
          autoplay: false,
          loop: false,
          direction: 'horizontal',
          autoHeight: false,
          pagination: {
            el: '.swiper-pagination',
            type : 'fraction'
          },
          preventClicks : false,//默认true
        }
      }
    },
    components: {
      swiper,
      swiperSlide
    },
    created() {
    },
    mounted() {
      this.getUrlJSON();
    },
    methods: {
      // 时间过滤
      changeDate(time, str = '-', type = 1) {
        if (!time) return ''

        function ifTime(value) { // 判断时间是否是个位数
          if (value < 10) {
            return '0' + value
          }
          return value
        }
        let newTime = new Date(time)
        let day = newTime.getDate()
        let month = newTime.getMonth() + 1
        let year = newTime.getFullYear()
        let hours = newTime.getHours()
        let min = newTime.getMinutes()
        let sec = newTime.getSeconds()
        switch (type) {
          case 1:
            return year + str + ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min) + ':' + ifTime(sec)
          case 9:
            return ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min)
          case 10:
            return year + str + ifTime(month) + str + ifTime(day) + '<br>' + ifTime(hours) + ':' + ifTime(min) + ':' + ifTime(sec)
        }
      },
      async getUrlJSON () {   // 获取客户端的文章id
        //let urlTarget = 'http://kongweb.5544444455.com/stemCellsDetails/#/details/details?commId=1'
        //let urlTarget = 'http://kongweb.5544444455.com/stemCellsDetails/?from=singlemessage&isappinstalled=0#/details/details?commId=1'
        let urlTarget = window.location.href
        let singleMessage = urlTarget.split('?')[1].split('=')[1].split('&')[0]; // ios微信分享的地址多出字段,多个?字符,截取
        if (singleMessage !== 'undefined' && singleMessage === 'singlemessage') { 
          let commId = urlTarget.split('?')[2].split('=')[1];
          this.commId = commId
        } else {
          const { commId } = formatURL(urlTarget);
          this.commId = commId
        }
        if (this.commId) {
          await this.getDetail()
        }
      },
      getDetail () {
        this.$fetch.post('/comm/getDetailByNewsId',{
          commId: parseInt(this.commId)
        }).then((res) => {
          if (res.success) {
            let obj = res.data
            this.userImgUrl = obj.userImgUrl
            this.userName = obj.userName
            this.title = obj.title
            this.imageUrlArray = obj.imageUrlArray
            this.content = obj.content //文章内容1
            this.descriptions = obj.descriptions // 文章内容2
            this.updateAt = obj.updateAt
          }
        })
      }
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
.main-container{
    padding: 0 !important;
}
.details-wrap{
    background-color: #fff;
    min-height: 100vh;
    padding: 0 20px !important;
    .head{
        width: 100%;
        line-height: 60;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
        padding: 0 20px 20px;
        border-bottom: 1px solid #f1f1f1;
        background-color: #fff;
        padding-top: 20px;
        .iosx & {
            padding-top: 40px;
        }
        .ios & {
            padding-top: 20px;
        }
        .head-l{
           flex: 1;
           height: 100%;
           display: flex;
           align-items: center;
           justify-content: flex-start;
           .buddha{
               width: 40px;
               height: 40px;
               border-radius: 50%;
               background-color: #cccccc;
               img{
                   display: block;
                   width: 100%;
                   height: 100%;
                   border-radius: 50%;
               }
           }
           .info-user{
               height: 100%;
               margin-left: 8px;
               font-size: 14px;
               display: flex;
               align-items: center;
               .text-info{
                   .name{
                       line-height: 20px;
                   }
                   .date{
                       line-height: 20px;
                   }   
               }
           }
        }
        .head-r{
            width: 60px;
            height: 26px;
            line-height: 26px;
            background-color: #1d6aff;
            border-radius: 4px;
            color: #fff;
            text-align: center;
            font-size: 14px;
        }
    }
    .main{
        width: 100%;
        margin-top: 80px;
        color: #0b0e14;
        overflow-y: auto;
        .iosx & {
            padding-top: 40px;
        }
        .ios & {
            padding-top: 20px;
        }
        .title{
            font-size: 17px;
            line-height: 1.5;
            padding: 20px 0;
        }
        .img-box{
            width: 100%;
            height: 50vw;
            background-color: #fff;
     /deep/.swiper-container{
                width: 100%;
                height: 100%;
                .swiper-wrapper{
                    width: 100%;
                    height: 100%;
                    .swiper-slide{
                        width: 100%;
                        height: 100%;
                        background-repeat: no-repeat;
                        img{
                            width: 100%;
                        }
                    }
                }
                .swiper-slide-active{
                   width: 100vw !important;
                   height: 100% !important;
                   margin-right: 0 !important;
                   background-position: center !important;
                   background-size: contain !important;
                   background-repeat: no-repeat !important;
                    img{
                        width: 100%;
                    }
                }
                .swiper-pagination-fraction{
                    width: 50px;
                    height: 24px;
                    line-height: 24px;
                    left: 80%;
                    background-color: rgba(0,0,0,.5);
                    border-radius: 12px;
                    color: #fff;
                    font-size: 13px;
                }
            }
        }
        .textp{
            padding: 20px 0;
            .article{
                padding-bottom: 20px;
                font-size: 14px;
                p{
                    line-height: 1.5;
                    font-size: 14px;
                    img{
                        display: block;
                        width: 100%;
                        height: 50vw;
                    }
                }
            }
            //border-bottom: 1px solid #f1f1f1;
        }
    }
}
</style>