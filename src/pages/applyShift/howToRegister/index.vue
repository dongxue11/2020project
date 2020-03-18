<template>
  <div class="content">
    <h3 class="title">第一步：扫描下方彩色二维码进行下载</h3>
    <img class="image code" :src="imageOneOne" />

    <h3 class="title">第二步：注册</h3>
    <h4 class="sub-title">1、进入APP首页，点击右下角【我】</h4>
    <img class="image" :src="imageTwoOne" />
    <h4 class="sub-title">2、进入个人中心，点击【头像】</h4>
    <img class="image" :src="imageTwoTwo" />
    <h4 class="sub-title">3、进入登录页面，点击【用户注册】</h4>
    <img class="image" :src="imageTwoThree" />
    <h4 class="sub-title">4、输入手机号，点击【下一步，获取验证码】</h4>
    <img class="image" :src="imageTwoFour" />
    <h4 class="sub-title">5、输入验证码，点击【下一步】</h4>
    <img class="image" :src="imageTwoFive" />
    <h4 class="sub-title">6、设置密码和基本信息，完成注册</h4>
    <img class="image" :src="imageTwoSix" />

    <h3 class="title">第三步：建档</h3>
    <h4 class="sub-title">1、进入APP首页，点击【注册建档】</h4>
    <img class="image" :src="imageThreeOne" />
    <h4 class="sub-title">2、身份信息输入，点击【立即建档】</h4>
    <img class="image" :src="imageThreeTwo" />
    <h4 class="sub-title">3、输入验证码验证，点击【下一步】</h4>
    <img class="image" :src="imageThreeThree" />
    <h4 class="sub-title">4、建档成功，获取ID号</h4>
    <img class="image last" :src="imageThreeFour" />


    <div class="bottom-fixed">
      <button @click="downloadFile" :disabled="downloadBtnInvalid" class="button download">下载文档</button>
      <button @click="closeRegister" class="button">关闭</button>
    </div>

    <van-toast id="van-toast" />
  </div>
</template>

<script>
  import { get,baseUrl } from "@/utils/request"
  import Toast from '../../../../node_modules/@vant/weapp/dist/toast/toast'
  import {success} from "../../../../dist/wx/@vant/weapp/dist/toast/toast";

  export default {
    data () {
      return {
        imageOneOne:`${baseUrl}/preImages/applet/images/register1.png`,
        imageTwoOne:`${baseUrl}/preImages/applet/images/register2-1.png`,
        imageTwoTwo:`${baseUrl}/preImages/applet/images/register2-2.png`,
        imageTwoThree:`${baseUrl}/preImages/applet/images/register2-3.png`,
        imageTwoFour:`${baseUrl}/preImages/applet/images/register2-4.png`,
        imageTwoFive:`${baseUrl}/preImages/applet/images/register2-5.png`,
        imageTwoSix:`${baseUrl}/preImages/applet/images/register2-6.png`,
        imageThreeOne:`${baseUrl}/preImages/applet/images/register3-1.png`,
        imageThreeTwo:`${baseUrl}/preImages/applet/images/register3-2.png`,
        imageThreeThree:`${baseUrl}/preImages/applet/images/register3-3.png`,
        imageThreeFour:`${baseUrl}/preImages/applet/images/register3-4.png`,
        fileUrl:'',
        downloadBtnInvalid:false,//控制下载按钮是否不可用
      }
    },

    methods: {
      closeRegister(){
        this.$router.go(-1)
      },
      getRegisterFile(){
        get(`/applet/pregnant/getRegDoc`).then(res=>{
          if(res.code===0){
            this.fileUrl = res.data.url
          }else {
            Toast(res.msg)
          }
        })
      },
      downloadFile(){
        Toast('下载进行中')
        this.downloadBtnInvalid = true
        const that = this
        // let fm = mpvue.getFileSystemManager()
        mpvue.downloadFile({
          // 示例 url，并非真实存在
          url: this.fileUrl,
          success (res) {
            mpvue.openDocument({
              filePath: res.tempFilePath,
              complete(){
                that.downloadBtnInvalid = false
              }
            })
            /*mpvue.saveFile({
              tempFilePath: res.tempFilePath,
              success (res) {
                console.log(res.savedFilePath)
                Toast(`下载成功`)
                that.downloadBtnInvalid = false
              },
              fail(error){
                Toast('下载失败')
                that.downloadBtnInvalid = false
              }
            })*/
          }
        })
      }
    },
    onShow () {
      if(!mpvue.getStorageSync('token')){
        this.$router.push('/pages/login/main')
      }
      this.getRegisterFile()
    }
  }
</script>

<style scoped lang='scss'>
  .content {
    .title {
      background-color: #1AAD19;
      color: #FFFFFF;
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 17px;
      margin-bottom: 10px;
    }
    .sub-title {
      background-color: #FAFAFA;
      height:28px;
      line-height: 28px;
      font-size: 13px;
      padding-left: 10px;
      margin-bottom: 6px;
    }
    .image {
      display: block;
      margin: 0 auto 10px;
      width: 200px;
      height: 360px;
    }
    .image.code {
      height: 200px;
    }
    .image.last {
      margin-bottom: 120px;
    }


    .bottom-fixed {
      padding-bottom: 10px;
      background-color: #FFFFFF;
      position: fixed;
      bottom: 0;
      text-align: center;
      width: 100%;
      box-sizing: border-box;
      .button {
        margin-top: 18px;
        font-size: 13px;
        color: #353535;
        width: 60px;
        height: 30px;
        line-height: 30px;
      }
      .button.download {
        background-color: #1AAD19;
        color: #FFFFFF;
      }
    }
  }
</style>
