<template>
  <div class="content">

    <div class="success">
      <van-icon color="#1AAD19;" size="100px" name="checked" />
      <p class="submit-result">提交成功</p>
      <p class="submit-tip">您的转诊申请已提交，请等待协和医院处理！</p>
      <button @click="goHome()" class="button submit-button">返回首页</button>
      <button @click="goApplyAnother()" class="button close-button">继续提交</button>
    </div>

    <!--<div v-else class="error">
      <van-icon color="#D9D9D9;" size="100px" name="clear" />
      <p class="submit-result">提交失败</p>
      <p class="submit-tip">您的转诊申请提交失败，请重新操作提交！</p>
      <button @click="goApplyAnother()" class="button submit-button">重新提交</button>
      <button @click="goHome()" class="button close-button">返回首页</button>
    </div>-->

  </div>
</template>

<script>

  export default {
    data () {
      return {
        // isSuccess:false
      }
    },

    methods: {
      goHome(){
        this.$router.push('/pages/index/main')
      },
      goApplyAnother(){
        this.$router.push('/pages/applyShift/main')
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
    >>> ._van-icon {
      display: block;
      width: 100px;
      height: 100px;
      margin: 32px auto 27px;
    }
    .submit-result {
      color:#101010;
      font-size: 20px;
      text-align: center;
    }
    .submit-tip {
      color: #A0A0A0;
      font-size: 14px;
      text-align: center;
      margin: 7px 0 48px 0;
    }
    .button {
      margin: 25px auto 0;
      width: 335px;
      height: 47px;
      background-color: #1AAD19;
      color: #FFFFFF;
      font-size: 18px;
      line-height: 47px;
    }
    .close-button {
      margin: 10px auto 50px;
      background-color: #D9D9D9;
      color: #0F0F0F;
    }
  }
</style>
