import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
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
                await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true })
                isRefreshing = false
                processQueue(null, true)
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