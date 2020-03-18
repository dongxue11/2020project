<template>
  <div class="content">
    <div class="setting-bar" @click="toChangePassword">
      <span class="left title">登录密码</span>
      <van-icon class="right icon" name="arrow"></van-icon>
      <span class="right placeholder">修改密码</span>
    </div>
    <button @click="logout" class="logout-button">退出</button>
  </div>
</template>

<script>
  import { get } from "@/utils/request"

  export default {
  data () {
    return {

    }
  },

  methods: {
    toChangePassword (){
      this.$router.push('/pages/setting/checkShortInfo/main')
    },
    logout(){
      get(`/aplt/logout`).then(res=>{
        if(res.code===0){
          mpvue.clearStorageSync()
          this.$router.push('/pages/login/main')
        }
      })
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
  .setting-bar {
     margin: 24px 0;
     padding: 0 14px;
     width: 100%;
     height: 45px;
     box-sizing: border-box;
     .title {
       font-size: 16px;
       color: #101010;
     }
     .icon {
       font-size: 15px;
       color: #A7A8AB;
       margin-top: 3px;
     }
     .placeholder {
       font-size: 17px;
       color: #808080;
     }
     .left {
       float: left;
     }
     .right {
       float:right;
     }

   }
  .logout-button {
    display: block;
    margin: 0 auto;
    height: 47px;
    width: 348px;
    color: #121212;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    line-height: 47px;
    font-size: 18px;
    background-color: #F7F7F7;
    box-sizing: border-box;
  }
</style>
