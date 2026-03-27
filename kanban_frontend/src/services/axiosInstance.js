import axios from "axios"

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/",
})

// Attach access token to every request
axiosInstance.interceptors.request.use((config) => {
  const access = localStorage.getItem("access")
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// Auto refresh when access token expires
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refresh = localStorage.getItem("refresh")

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/new_access_token/",
          { refresh },
        )

        const access_token=response.data.access_token

        localStorage.setItem("access", access_token)

        originalRequest.headers.Authorization = `Bearer ${access_token}`

        return axiosInstance(originalRequest)
      } catch (err) {
        localStorage.clear()
        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance