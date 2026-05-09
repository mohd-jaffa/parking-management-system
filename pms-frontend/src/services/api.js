import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5002',
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('[Axios] Request started:', config.method?.toUpperCase(), config.url)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('[Axios] Request error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log('[Axios] Response success:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('[Axios] Response error:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api
