<template>
  <div class="content">

    <div class="search-bar">
      <van-icon v-if="!preName" class="search-icon" name="search" color="#BDBDBD" size="16px" />
      <input :focus="true" v-model="preName" class="search-input" placeholder="请输入姓名" placeholder-style="color:#BDBDBD;font-size: 14px;" />
      <button :disabled="searchBtnInvalid" @click="onSearch" class="search-button">搜索</button>
    </div>

    <p class="record-count">搜索到 <span style="color: #FF0000">{{total}}</span> 条记录</p>

    <ul class="memberList">
      <li v-for="(item,index) in memberList" :key="index" @click="toDetail(item)" class="member-item">
        <p class="member-item-name">{{item.pregName}}</p>
        <p class="member-item-reason" v-if="item.reasonsName">转诊原因：{{item.reasonsName}}</p>
        <p class="member-item-info"><span v-if="item.applyTime">申请日期：{{item.applyTime || ''}}｜ </span><span v-if="item.statusName">转诊状态：{{item.statusName}}</span></p>
      </li>
    </ul>
    <van-toast id="van-toast" />
  </div>
</template>

<script>
  import { get } from "@/utils/request"
  import Toast from '../../../../node_modules/@vant/weapp/dist/toast/toast'

  export default {
    data () {
      return {
        preName:'',
        pageNum: 1,
        memberList:[],
        total:0,
        finish:false,
        searchBtnInvalid:false// 标记搜索按钮是否不可用
      }
    },

    methods: {
      toDetail(item){
        this.$router.push({path:'/pages/index/memberDetail/main',query:{from:'searchResult',...item}})
      },
      onSearch(){
        this.memberList = []
        this.pageNum = 1
        this.searchBtnInvalid = true //搜索按钮不可用，接口请求成功再可用
        this.getMemberList()
      },
      getMemberList(){
        get(`/applet/pregnant/getList?preName=${this.preName}&type=1&pageNum=${this.pageNum}&pageSize=6`).then(res=>{
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
              this.searchBtnInvalid = false
            }else {
              Toast(res.msg)
            }
          })
      },
    },
    onShow () {
      if(!mpvue.getStorageSync('token')){
        this.$router.push('/pages/login/main')
      }
      if(this.$route.query.from==='index'){
        this.preName = ''
        this.pageNum = 1
        this.memberList = []
        this.finish = false
        this.total = 0
      }
    },
    onReachBottom(){
      if(!this.finish){
        this.getMemberList()
      }
    }
  }
</script>

<style scoped lang='scss'>
  .content {
    padding-bottom: 20px;
    .search-bar {
      width: 100%;
      height: 45px;
      background-color: #E8E8EB;
      padding:6px 10px 0 10px;
      box-sizing: border-box;
      position: relative;
      .search-input {
        width: 282px;
        height: 32px;
        background-color: #fff;
        border-radius: 4px;
        text-align: center;
        font-size: 14px;
        float: left;
      }
      .search-icon {
        position: absolute;
        left: 98px;
        top: 55%;
        transform: translateY(-50%);
      }
      .search-button {
        width: 66px;
        height: 32px;
        border-radius: 4px;
        font-size: 14px;
        line-height: 32px;
        float: right;
        background-color: #1AAD19;
        color: #FFFFFF;
      }
    }
    .record-count {
      color: #101010;
      font-size: 14px;
      margin-top: 8px;
      padding: 0 6px;
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
</style>
