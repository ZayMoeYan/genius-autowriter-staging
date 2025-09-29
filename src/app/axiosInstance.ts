import axios from "axios";
import {cookies} from "next/headers";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

axiosInstance.interceptors.request.use(
    async (config) => {
        console.log('Axios Interceptor is working.');
        const cookieStore = await cookies();
        const token = cookieStore.get('access-token');
        config.headers['Content-Type'] = 'application/json';
        if(token) {
            config.headers['Authorization'] = `Bearer ${token.value}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
)

export default axiosInstance;