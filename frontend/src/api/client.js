import axios from 'axios'

axios.defaults.withCredentials = true

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
    baseURL,
    withCredentials: true,
})

//refresh handling queue to avoid multiple simultaneous refresh requests
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if(error) prom.reject(error)
            else prom.resolve(token)
    })
    failedQueue = []
}

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config
        if (!originalRequest) return Promise.reject(error)
        
        const status = error.response?.status
        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject })
                }).then(() => api(originalRequest)).catch(err => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const refreshRes = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
                const newToken = refreshRes?.data?.token
                if (newToken) {
                    // set default Authorization for future requests
                    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
                    // also set header for the original request before retry
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                }
                isRefreshing = false
                processQueue(null, newToken)
                return api(originalRequest)
            } catch (err) {
                isRefreshing = false
                processQueue(err, null)
                return Promise.reject(err)
            }
        }

        return Promise.reject(error)
    }
)

export default api