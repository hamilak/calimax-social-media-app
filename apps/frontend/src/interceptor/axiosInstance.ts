import axios from 'axios'
import Cookies from 'js-cookie'

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('accessToken')
        console.log(token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response } = error
        const originalRequest = error.config

        if (response && response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            const refreshToken = Cookies.get('refreshToken')
            console.log('refresh', refreshToken)

            if (refreshToken) {
                try {
                    const { data } = await axios.post(`/api/auth/refresh-token`)

                    Cookies.set('accessToken', data, { path: '/' })
                    axios.defaults.headers.common['Authorization'] =
                        `Bearer ${data.accessToken}`
                    originalRequest.headers['Authorization'] =
                        `Bearer ${data.accessToken}`

                    return axiosInstance(originalRequest)
                } catch (refreshError) {
                    console.log(refreshError)
                    window.location.href = '/'
                    return Promise.reject(refreshError)
                }
            } else {
                // window.location.href = '/login';
                return Promise.reject(new Error('No refresh token found'))
            }
        }

        return Promise.reject(error)
    }
)

export default axiosInstance
