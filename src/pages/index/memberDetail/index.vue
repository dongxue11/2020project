<template>
  <div class="content">
<!--    基本信息-->
    <div class="base-info">
      <h3 class="list-title">基本信息</h3>
      <van-cell-group>
        <van-cell title-width="130px" title="姓名" :value="memberInfo.pregName" />
        <van-cell title-width="130px" title="手机号" :value="memberInfo.mobile" />
        <van-cell title-width="130px" title="备用手机号" :value="memberInfo.mobileBak" />
        <van-cell title-width="130px" title="实际出生日期" :value="memberInfo.birthTime" />
        <van-cell title-width="130px" title="年龄" :value="memberInfo.pregAge" />
        <van-cell title-width="130px" title="末次月经日期" :value="memberInfo.lastMenstrualDate" />
        <van-cell title-width="130px" title="孕周" :value="memberInfo.gestationalAge" />
        <van-cell title-width="130px" title="身高">{{memberInfo.height}}<span style="float: right; color: #333333;">cm(厘米)</span></van-cell>
        <van-cell title-width="130px" title="体重">{{memberInfo.weight}}<span style="float: right; color: #333333;">kg(千克)</span></van-cell>
        <van-cell title-width="130px" title="BMI">{{memberInfo.bmi}}<span style="float: right; color: #333333;">kg/m/m</span></van-cell>
        <van-cell title-width="130px" title="妊娠方式" :value="memberInfo.pregnancyModeName" />
        <van-cell title-width="130px" title="胎儿数" :value="memberInfo.fetusNumName" />
        <van-cell title-width="130px" title="NT" :value="memberInfo.nt" />
        <van-cell title-width="130px" title="转诊原因" :value="memberInfo.reasonsName" />
        <van-cell title-width="130px" title="协和医院ID号" :value="memberInfo.xieheId" />
        <van-cell title-width="130px" title="孕妇初步意向" :value="memberInfo.preWomenIntentionName" />
        <van-cell title-width="130px" title="特殊情况" :value="memberInfo.specialCaseName" />
      </van-cell-group>
      <div class="other" v-if="imagesList.length">
        <p class="title">其他</p>
        <div class="image-list">
          <img class="image-item" v-for="(item,index) in imagesList" :key="index" :src="item.url" />
        </div>
      </div>
    </div>
<!--    转诊信息-->
    <div class="shift-info" v-if="memberInfo.status!=='1'">
      <h3 class="list-title">转诊信息</h3>
      <van-cell-group>
        <van-cell title-width="130px" title="转诊结果" :value="memberInfo.statusName" />
        <van-cell title-width="130px" title="操作日期" :value="memberInfo.receptionTime" />
        <van-cell title-width="130px" title="操作人" :value="memberInfo.operationUserRealName" />
      </van-cell-group>
    </div>
<!--    就诊信息-->
    <div class="finish-info" v-if="memberInfo.status==='4'|| memberInfo.status==='5'">
      <h3 class="list-title">就诊信息</h3>
      <van-cell-group>
        <van-cell title-width="130px" title="是否就诊" :value="memberInfo.isConsulation==='true'?'是':'否'" />
        <van-cell title-width="130px" title="就诊日期" :value="memberInfo.consulationTime" />
        <van-cell title-width="130px" title="主治大夫" :value="memberInfo.userRealname" />
        <van-cell title-width="130px" title="诊断信息" :value="memberInfo.resultFeedback" />
        <!--<div class="result-feed-back">
          <p class="title">诊断信息</p>
          <p class="detail">{{memberInfo.resultFeedback}}</p>
        </div>-->
      </van-cell-group>
    </div>

    <button @click="closePage()" class="close-button">关闭</button>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
  import { get } from "@/utils/request"
  import Toast from '../../../../node_modules/@vant/weapp/dist/toast/toast'

  export default {
    data () {
      return {
        memberInfo:{},
        imagesList:[]
      }
    },

    methods: {
      closePage(){
        if(this.$route.query.from==='index'){
          this.$router.push(`/pages/index/main`)
        }else {
          this.$router.push({path:`/pages/index/searchResult/main`,query:{from:'detail'}})
        }

      },
      getImages(preId){
        get(`/applet/pregnant/getPreImgs?preId=${preId}`).then(res=>{
          if(res.code===0){
            this.imagesList = res.data
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
    mounted () {
      this.memberInfo = this.$route.query
      this.getImages(this.memberInfo.id)
      console.log(this.memberInfo.status)
    }
  }
</script>

<style scoped lang='scss'>
  .content {
    >>> .van-cell__value {
      text-align: left;
    }
    .list-title {
      color: #1AAD19;
      font-size: 16px;
      border-bottom: 2px solid #1AAD19;
      padding: 10px 15px;
      background-color: #FAFAFA;
    }
    /*基本信息*/
    .base-info {
      .other {
        padding: 10px 15px;
        .title {
          font-size: 14px;
          color: #333333;
        }
        .image-list {
          .image-item {
            margin: 10px 8px 0 0;
            width: 80px;
            height: 80px;
          }
          .image-item:nth-child(4n) {
            margin-right: 0;
          }
        }
      }
    }
    /*转诊信息*/
    .shift-info {

    }
    /*就诊信息*/
    .finish-info {
      .result-feed-back {
        padding: 10px 15px;
        font-size: 14px;
        .title {
          color: #333333;
        }
        .detail {
          color: #969799;
          margin-top: 10px;
          line-height: 16px;
        }
      }
    }
    .close-button {
      margin: 25px auto 50px;
      width: 335px;
      height: 47px;
      background-color: #1AAD19;
      color: #FFFFFF;
      font-size: 18px;
      line-height: 47px;
    }
  }
</style>
