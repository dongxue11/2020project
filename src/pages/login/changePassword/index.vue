<template>
  <div class="content">
    <img class="login-logo" :src="logoUrl" />
    <div class="change-form">
      <p class="title">新密码</p>
      <input type="password" @input="password=password.replace(/[^\w]/g,'')" class="change-input" placeholder="请输入新密码" maxlength="16" v-model="password" />
      <p class="title">确认密码</p>
      <input type="password" @input="rePassword=rePassword.replace(/[^\w]/g,'')" class="change-input" placeholder="请再次输入新密码" maxlength="16" v-model="rePassword"/>
      <button @click="makeSureChange" class="makesure-button">确定</button>
    </div>
    <van-dialog id="van-dialog" />
    <van-toast id="van-toast" />
  </div>
</template>

<script>
  import Dialog from '../../../../node_modules/@vant/weapp/dist/dialog/dialog'
  import Toast from '../../../../node_modules/@vant/weapp/dist/toast/toast'
  import { post,baseUrl } from "@/utils/request"

  export default {
    data () {
      return {
        // 从上个页面带过来的手机号和验证码
        logoUrl:`${baseUrl}/preImages/applet/images/logo.png`,
        phoneNumber:'',
        verificationCode:'',
        password:'',
        rePassword:''
      }
    },

    methods: {
      makeSureChange(){
        if(this.password===this.rePassword){
          post(`/aplt/modifyLoginPassword?phone=${this.phoneNumber}&code=${this.verificationCode}&type=1_0&newPassword=${this.password}&confirmPassword=${this.rePassword}`).then(res=>{
            if(res.code===0){
              this.password = ''
              this.rePassword = ''
              Dialog.alert({
                message: '密码修改成功，请重新登录',
                confirmButtonText:'去登录'
              }).then(() => {
                this.$router.replace('/pages/login/main')
              });
            }else {
              Toast(res.msg)
            }
          })
        }else {
          Toast('两次密码不一致，请重新输入')
        }
      }
    },
    mounted () {
      this.phoneNumber = this.$route.query.phone
      this.verificationCode = this.$route.query.code
    }
  }
</script>

<style scoped lang='scss'>
  .content {
    padding: 10px 20px;
    .login-logo {
      display: block;
      width: 80px;
      height: 80px;
      margin: 120px auto 30px;
    }
    .change-form {
      .title {
        color: #101010;
        font-size: 14px;
        margin-bottom: 4px;
      }
      .change-input {
        display: block;
        width: 100%;
        height: 30px;
        border: 1px solid #BBBBBB;
        box-sizing: border-box;
        margin-bottom: 8px;
        padding: 0 10px;
      }
      .makesure-button {
        margin-top: 50px;
        display: block;
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
    >>> .van-dialog__message {
      height: 100px;
      line-height: 50px;
      font-size: 14px;
      box-sizing: border-box;
    }
    >>> .van-button__text {
      color: #3DBE1C;
    }
  }

</style>
