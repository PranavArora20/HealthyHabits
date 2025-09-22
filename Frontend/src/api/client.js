import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

api.interceptors.request.use((config)=>{
  const token = localStorage.getItem('accessToken')
  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pending = []

api.interceptors.response.use(
  (res)=>res,
  async (error)=>{
    const original = error.config
    if(error.response?.status === 403 && !original._retry){
      original._retry = true
      if(!isRefreshing){
        isRefreshing = true
        try{
          const refreshToken = localStorage.getItem('refreshToken')
          const { data } = await axios.post((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/auth/refresh', { refreshToken })
          localStorage.setItem('accessToken', data.accessToken)
          pending.forEach((cb)=>cb(data.accessToken))
          pending = []
        }catch(e){
          localStorage.clear()
          window.location.href = '/login'
          return Promise.reject(e)
        }finally{
          isRefreshing = false
        }
      }
      return new Promise((resolve)=>{
        pending.push((token)=>{
          original.headers.Authorization = `Bearer ${token}`
          resolve(api(original))
        })
      })
    }
    return Promise.reject(error)
  }
)

export default api
