let baseUrl = 'https://xiehe.datayan.cn:9443'

function createFly() {
  if (mpvuePlatform === 'wx') {
    const Fly = require('flyio/dist/npm/wx')
    let fly = new Fly()
    //设置超时
    fly.config.timeout = 30000;
    //设置请求基地址
    fly.config.baseURL = baseUrl
    // 添加请求拦截器
    fly.interceptors.request.use((request) => {
      // 在发送请求之前做些什么
      let token = mpvue.getStorageSync('token')
      if (token) {
        request.headers['token'] = token
      }
      return request
    }, function(error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    })
    // 添加响应拦截器
    fly.interceptors.response.use((res) => {
      // 对响应数据做些事
      res = res.data
      if(res.msg==='token无效'&&res.code===1){
        mpvue.clearStorageSync()
        mpvue.navigateTo({
          url: '/pages/login/main'
        })
      }
      return res
    }, (error) => {
      return Promise.reject(error)
    })
    return fly
  } else {
    return null
  }
}

export {
  baseUrl
}


export function get(url, params = {}) {
  const fly = createFly()
  if (fly) {
    return new Promise((resolve, reject) => {
      fly.get(url, params).then(response => {
        resolve(response)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }
}

export function post(url, params = {}) {
  const fly = createFly()
  if (fly) {
    return new Promise((resolve, reject) => {
      fly.post(url, params).then(response => {
        resolve(response)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }
}
