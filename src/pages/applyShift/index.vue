<template>
  <div class="content">

    <van-cell-group class="group-list">
      <van-cell class="required" title-width="110px" title="姓名">
        <input type="text" placeholder="请输入姓名" v-model="pregName"/>
      </van-cell>
      <van-cell title-width="110px" title="手机号">
        <input type="number" maxlength="11" placeholder="请输入手机号" class="limit-width" @input="mobile=mobile.replace(/\D/g,'')" v-model="mobile"/>
        <span v-if="!showAnotherPhone" style="float: right; color: #333333;padding-left: 8px; border-left: 1px solid #E6E6E6;" @click="showAnotherPhone=true">新增手机号</span>
      </van-cell>
      <van-cell v-if="showAnotherPhone" title-width="110px" title="备用手机号">
        <input type="number" maxlength="11" placeholder="请输入备用手机号"  @input="mobileBak=mobileBak.replace(/\D/g,'')" v-model="mobileBak"/>
      </van-cell>
      <van-cell class="required" title-width="110px" title="实际出生日期">
        <div @click="showPickBirthDate=true"><van-icon v-if="!birthTime" name="tosend" style="vertical-align: middle;margin-right: 2px;"/>{{birthTime||'请选择日期'}}</div>
      </van-cell>
      <van-cell title-width="110px" title="年龄">{{pregAge||'请选择实际出生日期'}}</van-cell>
      <van-cell class="required" title-width="110px" title="末次月经日期">
        <div @click="showPickLastDate=true"><van-icon v-if="!lastMenstrualDate" name="tosend" style="vertical-align: middle;margin-right: 2px;"/>{{lastMenstrualDate||'请选择日期'}}</div>
      </van-cell>
      <van-cell title-width="110px" title="孕周">{{gestationalAge||'请选择末次月经日期'}}</van-cell>
      <van-cell class="required" title-width="110px" title="身高">
        <input type="number" maxlength="3" placeholder="请输入身高" @input="height=height.replace(/\D/g,'')" class="limit-width" v-model="height"/>
        <span style="float: right; color: #333333;">cm(厘米)</span>
      </van-cell>
      <van-cell class="required" title-width="110px" title="体重">
        <input type="number" maxlength="3" placeholder="请输入体重" @input="weight=weight.replace(/\D/g,'')" class="limit-width" v-model="weight"/>
        <span style="float: right; color: #333333;">kg(千克)</span>
      </van-cell>
      <van-cell title-width="110px" title="BMI">{{bmi||'请输入身高和体重'}}<span style="float: right; color: #333333;">kg/m/m</span></van-cell>
      <van-cell class="required" title-width="110px" title="妊娠方式">
        <div @click="showPickPregnancyMode = true">{{pregnancyModeName||'请选择妊娠方式'}}</div>
      </van-cell>
      <van-cell class="required" title-width="110px" title="胎儿数">
        <div @click="showPickFetusNum = true">{{fetusNumName||'请选择胎儿数'}}</div>
      </van-cell>
      <van-cell class="required" title-width="110px" title="NT">
        <input type="number" placeholder="请输入数值" class="limit-width" :disabled="isNotFinshNT" @input="nt=nt.replace(/\D/g,'')" v-model="nt"/>
        <van-checkbox style="float:right;" :value="isNotFinshNT" checked-color="#07c160" shape="square" @click="onCheckNotFinishNT">未做</van-checkbox>
      </van-cell>
      <van-cell class="required" title-width="110px" title="转诊原因">
        <div @click="showPickReasons = true">{{reasonsName||'请选择转诊原因'}}</div>
      </van-cell>
      <van-cell title-width="110px" title="协和医院ID号">
        <input type="number" placeholder="请输入协和ID号" class="limit-width" @input="xieheId=xieheId.replace(/\D/g,'')" v-model="xieheId"/>
        <span @click="toRegister" style="float: right; color: #333333;"><van-icon style="vertical-align: middle;margin-right: 2px;" color="#F9BE03" name="warning" />如何注册</span>
      </van-cell>
      <van-cell class="required" title-width="110px" title="孕妇初步意向">
        <div @click="showPickPreWomenIntention = true">{{preWomenIntentionName||'请选择孕妇初步意向'}}</div>
      </van-cell>
      <van-cell class="required" title-width="110px" title="特殊情况">
        <div @click="showPickSpecialCase=true">{{specialCaseName||'请选择特殊情况'}}</div>
      </van-cell>
    </van-cell-group>

    <div class="other">
      <p class="title">其他</p>
      <div class="image-list">
        <van-uploader
          accept="image"
          @afterread="imagesAfterRead"
          @delete="imagesDelete"
          :file-list="imagesList"
        />
      </div>
    </div>

    <button @click="submitApply()" class="button submit-button" :disabled="submitBtnInvalie">提交</button>
    <button @click="closePage()" class="button close-button">取消</button>

<!--    选择出生日期-->
    <van-popup :show="showPickBirthDate" position="bottom" @close="showPickBirthDate = false">
      <van-datetime-picker
        title="实际出生日期"
        type="date"
        :value="defaultBirth"
        :max-date="pickMaxDate"
        :min-date="pickMinBirthDate"
        @cancel="showPickBirthDate = false"
        @confirm="confirmBirthDate"
      />
    </van-popup>

<!--    选择末次月经日期-->
    <van-popup :show="showPickLastDate" position="bottom" @close="showPickLastDate = false">
      <van-datetime-picker
        type="date"
        title="末次月经日期"
        :max-date="pickMaxDate"
        :min-date="pickMinLastDate"
        @cancel="showPickLastDate = false"
        @confirm="confirmLastDate"
      />
    </van-popup>

<!--    选择妊娠方式-->
    <van-popup :show="showPickPregnancyMode" position="bottom" @close="showPickPregnancyMode = false">
      <van-picker
        :columns="pregnancyModeColumn"
        show-toolbar title="妊娠方式"
        @confirm="confirmPregnancyMode"
        @cancel="showPickPregnancyMode = false"
      />
    </van-popup>

    <!--    选择胎儿数-->
    <van-popup :show="showPickFetusNum" position="bottom" @close="showPickFetusNum = false">
      <van-picker
        :columns="fetusNumColumn"
        show-toolbar title="胎儿数"
        @confirm="confirmFetusNum"
        @cancel="showPickFetusNum = false"
      />
    </van-popup>

    <!--    选择转诊原因-->
    <van-popup :show="showPickReasons" position="bottom" @close="showPickReasons = false">
      <van-picker
        :columns="reasonsColumn"
        show-toolbar title="转诊原因"
        @confirm="confirmReasons"
        @cancel="showPickReasons = false"
      />
    </van-popup>

    <!--    选择孕妇初步意向-->
    <van-popup :show="showPickPreWomenIntention" position="bottom" @close="showPickPreWomenIntention = false">
      <van-picker
        :columns="preWomenIntentionColumn"
        show-toolbar title="孕妇初步意向"
        @confirm="confirmPreWomenIntention"
        @cancel="showPickPreWomenIntention = false"
      />
    </van-popup>

    <!--    选择特殊情况-->
    <van-popup :show="showPickSpecialCase" position="bottom" @close="showPickSpecialCase = false">
      <van-picker
        :columns="specialCaseColumn"
        show-toolbar title="特殊情况"
        @confirm="confirmSpecialCase"
        @cancel="showPickSpecialCase = false"
      />
    </van-popup>

    <van-toast id="van-toast" />
  </div>
</template>

<script>
  import { get,post,baseUrl } from "@/utils/request"
  import Toast from '../../../node_modules/@vant/weapp/dist/toast/toast'

  export default {
    computed:{
      // 出生日期展示项
      birthTime(){
        if(this.birth){
          let time = new Date(this.birth)
          return `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日`
        }else {
          return ''
        }
      },
      // 末次月经时间展示项
      lastMenstrualDate(){
        if(this.lastMenstrualTime){
          let time = new Date(this.lastMenstrualTime)
          return `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日`
        }else {
          return ''
        }
      },
      // 年龄
      pregAge(){
        if(this.birth){
          //出生时间 毫秒
          let birth = this.birth
          //当前时间 毫秒
          let nowTime = new Date().getTime()
          //一年毫秒数(365 * 86400000 = 31536000000)
          return Math.ceil((nowTime-birth)/31536000000);
        }else {
          return ''
        }
      },
      // 孕周
      gestationalAge(){
        if(this.lastMenstrualTime){
          //出生时间 毫秒
          let lastMenstrualTime = this.lastMenstrualTime
          //当前时间 毫秒
          let nowTime = new Date().getTime()
          //一周毫秒数(7 * 86400000 = 604800000)
          return Math.ceil((nowTime-lastMenstrualTime)/604800000);
        }else {
          return ''
        }
      },
      // BMI
      bmi(){
        if(this.weight && this.height){
          return Math.ceil(this.weight/this.height/this.height*10000)
        }else {
          return ''
        }
      },
      // nt
      /*nt(){
        if(this.isNotFinshNT){
          return -1
        }else {
          console.log(this.ntValue)
          return this.ntValue
        }
      },*/
      imgIds(){
        let str = ''
        this.imagesList.map(item=>{
          str = str+ item.id + ','
        })
        return str.slice(0,str.length-1)
      }
    },
    data () {
      return {
        idemToken:'',
        // 孕妇姓名
        pregName:'',
        // 手机号
        mobile:'',
        // 备用手机号
        mobileBak:'',
        showAnotherPhone:false,
        // 出生日期
        showPickBirthDate:false,
        birth: '',//时间戳时间
        defaultBirth: new Date('2000-01-01').getTime(),
        pickMinBirthDate: new Date('1900-01-01').getTime(),// 时间选择器最小值
        // 末次月经日期
        showPickLastDate:false,
        lastMenstrualTime: '',//传给接口的时间戳时间
        pickMinLastDate: new Date('2019-01-01').getTime(),// 时间选择器最小值
        pickMaxDate: new Date().getTime(),// 时间选择器最大值
        // 身高
        height:'',
        // 体重
        weight:'',
        // 妊娠方式
        showPickPregnancyMode:false,//是否展示选择器
        pregnancyMode:0,//上传数据时选项对应的编码
        pregnancyModeName:'',//上传数据时选项对应的名称
        pregnancyModeColumn:[],// 选择器中的选项
        pregnancyModeArray:[],// 包含code码的列表（用于查找选择器对应选项的code码）
        // 胎儿数
        showPickFetusNum:false,//是否展示选择器
        fetusNum:0,//上传数据时选项对应的编码
        fetusNumName:'',//上传数据时选项对应的名称
        fetusNumColumn:[],// 选择器中的选项
        fetusNumArray:[],// 包含code码的列表（用于查找选择器对应选项的code码）
        // NT输入框中的值
        // ntValue:'',
        nt:'',
        isNotFinshNT: false,
        // 转诊原因
        showPickReasons:false,//是否展示选择器
        reasons:0,//上传数据时选项对应的编码
        reasonsName:'',//上传数据时选项对应的名称
        reasonsColumn:[],// 选择器中的选项
        reasonsArray:[],// 包含code码的列表（用于查找选择器对应选项的code码）
        // 协和ID
        xieheId:'',
        // 孕妇初步意向
        showPickPreWomenIntention:false,//是否展示选择器
        preWomenIntention:0,//上传数据时选项对应的编码
        preWomenIntentionName:'',//上传数据时选项对应的名称
        preWomenIntentionColumn:[],// 选择器中的选项
        preWomenIntentionArray:[],// 包含code码的列表（用于查找选择器对应选项的code码）
        // 特殊情况
        showPickSpecialCase:false,//是否展示选择器
        specialCase:0,//上传数据时选项对应的编码
        specialCaseName:'',//上传数据时选项对应的名称
        specialCaseColumn:[],// 选择器中的选项
        specialCaseArray:[],// 包含code码的列表（用于查找选择器对应选项的code码）
        imagesList:[],
        submitBtnInvalie:false//控制提交按钮是否 不 可以点击
      }
    },
    methods: {
      // 检验手机号相关
      checkMobile(){
        if(this.mobile){
          if(/^1[3456789]\d{9}$/.test(this.mobile)){
            return true
          }else {
            return  false
          }
        }else {
          return true
        }
      },
      checkMobileBak(){
        if(this.mobileBak){
          if(/^1[3456789]\d{9}$/.test(this.mobileBak)){
            return true
          }else {
            return false
          }
        }else {
          return true
        }
      },
      // 图片上传相关
      imagesAfterRead(event){
        const { file } = event.mp.detail,that = this
        mpvue.uploadFile({
          url: `${baseUrl}/applet/pregnant/upload`, // 仅为示例，非真实的接口地址
          filePath: file.path,
          name: 'file',
          header: {
            token: mpvue.getStorageSync('token')
          },
          success(res) {
            // 上传完成需要更新 imagesList
            res = JSON.parse(res.data)
            if(res.code===0){
              let data = res.data[0]
              that.imagesList.push({ url: data.url, name:data.name,id:data.id })
            }else {
              Toast(res.msg)
            }
          }
        })
      },
      imagesDelete(event){
        this.imagesList.splice(event.mp.detail.index,1)
      },
      getIdemToken(){
        get(`/applet/pregnant/getIdemToken`).then(res=>{
          if(res.code===0){
            this.idemToken = res.idemToken
          }
        })
      },
      submitApply(){
        this.submitBtnInvalie = true
        if(this.pregName){
          if(this.checkMobile()){
            if(this.checkMobileBak()){
              if(this.birthTime){
                if(this.lastMenstrualDate){
                  if(this.height){
                    if(this.weight){
                      if(this.pregnancyMode){
                        if(this.fetusNum){
                          if(this.nt){
                            if(this.reasons){
                              if(this.preWomenIntention){
                                if(this.specialCase){
                                  Toast('上传中')
                                  const params = {}
                                  params.pregName = this.pregName
                                  params.mobile = this.mobile
                                  params.mobileBak = this.mobileBak
                                  params.birthTime = this.birthTime
                                  params.pregAge = this.pregAge
                                  params.lastMenstrualDate = this.lastMenstrualDate
                                  params.gestationalAge = this.gestationalAge
                                  params.height = this.height
                                  params.weight = this.weight
                                  params.bmi = this.bmi+''
                                  params.pregnancyMode = this.pregnancyMode
                                  params.fetusNum = this.fetusNum
                                  if(this.nt === '未做无需填写数值'){
                                    params.nt = '-1'
                                  }else {
                                    params.nt = this.nt
                                  }
                                  params.reasons = this.reasons
                                  params.xieheId = this.xieheId
                                  params.preWomenIntention = this.preWomenIntention
                                  params.specialCase = this.specialCase
                                  params.imgIds = this.imgIds
                                  post(`/applet/pregnant/add?idemToken=${this.idemToken}`,params).then(res=>{
                                    this.submitBtnInvalie = false
                                    if(res.code===0){
                                      this.pregName = ''
                                      this.mobile = ''
                                      this.showAnotherPhone = false
                                      this.mobileBak = ''
                                      this.birth = ''
                                      this.lastMenstrualTime = ''
                                      this.height = ''
                                      this.weight = ''
                                      this.pregnancyMode = 0
                                      this.pregnancyModeName = ''
                                      this.fetusNum = 0
                                      this.fetusNumName = ''
                                      this.isNotFinshNT = false
                                      this.nt = ''
                                      this.reasons = 0
                                      this.reasonsName = ''
                                      this.xieheId = ''
                                      this.preWomenIntention = 0
                                      this.preWomenIntentionName = ''
                                      this.specialCase = 0
                                      this.specialCaseName = ''
                                      this.imagesList = []
                                      this.$router.push('/pages/applyShift/finishShift/main')
                                    }else{
                                      Toast(res.msg)
                                    }
                                  }).catch(error=>{
                                    this.submitBtnInvalie = false
                                  })
                                }else {
                                  Toast('请选择特殊情况')
                                }
                              }else {
                                Toast('请选择孕妇初步意向')
                              }
                            }else {
                              Toast('请选择转诊原因')
                            }
                          }else {
                            Toast('请选择或填写NT')
                          }
                        }else {
                          Toast('请选择胎儿数')
                        }
                      }else {
                        Toast('请选择妊娠方式')
                      }
                    }else {
                      Toast('请输入体重')
                    }
                  }else {
                    Toast('请输入身高')
                  }
                }else {
                  Toast('请选择末次月经日期')
                }
              }else {
                Toast('请选择出生日期')
              }
            }else{
              Toast('请输入正确的备用手机号')
            }
          }else {
            Toast('请输入正确的手机号')
          }
        }else {
          Toast('请输入姓名')
        }
      },
      closePage(){
        this.$router.push('/pages/index/main')
      },
      toRegister(){
        this.$router.push('/pages/applyShift/howToRegister/main')
      },
      // 出生日期相关操作
      confirmBirthDate(event){
        this.birth = event.mp.detail
        this.showPickBirthDate = false
      },
      // 末次月经日期相关操作
      confirmLastDate(event){
        this.lastMenstrualTime = event.mp.detail
        this.showPickLastDate = false
      },
      // 勾选未做nt框
      onCheckNotFinishNT(){
        this.isNotFinshNT=!this.isNotFinshNT
        if(this.isNotFinshNT){
          // this.ntValue
          this.nt = '未做无需填写数值'
        }else {
          this.nt = ''
        }
      },
      // 获取选择器选项列表
      getSelectList(){
        get(`/applet/pregnant/getTypeList`).then(res=>{
          if(res.code===0){
            this.pregnancyModeArray = res.data.pregnancyMode
            this.fetusNumArray = res.data.fetusNum
            this.reasonsArray = res.data.reasons
            this.preWomenIntentionArray = res.data.preWomenIntention
            this.specialCaseArray = res.data.specialCase
            let pregnancyModeColumn=[],fetusNumColumn=[],reasonsColumn=[],preWomenIntentionColumn=[],specialCaseColumn=[]
            this.pregnancyModeArray.map(item=>{
              pregnancyModeColumn.push(item.value)
            })
            this.fetusNumArray.map(item=>{
              fetusNumColumn.push(item.value)
            })
            this.reasonsArray.map(item=>{
              reasonsColumn.push(item.value)
            })
            this.preWomenIntentionArray.map(item=>{
              preWomenIntentionColumn.push(item.value)
            })
            this.specialCaseArray.map(item=>{
              specialCaseColumn.push(item.value)
            })
            this.pregnancyModeColumn = pregnancyModeColumn
            this.fetusNumColumn = fetusNumColumn
            this.reasonsColumn = reasonsColumn
            this.preWomenIntentionColumn = preWomenIntentionColumn
            this.specialCaseColumn = specialCaseColumn
          }else {
            Toast(res.msg)
          }
        })
      },
      // 妊娠方式选择器相关操作
      confirmPregnancyMode(event){
        const { value } = event.target
        this.pregnancyModeName = value
        this.pregnancyMode = this.pregnancyModeArray.filter(item=>{
          return item.value === value
        })[0].code
        this.showPickPregnancyMode = false
      },
      /*cancelPregnancyMode(){
        this.pregnancyModeName = ''
        this.pregnancyMode = 0
        this.showPickPregnancyMode = false
      },*/
      // 胎儿数选择器相关操作
      confirmFetusNum(event){
        const { value } = event.target
        this.fetusNumName = value
        this.fetusNum = this.fetusNumArray.filter(item=>{
          return item.value === value
        })[0].code
        this.showPickFetusNum = false
      },
      /*cancelFetusNum(){
        this.fetusNumName = ''
        this.fetusNum = 0
        this.showPickFetusNum = false
      },*/
      // 转诊原因选择器相关操作
      confirmReasons(event){
        const { value } = event.target
        this.reasonsName = value
        this.reasons = this.reasonsArray.filter(item=>{
          return item.value === value
        })[0].code
        this.showPickReasons = false
      },
      /*cancelReasons(){
        this.reasonsName = ''
        this.reasons = 0
        this.showPickReasons = false
      },*/
      // 孕妇初步意向选择器相关操作
      confirmPreWomenIntention(event){
        const { value } = event.target
        this.preWomenIntentionName = value
        this.preWomenIntention = this.preWomenIntentionArray.filter(item=>{
          return item.value === value
        })[0].code
        this.showPickPreWomenIntention = false
      },
      /*cancelPreWomenIntention(){
        this.preWomenIntentionName = ''
        this.preWomenIntention = 0
        this.showPickPreWomenIntention = false
      },*/
      // 妊娠方式选择器相关操作
      confirmSpecialCase(event){
        const { value } = event.target
        this.specialCaseName = value
        this.specialCase = this.specialCaseArray.filter(item=>{
          return item.value === value
        })[0].code
        this.showPickSpecialCase = false
      },
      /*cancelSpecialCase(){
        this.specialCaseName = ''
        this.specialCase = 0
        this.showPickSpecialCase = false
      },*/
    },
    onShow () {
      if(!mpvue.getStorageSync('token')){
        this.$router.push('/pages/login/main')
      }
      this.getIdemToken()
    },
    mounted(){
      this.getSelectList()
    }
  }
</script>

<style scoped lang='scss'>
  .content {
    .group-list {
      .required >>> .van-cell__title::before {
        content: '*';
        color: #FF0000;
        margin-right: 1px;
      }
      >>> .van-cell__value {
        text-align: left;
      }
      .limit-width {
        width: 140px;
        float: left;
      }
    }

    .other {
      padding: 10px 15px;
      .title {
        font-size: 14px;
        color: #333333;
      }
      .image-list {
        >>> .van-uploader__preview {
          margin:  0 8px 0 0;
          .van-uploader__preview-delete {
            right: -4px;
            top: 5px;
          }
        }
        >>> .van-uploader__preview:nth-child(4n) {
          margin-right: 0;
        }
        >>> .van-uploader__preview-image,>>> .van-uploader__upload {
          margin: 10px 0 0 0;
          width: 80px !important;
          height: 80px !important;
        }
      }
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
