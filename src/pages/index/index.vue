<template>
  <div class="content">

    <div class="search-bar">
      <van-icon @click="toSearchResult" class="search-icon" name="search" color="#BDBDBD" size="16px" />
      <input @click="toSearchResult" class="search-input" disabled placeholder="请输入姓名" placeholder-style="color:#BDBDBD;font-size: 14px;" />
      <van-icon @click="toSetting" class="setting-icon" name="setting" color="#9D9999" size="20px" />
    </div>


    <div @click="toBannerUrl" class="banner">
      <img class="banner-img" :src="banner.imgUrl"/>
    </div>

    <div class="member">
      <div class="tab-bar">
        <span @click="changeTab(1)" :class="{'tab-item':true,'active':type===1}">全部</span>
        <span @click="changeTab(2)" :class="{'tab-item':true,'active':type===2}">转诊记录</span>
        <span @click="changeTab(3)" :class="{'tab-item':true,'active':type===3}">就诊记录</span>
      </div>
      <ul class="memberList">
        <li v-for="(item,index) in memberList" :key="index" @click="toDetail(item)" class="member-item">
          <p class="member-item-name">{{item.pregName}}</p>
          <p class="member-item-reason" v-if="item.reasonsName">转诊原因：{{item.reasonsName}}</p>
          <p class="member-item-info"><span v-if="item.applyTime">申请日期：{{item.applyTime || ''}}｜ </span><span v-if="item.statusName">转诊状态：{{item.statusName}}</span></p>
        </li>
      </ul>
    </div>
    <div class="apply-shift">
      <button @click="toApplyShift" class="apply-button">申请转诊</button>
    </div>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
  import { get } from "@/utils/request"
  import Toast from '../../../node_modules/@vant/weapp/dist/toast/toast'

  export default {
    data () {
      return {
        banner:{
          imgUrl:'',
          toUrl:''
        },
        type:1,//获取用户列表时的type
        pageNum: 1,
        total:0,
        memberList:[],
        finish:false
      }
    },

    methods: {
      // 跳转至banner地址
      toBannerUrl(){
        if(this.banner.toUrl){
          this.$router.push('/pages/index/jumpBanner/main')
        }

      },
      // 切换tab栏
      changeTab(type){
        if(this.type !== type){
          this.type = type
          this.pageNum = 1
          this.finish = false
          this.memberList = []
          this.getMemberList()
        }
      },
      getMemberList(){
        get(`/applet/pregnant/getList?type=${this.type}&pageNum=${this.pageNum}&pageSize=6`).then(res=>{
          if(res.code===0){
            res.data.map(item=>{
              if(item.applyTime){
                let time = new Date(item.applyTime)
                item.applyTime = `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日`
              }
              if(item.birthTime){
                let time = new Date(item.birthTime)
                item.birthTime = `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日`
              }
              if(item.lastMenstrualDate){
                let time = new Date(item.lastMenstrualDate)
                item.lastMenstrualDate = `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日`
              }
              if(item.receptionTime){
                let time = new Date(item.receptionTime)
                item.receptionTime = `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日`
              }
              if(item.consulationTime){
                let time = new Date(item.consulationTime)
                item.consulationTime = `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日`
              }
            })
            this.memberList = [...this.memberList,...res.data]
            this.total = res.total
            this.pageNum++
            if(this.memberList.length === this.total){
              this.finish = true
            }
          }else {
            Toast(res.msg)
          }
        })
      },
      getBanner(){
        get(`/applet/getBannerImage`).then(res=>{
          if(res.code===0){
            this.banner = res.data
          }else {
            Toast(res.msg)
          }
        })
      },
      toSetting(){
        this.$router.push('/pages/setting/main')
      },
      toSearchResult(){
        this.$router.push({path:'/pages/index/searchResult/main',query:{from:'index'}})
      },
      toDetail(item){
        this.$router.push({path:'/pages/index/memberDetail/main',query:{from:'index',...item}})
      },
      toApplyShift(){
        this.$router.push('/pages/applyShift/main')
      }
    },
    onReachBottom(){
      if(!this.finish){
        this.getMemberList()
      }
    },
    onShow () {
      if(!mpvue.getStorageSync('token')){
        this.$router.push('/pages/login/main')
      }
      this.pageNum = 1
      this.memberList = []
      this.finish = false
      this.getMemberList()
    },
    mounted(){
      this.getBanner()
    }
  }
</script>

<style scoped lang='scss'>
  .search-bar {
    width: 100%;
    height: 45px;
    background-color: #E8E8EB;
    padding:6px 0 0 10px;
    box-sizing: border-box;
    position: relative;
    .search-input {
      width: 318px;
      height: 32px;
      background-color: #fff;
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
    }
    .search-icon {
      position: absolute;
      left: 116px;
      top: 55%;
      transform: translateY(-50%);
    }
    .setting-icon {
      position: absolute;
      right: 12px;
      top: 55%;
      transform: translateY(-50%);
    }
  }
  .banner {
    width: 100%;
    height: 170px;
    padding: 8px;
    box-sizing: border-box;
    .banner-img {
      height: 100%;
      width: 100%;
    }
  }
  .member {
    margin-bottom: 80px;
    .tab-bar {
      display: flex;
      .tab-item {
        flex: 1;
        display: block;
        height: 50px;
        border: 1px solid #E6E6E6;
        text-align: center;
        line-height: 50px;
        background-color: #FAFAFA;
      }
      .tab-item:nth-child(-n+1) {
        border-right: none;
      }
      .tab-item.active {
        background-color: #1AAD19;
        color: #FFFFFF;
      }
    }
    .memberList {
      .member-item {
        position: relative;
        margin-top: 8px;
        width: 100%;
        height: 96px;
        padding: 12px 15px;
        box-sizing: border-box;
        background-color: #E8E8E8;
        .member-item-name {
          color: #222222;
          font-size: 17px;
        }
        .member-item-reason {
          color: #999999;
          font-size: 13px;
          margin-top: 8px;
        }
        .member-item-info {
          color: #999999;
          font-size: 13px;
          position: absolute;
          bottom: 16px;
        }
      }
    }
  }
  .apply-shift {
    padding: 10px;
    position: fixed;
    width: 100%;
    box-sizing: border-box;
    bottom: 0;
    background-color: #FFFFFF;
    .apply-button {
      display: block;
      margin: 0 auto;
      height: 35px;
      width: 180px;
      color: #1AAD19;
      border: 1px solid #1AAD19;
      border-radius: 5px;
      line-height: 35px;
      font-size: 16px;
      background-color: #fff;
    }
  }

</style>
