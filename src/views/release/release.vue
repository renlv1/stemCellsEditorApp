<template>
    <div class="wrap release-wrap">
        <div class="head">
            <div class="back go-back" id="go-back" @click="goBack">{{$t('common.back')}}</div>
            <div class="title">{{$t('common.text1')}}</div>
            <div class="btn save-btn" id="save-btn" @click="goEditor(1)">{{$t('common.text2')}}</div>
        </div>
        <div class="main">
            <div class="title">
                <input class="input-text" v-model.trim="title" type="text" :placeholder="$t('common.text3')">
            </div>
            <div class="rich-text" :class="{'active': $store.state.device === 1}">
                <quillEditor v-model="content"
                             id="rich-text"
                             ref="myQuillEditor"
                             @change="onEditorChange($event)"
                             :options="editorOption">
                </quillEditor>
                <input class="add-box" v-show="$store.state.device === 1" :class="{'activeIos': $store.state.device === 1}" @change="uploadSuccessFn()" ref="uploadFile" accept="image/*" type="file"/>
                <cube-loading v-show="isLoading" :size="40"></cube-loading>
            </div>
        </div>
        <div class="footer">
            <div class="button">
                <div class="btn release" id="release" @click="goEditor(2)"><span>{{$t('common.text5')}}</span></div>
                <div class="btn preview" :class="{'active': activeBtn}" id="preview" @click="gtToPreview"><span>{{$t('common.text6')}}</span></div>
            </div>
        </div>
    </div>
</template>

<script>
  import Dialog from '@/components/dialog/dialog'
  import {compress, dataURItoBlob} from '@/assets/js/upload'

  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import {  quillEditor } from 'vue-quill-editor'
  import * as Quill from 'quill'

  import VideoBlot from '@/plugins/customVideo'
  import AudioBlot from '@/plugins/customAudio'
  // 自定义字体大小
  let Size = Quill.import('attributors/style/size')
  Size.whitelist = [ '14px', '12px', '16px','18px', '20px', '24px', '36px']
  Quill.register(VideoBlot, true);
  Quill.register(AudioBlot, true);
  Quill.register(Size, true)

  var Parchment = Quill.import('parchment');
  // 定义
  let LineHeightClass = {
    scope: Parchment.Scope.INLINE,
    whitelist: ['1.5', '1.75', '2', '3', '4', '5']
  }
  let LineHeightStyle = {
    scope: Parchment.Scope.INLINE,
    whitelist: ['1.5', '1.75', '2', '3', '4', '5']
  }
  let LetterSpaceClass = {
    scope: Parchment.Scope.INLINE,
    whitelist: ['1', '0', '0.5', '2']
  }
  let LetterSpaceStyle = {
    scope: Parchment.Scope.INLINE,
    whitelist: ['1px', '0', '0.5px',  '2px']
  }
  var lineHtClass = new Parchment.Attributor.Class('line-height', 'ql-line-height', LineHeightClass);
  var lineHtStyle = new Parchment.Attributor.Style('line-height', 'line-height', LineHeightStyle);
  var LetterClass = new Parchment.Attributor.Class('letter-spacing', 'ql-letter-spacing', LetterSpaceClass);
  var LetterStyle = new Parchment.Attributor.Style('letter-spacing', 'letter-spacing', LetterSpaceStyle);
  Parchment.register(lineHtClass);
  Parchment.register(lineHtStyle);
  Parchment.register(LetterClass);
  Parchment.register(LetterStyle);

  Quill.register(Parchment, true)
  export default {
    data() {
      return {
        modalShow: false,
        isLoading: false,
        myfile1: '',
        title: '',
        activeBtn: false,
        content: '',
        imgDomain: '', // 上传图片的域名
        headImage: '',
        userName: '',
        htmlStr: '',
        lang: '',
        imgArr: [], 
        editorOption: {
          modules: {
            toolbar: {
              container: [
                [
                  {'size': Size.whitelist},
                  {'color': [] },
                  /*'bold',
                  'italic',
                  'underline',*/
                  { 'align': [] },
                  { 'list': 'ordered'},
                  { 'list': 'bullet' },
                ],
                ['image'],
              ],
              handlers: {
                 'image': () => {
                   if (parseInt(this.$store.state.device) === 0) { //调用安卓上传图片方法
                     window.android.selectImage() // 上传
                     this.andRoidUpload() // web获取安卓上传后的图片路径
                   }
                 },
              }
            }
          },
          placeholder: this.$t('common.text4'),
        },
      }
    },
    created() {
      let previewId = this.$route.query.codeId
      let editorTitle = this.$route.query.editorTitle
      let editorContent = this.$route.query.editorContent
      let editorHeadImage = this.$route.query.editorHeadImage
      let editorUserName = this.$route.query.editorUserName
      let editorImgArr = this.$route.query.editorImgArr
      if (previewId) { // 从预览返回的
        this.title = editorTitle
        this.content = editorContent.content
        this.headImage = editorHeadImage
        this.userName = editorUserName
        this.imgArr = editorImgArr
        /*Dialog({
          title: '返回的字段',
          content: this.headImage + this.userName,
        })*/
      }
    },
    mounted() {
      this.getUrlJSON();
    },
    computed: {},
    watch: {
      'title':function () {
        this.notNullFn()
      },
      'content':function () {
        this.notNullFn()
      }
    },
    methods: {
      //vsCode测试666GGGG哈哈哈哈
      notNullFn() {
        if (this.title && this.content) {
          this.activeBtn = true
        } else {
          this.activeBtn = false
        }
      },
      // 编辑初始渲染字段
      async getUrlJSON () {
        /*if (this.lang) {
          if (this.lang === 'cn') {
            localStorage.setItem('lang', 'cn')
            this.$i18n.locale = 'cn'
          } else {
            localStorage.setItem('lang', 'en')
            this.$i18n.locale = 'en'
          }
        }*/
        let urlTarget = window.location.href
        if (urlTarget.indexOf('previewId') === -1) { // 客户端进入编辑页面渲染
          await this.updateFollow()
        }
      },
      updateFollow () {
        window['appSendContentToWeb'] = (obj) => {
          this.getDataObj(obj)
        };
      },
      getDataObj (obj) { // 客户端进入编辑渲染
        /*headImage 用户头像url字符串   
        userName: 用户名   
        title :文章标题
        htmlStr : 富文本内容
        publishTime :发布时间
        requestType  :1:正式环境 2:测试环境*/
        if (obj) {
          let objData = JSON.parse(obj)
          this.headImage = objData.headImage
          this.userName = objData.userName
          this.content = objData.htmlStr
          this.title = objData.title
          this.imgDomain = objData.imgDomain
          this.lang = objData.languageType // : cn :中文 en:英文
          this.requestType = objData.imageUploadRequestType // :1:正式环境 2:测试环境
          if (this.requestType) {
            if (parseInt(this.requestType) === 1) {
              localStorage.setItem('requestType', 1)
            } else {
              localStorage.setItem('requestType', 2)
            }
          }
          if (this.lang) {
            if (this.lang.toLowerCase() === 'en') {
              localStorage.setItem('lang', 'en')
              this.$i18n.locale = 'en'
            } else {
              localStorage.setItem('lang', 'cn')
              this.$i18n.locale = 'cn'
            }
          }
        }
      },
      toastD (text) {
        this.toast = this.$createToast({
          txt: text,
          time: 2000,
          type: 'txt'
        })
        this.toast.show()
      },
      // 发布2,保存草稿1
      goEditor (index) {
        if (!this.title) {
          this.toastD(this.$t('common.text7'))
        }
        if (!this.content) {
          this.toastD(this.$t('common.text8'))
        }
        
        let urlArr = document.querySelectorAll('.ql-editor img')
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
        if (this.title && this.content) {
          let obj = {}
          let objImg = {
            title: this.title,
            content: this.content,
            imgUrl: this.imgArr, //图片(多张用)
            operateType: index === 1 ? '1' : '2', // 编辑类别 1.保存草稿箱 2发布
          }
          let objImgNull = {
            title: this.title,
            content: this.content,
            operateType: index === 1 ? '1' : '2', // 编辑类别 1.保存草稿箱 2发布
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
        }
      },
      // 监听输入事件
      onEditorChange(event){},
      modalFn () {
        this.modalShow = false
      },
      selectImage (obj) {
        let objData = JSON.parse(obj)
        if (objData) {
          this.headImage = objData.headImage
          this.userName = objData.userName
          this.content = objData.htmlStr
          this.title = objData.title
        }
      },
      getAndRoidObj (obj) {
        let objData = JSON.parse(obj)
        if (objData) {
          this.insertEmbed(objData.fileUrl) // 图片路径渲染到富文本插件中
        }
      },
      // 安卓上传图片
      andRoidUpload () {
        window['appSendImageUrlToWeb'] = (obj) => {
          this.getAndRoidObj(obj)
        };
      },
      // 上传图片IOS
      async uploadSuccessFn() {
        let imgVal = this.$refs.uploadFile
        let imgObj = imgVal.files[0]
        imgVal.value = ''
        if (imgObj) {
          let isLt2M = imgObj.size / 1024 / 1024 <= 5
          let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
          if (!(isLt2M && isType)) {
            this.toastD(this.$t('common.text9'))
            imgVal.value = ''
            return
          }
        } else {
          return
        }
        this.myfile1 = imgObj

        // 通过canvas压缩图片
        let reader = new FileReader()
        let self = this
        reader.readAsDataURL(imgObj)
        self.isLoading = true
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          img.onload = function () {
            let formData = new FormData()
            let data = compress(img)
            self.imgUrl = result
            let blob = dataURItoBlob(data)
            let reader2 = new FileReader()
            reader2.readAsArrayBuffer(blob)
            reader2.onloadend = function () {
              let f = new File([this.result], imgObj.name)
              let fileImg 
              if (f) {
                fileImg = new File([this.result], imgObj.name)
              } else {
                fileImg = self.$refs.uploadFile.files[0]
              }
              formData.append('myfile', self.myfile1)
              self.$fetch.postFormdata(`${self.$api}/uploadfile/uploadimg`, formData).then((res) => {
                if (res.success) {
                  self.insertEmbed(res.data.fileUrl) // 图片路径渲染到富文本中
                  if (res.data) {
                    setTimeout(() => {
                      self.isLoading = false
                    },800)
                  }
                  imgVal.value = ''
                }
              }).catch((err) => {
                self.isLoading = false
                imgVal.value = ''
                self.toastD(res.msg)  // 上传图片失败原因
              })
            }
          }
        }
      },
      // 图片url渲染到富文本区域
      insertEmbed (url) {
        if (!url) return
        let quill = this.$refs.myQuillEditor.quill
        let length = quill.getSelection(true).index
        quill.insertEmbed(length, 'image', url)
        quill.setSelection(length + 1)
      },
      goBack () {
        if (parseInt(this.$store.state.device) === 0) {
          window.android.back()
        } else {
          window.webkit.messageHandlers.back.postMessage(null)
        }
      },
      // 跳预览
      gtToPreview () {
        if (!this.title) {
          this.toastD(this.$t('common.text7'))
        }
        if (!this.content) {
          this.toastD(this.$t('common.text8'))
        }
        let contentHtml = {
          contentHtml: this.content,
        }
        let urlArr = document.querySelectorAll('.quill-editor img')
        let imgUlr = []
        for (let i in urlArr) {
          // https://ganxibao.blob.core.windows.net/headimg/de3be3dffa08d17bc665d5864383735f.jpg
          if(urlArr[i].currentSrc) {
            let img_ = urlArr[i].currentSrc.split("/")[4]
            imgUlr.push(img_)
          }
        }
        this.imgArr = imgUlr
        if (this.title && this.content) {
          this.$router.push({
            path: '/preview/preview',
            query:{
              releaseId: 1,
              headImage: this.headImage,
              userName: this.userName,
              contentHtml: contentHtml,
              title: this.title,
              imgDomain: this.imgDomain,
            }
          })
        }
      }
    },
    components: {
      quillEditor
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
.release-wrap{
    width: 100vw !important;
    background-color: #fff;
    padding: 0 15px !important;
    .head{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 9999;
        height: 46px;
        line-height: 46px;
        border-bottom: 1px solid #e8e8e9;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 14px;
        padding: 0 15px;
        .iosx & {
            margin-top: 40px;
        }
        .ios & {
            margin-top: 20px;
        }
        .back{
            width: 45px;
            height: 100%;
            color: #b2b2b2;
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
    .main{
        width: 100%;
        margin-top: 46px;
       // min-height: calc(100vh - 66px - 131px);
        /*.ios & {
            min-height: calc(100vh - 66px - 131px);
        }
        .iosx & {
            min-height: calc(100vh - 66px - 131px);
        }*/
        .iosx & {
            margin-top: 86px;
        }
        .ios & {
            margin-top: 66px;
        }
        .title{
          height: 54px;
          line-height: 54px;
          text-align: left;
          font-size: 19px;
          border-bottom: 1px solid #e8e8e9;
          color: #0b0e14;
          background-color: #fff;
          position: fixed;
          left: 15px;
          right: 15px;
          z-index: 900; // 定位........
          top: 46px;
          .iosx & {  
              top: 86px;
          }
          .ios & {
              top: 66px;
          } 
            .input-text{
                width: 100%;
                height: 100%;
                font-size: 19px;
                display: inline-block;
            }
        }
        .rich-text{
            position: relative;
            left: 0;
            right: 0;
            top: 66px;
            .iosx & {
                &.active{
                    top: 140px !important
                }
            }
            &.active{
              position: fixed;
              top: 112px !important;
              left: 15px;
              right: 15px;
                /*.iosx &{
                    top: 140px !important;
                }
                .ios &{
                    top: 112px !important;
                }*/
              .ql-container{
                  top: 40px !important;
              }
            }
            /*.iosx & {
                top: 106px;
            }
            .ios & {
                top: 66px;
            }*/
            /deep/ .ql-container{
                height: calc(100% - 40px);
                .iosx &{
                    height: 100%;
                }
                .ios &{
                    height: 100%;
                }
                .ql-editor{
                    padding: 0;
                    font-size: 14px;
                    &::before{
                        color: #b2b2b2;
                        left: 0 !important;
                    }
                    p{
                        line-height: 1.5;
                    }
                }
            }
      /deep/.quill-editor{
                height: calc(100vh - 203px);
                .iosx & {  
                    height: calc(100vh - 351px);
                }
                .ios & {  
                    height: calc(100vh - 304px);
                }
                /deep/.ql-toolbar{
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    position: fixed;
                    left: 15px;
                    right: 0;
                    padding-left: 0;
                    padding-right: 0;
                    z-index: 850;
                    top: 111px;
                    .iosx & {
                        top: 146px;
                    }
                    .ios & {
                        top: 134px;
                    }
                    .ql-formats{
                        margin-right: 0;
                        &:nth-child(1){
                            width: 163px;
                            margin-left: 0;
                           /* pointer-events:none*/
                        }
                        &:nth-child(2){
                            width: 28px;
                            margin-right: 0;
                        }
                        .ql-color{
                            &:nth-child(1){
                                padding-top: 1px;
                            }
                        }
                        /*.ql-expanded:first-child .ql-picker-options{
                            top: 0 !important;
                        }*/
                    }
                }
                /deep/.ql-snow{
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    border: none;
                    ol,ul{
                        padding-left: 0;
                    }
                    ul{
                        li:not(.ql-direction-rtl){
                            padding-left: 1em;
                        }
                    }
                    .ql-editor{
                        font-size: 14px;
                        line-height: 1.5 !important;
                        padding: 0 !important;
                        p{
                            img{
                                margin-bottom: 10px;
                                vertical-align: middle;
                            }
                        }
                    }
                   /deep/ .ql-blank::before{
                        color: #b2b2b2;
                        left: 0 !important;
                    }
                }
                /deep/ .ql-container{
                    position: absolute;
                    top: 40px;
                    left: 0px;
                    right: 0px;
                    z-index: 800;
                    .iosx & {
                        top: 50px;
                    }
                }
            }
            .add-box{ // ios覆盖插件上传自定义按钮
                position: absolute;
                width: 36px;
                height: 26px;
                top: -34px;
                left: 300px;
                z-index: 999;
                padding-top: 0;
                display: block;
                opacity: 0;
                font-size: 0;
                &.activeIos{
                    top: 10px;
                    left: 159px;
                }
                input{
                    display: block;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                }
            }
            .cube-loading{
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }
        }
        #rich-text /deep/ *{  
            -webkit-user-select:text !important;
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
        z-index: 9999;
        .add-box{
            width: 36px;
            height: 26px;
            top: -34px;
            left: 188px;
            z-index: 990;
            background-color: yellowgreen;
            padding-top: 0;
            display: block;
            opacity: .9;
            font-size: 0;
        }
        .iosx & {
            padding-bottom: 68px;
        }
        .ios & {
            padding-bottom: 40px;
        }
        .button{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
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
                background-color: #e8e8e9;
                border-radius: 6px;
                box-shadow: 0  5px 6px rgba(64,129,255,.1);
                flex: 1;
                position: relative;
                &:nth-child(1){
                    margin-right: 8px;
                    background-color: #4081ff;
                }
                &:nth-child(2){
                    margin-left: 8px;
                    background-color: #8dc5ff;
                }
                &.active{
                    &:nth-child(2){
                        background-color: #4081ff;
                    }
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