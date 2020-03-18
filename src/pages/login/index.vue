<template>
  <div class="content">
    <img class="login-info-img" :src="imageUrl" />
    <div class="login-form">
      <p class="title">手机号</p>
      <input type="number" @input="phoneNumber=phoneNumber.replace(/\D/g,'')" class="login-input" placeholder="请输入手机号" maxlength="11" v-model="phoneNumber" />
      <p class="title">密码</p>
      <input type="password" @input="password=password.replace(/[^\w]/g,'')" class="login-input" placeholder="请输入密码" maxlength="16" v-model="password" />
      <button class="login-button" open-type="getUserInfo" @getuserinfo="login">登录</button>
      <p @click="toForgetPassword" class="forget-password">忘记密码</p>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
  import Toast from '../../../node_modules/@vant/weapp/dist/toast/toast'
  import { post,baseUrl } from "@/utils/request"

export default {
  computed:{
    // 用于校验手机号码格式是否正确
    phoneNumberStyle(){
      let reg = /^1[3456789]\d{9}$/
      if(!reg.test(this.phoneNumber)){
        return false
      }
      return true
    },
  },
  data () {
    return {
      imageUrl:`${baseUrl}/preImages/applet/images/login_info.png`,
      phoneNumber:'',
      password:'',
    }
  },

  methods: {
    // 点击登录按钮+授权+登录
    login(res){
      // res 即为获取的用户信息
      if(this.phoneNumber!==''){
        if(this.phoneNumberStyle){
          if(this.password!==''){
            if(this.password.length>=6){
              post(`/aplt/login?phone=${this.phoneNumber}&password=${this.password}`).then(res=>{
                if(res.code===0 && res.data){
                  this.phoneNumber = ''
                  this.password = ''
                  mpvue.setStorageSync('token', res.data.token)
                  this.$router.replace('/pages/index/main')
                }else {
                  Toast(res.msg)
                }
              })
            }else {
              Toast('密码至少6位，请重新输入')
            }
          }else {
            Toast('密码为空，请重新输入')
          }
        }else {
          Toast('手机号码不正确，请重新输入')
        }
      }else {
        Toast('手机号码为空，请重新输入')
      }
    },
    toForgetPassword(){
      this.$router.replace('/pages/login/forgetPassword/main')
    }
  },

  created () {

  }
}
</script>

<style scoped lang='scss'>
  .content {
    padding: 0 20px;
    .login-info-img {
      width: 90%;
      height: 375px;
      display: block;
      margin: 0 auto;
    }
    .login-form {
      .title {
        color: #101010;
        font-size: 14px;
        margin-bottom: 4px;
      }
      .login-input {
        display: block;
        width: 100%;
        height: 30px;
        border: 1px solid #BBBBBB;
        box-sizing: border-box;
        margin-bottom: 8px;
        padding: 0 10px;
      }
      .login-button {
        display: block;
        margin: 0 auto;
        height: 47px;
        width: 335px;
        color: #FFFFFF;
        border-radius: 5px;
        line-height: 47px;
        font-size: 18px;
        background-color: #1AAD19;
        box-sizing: border-box;
      }
      .forget-password {
        text-align: right;
        font-size: 11px;
        color: #808080;
        line-height: 23px;
        margin-top: 7px;
      }
    }
  }

</style>
