<template>
    <div class="wrap preview-wrap">
        <div class="head">
            <div class="back goBack" id="goBack" @click="goBack"></div>
            <div class="title">{{$t('common.text10')}}</div>
            <div class="btn theEditor" id="theEditor" @click="theEditor">{{$t('common.text11')}}</div>
        </div>
        <div class="user">
            <div class="head-portrait">
                <div class="portrait"><img class="avatar" v-show="headImage" :src="headImage" /></div>
                <div class="textp">
                    <div class="name">{{userName}}</div>
                    <div class="date">{{nowTime}} {{$t('common.text12')}}</div>
                </div>
            </div>
            <!--<div class="concern" id="concern"></div>-->
        </div>
        <div class="main">
            <div class="info-box">
                <div class="title">{{title}}</div>
                <div class="content" id="content" v-html="content"></div>
            </div>
        </div>
        <div class="footer">
            <div class="button">
                <div class="btn goPelease" id="goPelease" @click="goEditor"><span>{{$t('common.text5')}}</span></div>
            </div>
        </div>
    </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  export default {
    data() {
      return {
        nowTime: '',
        title: this.$route.query.title,
        imgDomain: this.$route.query.imgDomain,
        content: this.$route.query.contentHtml.contentHtml,
        //headImage: require('../../assets/img/back.png'),
        headImage: this.$route.query.headImage,
        userName: this.$route.query.userName,
        imgArr: [],
      }
    },
    created() {
    },
    mounted() {
      this.releaseDate()
      /*Dialog({
        title: '头像的字段',
        content: this.headImage + this.userName,
      })*/
    },
    methods: {
      // 预览发布
      goEditor () {
        let urlArr = document.querySelectorAll('#content img')
        let imgUlr = []
        if (urlArr) {
          for (let i in urlArr) {
            // https://ganxibao.blob.core.windows.net/headimg/de3be3dffa08d17bc665d5864383735f.jpg
            if (urlArr[i].currentSrc) {
              if (urlArr[i].currentSrc.indexOf(this.imgDomain) > -1) {
                if(urlArr[i].currentSrc) {
                  let img_ = urlArr[i].currentSrc.split("/")[4]
                  imgUlr.push(img_)
                }
              }
            }
          }
        }
        if (imgUlr) {
          for (let i in imgUlr) {
            if (i <= 2) { // 最多3 张
              if (this.imgArr.indexOf(imgUlr[i]) === -1) { // 多次发布去重
                this.imgArr.push(imgUlr[i])
              }
            }
          }
        }
        
        let obj = {}
        let objImg = {
          title: this.title,
          content: this.content,
          imgUrl: this.imgArr, //图片(多张用)
          operateType: '2', // 编辑类别 1.保存草稿箱 2发布
        }
        let objImgNull = {
          title: this.title,
          content: this.content,
          operateType: '2', // 编辑类别 1.保存草稿箱 2发布
        }

        if (this.imgArr) {
          obj = objImg
        } else {
          obj = objImgNull 
        }
        if (parseInt(this.$store.state.device) === 0) {
          window.android.saveOrPublishPost(JSON.stringify(obj))
        } else {
          window.webkit.messageHandlers.saveOrPublishPost.postMessage(JSON.stringify(obj))
        }
      },
      ifTime(value) { // 判断时间是否是个位数
        if (value < 10) {
          return '0' + value
        }
        return value
      },
      releaseDate () {
        let newTime = new Date()
        let day = newTime.getDate()
        let month = newTime.getMonth() + 1
        let year = newTime.getFullYear()
        let hours = newTime.getHours()
        let min = newTime.getMinutes()
        this.nowTime  = year + '-' + this.ifTime(month) + '-' + this.ifTime(day) + ' ' + this.ifTime(hours) + ':' + this.ifTime(min)
      },
      goBack() {
        let content ={
          content: this.content
        }
        let releaseId = this.$route.query.releaseId
        if (releaseId) {
          if (this.title && this.content) {
            this.$router.push({
              path: '/release/release',
              query:{
                codeId: 1,
                editorTitle: this.title,
                editorContent: content,
                editorHeadImage: this.headImage,
                editorUserName: this.userName,
                editorImgArr: this.imgArr,
              }
            })
          }
        }
      },
      // 跳编辑
      theEditor () {
        this.goBack()
      }
    },
    components: {}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
    .preview-wrap{
        width: 100vw !important;
        background-color: #fff;
        padding: 0 15px !important;
        .head{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 900;
            line-height: 46px;
            border-bottom: 1px solid #e8e8e9;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 14px;
            padding: 0 15px;
            background-color: #ffffff;
            .iosx & {
                padding-top: 40px;
            }
            .ios & {
                padding-top: 20px;
            }
            .back{
                width: 45px;
                height: 46px;
                position: relative;
                &:after{
                    content: '';
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                    width: 14px;
                    height: 14px;
                    background: url("../../assets/img/back.png") no-repeat;
                    background-size: contain;
                }
            }
            .title{
                flex: 1;
                color: #0b0e14;
                text-align: center;
                font-size: 16px;
            }
            .btn{
                width: 45px;
                height: 100%;
                color: #4081ff;
                text-align: right;
            }
        }   
        .user{
            position: fixed;
            left: 15px;
            right: 15px;
            z-index: 900;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 0;
            top: 47px;
            .ios & {
                top: 67px;
            }
            .iosx & {
                top: 87px;
            }
            .head-portrait{
                display: flex;
                align-items: center;
                justify-content: flex-start;
                .portrait{
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-color: #cccccc;
                    img{
                        display: inline-block;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .textp{
                    margin-left: 10px;
                    .name{
                        font-size: 14px;
                        color: #0b0e14;
                        padding-bottom: 5px;
                    }
                    .date{
                        font-size: 12px;
                        color: #b2b2b2;
                    }
                }
            }
        }
        .main{
            width: 100vw;
            padding: 0 15px;
            position: absolute;
            left: 0;
            right: 0;
            z-index: 800;
            overflow-y: auto;
            top: 128px;
            height: calc(100vh - 218px);
            .ios &{
                top: 148px;
                height: calc(100vh - 148px - 131px);
            }
            .iosx &{
                top: 168px;
                height: calc(100vh - 159px - 168px);
            }
            .info-box{
                width: 100%;
                .title{
                    width: 100%;
                    font-size: 17px;
                    color: #0b0e14;
                    line-height: 1.5;
                    padding-bottom: 10px;
                }
                .content{
                    width: 100%;
                    font-size: 14px;
                    color: #0b0e14;
             /deep/ p{
                        line-height: 1.5;
                        img{
                            display: block;
                            margin: 10px 0 15px;
                            max-width: 100%;
                        }
                    }
                }   
            }
        }
        .footer{
            width: 100vw;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #fff;
            border-top: 1px solid #e8e8e9;
            display: flex;
            z-index: 900;
            .iosx & {
                padding-bottom: 68px;
            }
            .ios & {
                padding-bottom: 40px;
            }
            .button{
                width: 100%;
                padding: 23px 15px 23px;
                .iosx & {
                    padding: 30px 15px 16px;
                }
                .ios & {
                    padding: 30px 15px 16px;
                }
                .btn{
                    height: 44px;
                    line-height: 44px;
                    text-align: center;
                    color: #fff;
                    background-color: #4081ff;
                    border-radius: 6px;
                    box-shadow: 0  5px 6px rgba(64,129,255,.2);
                    flex: 1;
                    position: relative;
                    &:nth-child(1){
                        margin-right: 8px;
                    }
                    &:nth-child(2){
                        margin-left: 8px;
                    }
                    span{
                        font-size: 15px;
                        position: absolute;
                        display: inline-block;
                        left: 0;
                        right: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 999;
                    }
                }
            }
        }
    }
</style>