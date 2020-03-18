<template>
  <div class="content">
    <div class="login-form">
      <p class="title">手机号</p>
      <input type="text" @input="phoneNumber=phoneNumber.replace(/\D/g,'')" class="login-input phone" placeholder="请输入手机号" maxlength="11" v-model="phoneNumber" />
      <p class="title">验证码</p>
      <input  type="text" @input="verificationCode=verificationCode.replace(/\D/g,'')" class="login-input verifyCode" placeholder="请输入验证码" maxlength="4" v-model="verificationCode"/>
      <button @click="getCode()" :class="{'getcode-button':true,'disabled-style':getCodeBtnDisable}">{{codeBtnWord}}</button>
    </div>
    <button @click="toChangePassword" class="next-button">下一步</button>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
import Toast from '../../../../node_modules/@vant/weapp/dist/toast/toast'
import { get } from "@/utils/request"

export default {
  computed: {
    // 用于校验手机号码格式是否正确
    phoneNumberStyle(){
      let reg = /^1[3456789]\d{9}$/
      if(!reg.test(this.phoneNumber)){
        return false
      }
      return true
    },
    // 控制获取验证码按钮是否可点击
    getCodeBtnDisable:{
      get(){
        if(this.waitTime == 61){
          if(this.phoneNumber){
            return false
          }
          return true
        }
        return true
      },
      // 注意：因为计算属性本身没有set方法，不支持在方法中进行修改，而下面我要进行这个操作，所以需要手动添加
      set(){}
    }
  },
  data () {
    return {
      phoneNumber: '',
      verificationCode: '',
      codeBtnWord: '获取验证码', // 获取验证码按钮文字
      waitTime:61, // 获取验证码按钮失效时间
    }
  },

  methods: {
    toChangePassword() {
      if(this.phoneNumber!==''){
        if(this.phoneNumberStyle){
          if(this.verificationCode!==''){
            if(this.verificationCode.length===4){
              get(`/aplt/verifyMobileCode?phone=${this.phoneNumber}&code=${this.verificationCode}&type=2_0`).then(res=>{
                if(res.code===0) {
                  this.$router.push({path:'/pages/setting/changePassword/main',query:{phone:this.phoneNumber,code:this.verificationCode}})
                }else {
                  Toast(res.msg)
                }
              })
            }else{
              Toast('验证码不足4位，请重新输入')
            }
          }else {
            Toast('验证码为空，请重新输入')
          }
        }else {
          Toast('手机号码不正确，请重新输入')
        }
      }else {
        Toast('手机号码为空，请重新输入')
      }
    },
    getCode(){
      if(this.phoneNumber!==''){
        if(this.phoneNumberStyle){
          let params = {}
          params.phone = this.phoneNumber
          // 调用获取短信验证码接口
          get(`/aplt/getPhoneVerifyCode?phone=${this.phoneNumber}&type=2_0`).then(res=>{
            console.log(res)
            if(res.code===0){
              Toast('验证码已发送，请注意查收')
            }else {
              Toast(res.msg)
            }
          })
          // 因为下面用到了定时器，需要保存this指向
          let that = this
          that.waitTime--
          that.getCodeBtnDisable = true
          this.codeBtnWord = `${this.waitTime}s 后重新获取`
          let timer = setInterval(function(){
            if(that.waitTime>1){
              that.waitTime--
              that.codeBtnWord = `${that.waitTime}s 后重新获取`
            }else{
              clearInterval(timer)
              that.codeBtnWord = '获取验证码'
              that.getCodeBtnDisable = false
              that.waitTime = 61
            }
          },1000)
        }else {
          Toast('手机号码不正确，请重新输入');
        }
      }else {
        Toast('手机号码为空，请重新输入');
      }
    }
  },
  onShow () {
    if(!mpvue.getStorageSync('token')){
      this.$router.push('/pages/login/main')
    }
  },
  created () {

  }
}
</script>

<style scoped lang='scss'>
  .content {
    padding: 10px 20px;
    .login-form {
      overflow: hidden;
      .title {
        color: #101010;
        font-size: 14px;
        margin-bottom: 4px;
      }
      .login-input {
        height: 30px;
        border: 1px solid #BBBBBB;
        box-sizing: border-box;
        margin-bottom: 8px;
        padding: 0 10px;
      }
      .login-input.phone {
        width: 100%;
      }
      .login-input.verifyCode {
        width: 200px;
        float: left;
      }
      .getcode-button {
        width: 130px;
        height: 30px;
        border: 1px solid #BBBBBB;
        border-radius: 4px;
        font-size: 14px;
        color:#101010;
        line-height: 30px;
        background-color: #FFFFFF;
        float: right;
        box-sizing: border-box;
      }
      .getcode-button.disabled-style {
        background-color: #EEEEEE;
        color: #CCCCCC;
      }
    }
    .next-button {
      display: block;
      margin-top: 50px;
      height: 47px;
      width: 100%;
      color: #FFFFFF;
      border-radius: 5px;
      line-height: 47px;
      font-size: 18px;
      background-color: #1AAD19;
      box-sizing: border-box;
    }
  }
</style>
