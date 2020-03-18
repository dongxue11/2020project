<template>
  <div class="content">
    <web-view :src="toUrl"></web-view>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
  import { get } from "@/utils/request"
  import Toast from '../../../../node_modules/@vant/weapp/dist/toast/toast'

  export default {
    data () {
      return{
        toUrl:''
      }
    },

    methods:{
      getBanner(){
        get(`/applet/getBannerImage`).then(res=>{
          if(res.code===0){
            this.toUrl = res.data.toUrl
          }else {
            Toast(res.msg)
          }
        })
      }
    },
    onShow () {
      if(!mpvue.getStorageSync('token')){
        this.$router.push('/pages/login/main')
      }
    },
    mounted(){
      this.getBanner()
    }
  }
</script>

<style scoped lang='scss'>

</style>
