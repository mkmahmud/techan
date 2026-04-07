import axios from 'axios'

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api',
    withCredentials: true,
    timeout: 15000,
})

api.interceptors.response.use(
    response => response,
    error => {
        const status = error?.response?.status as number | undefined
        const message =
            (error?.response?.data?.message as string | undefined) ??
            (error?.message as string | undefined) ??
            'Unexpected error occurred'

        return Promise.reject({
            status,
            message,
            data: error?.response?.data,
        })
    },
)
