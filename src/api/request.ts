import axios from 'axios'
import { message } from 'ant-design-vue'
// import Cookies from 'js-cookie'

// 创建axios实例
const service = axios.create({
  baseURL: '/', // api的base_url
  timeout: 360000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 可以在这里添加请求头，例如：'Authorization'
    // console.log(Cookies.get('userInfo'))
    // if (Cookies.get('userInfo')) {
    //   const data = JSON.parse(Cookies.get('userInfo') as any)
    //   config.headers['Authorization'] = `Bearer ${data.token}`
    // }
    // if (store.getters.token) {
    // config.headers['Authorization'] = `Bearer ${store.getters.token}`
    // }
    return config
  },
  (error) => {
    // 请求错误处理
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: any) => {
    // 可以在这里对响应数据进行处理，例如：对返回的状态码进行判断
    const res = response
    // console.log(res)
    if (res.status !== 200) {
      message.error(res.message)
    }
    //   // 50008: 非法用户; 50012: 其他客户端; 50014: 令牌超时
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确认登出', {
    //       confirmButtonText: '重新登录',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload();
    //       });
    //     });
    //   }
    //   return Promise.reject('error');
    // } else {
    //   return res;
    // }
    return response.data
  },
  (error) => {
    console.log('err' + error) // for debug
    message.error(error.response.data.detail)
    return Promise.reject(error)
  }
)

export default service
