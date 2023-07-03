import axios from "axios";
import { config } from "process";
import { AuthResponse } from "../models/response/AuthResponse";
import { AuthResponseTeacher } from "../models/response/AuthResponseTeacher";

export const API_URL = 'http://localhost:5000/api'

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})


$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config;
})

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true; 
        try {
            const responseUser = await axios.get<AuthResponse>(`${API_URL}/student/refresh`, {withCredentials: true}); 
            const responseTeacher  = await axios.get<AuthResponseTeacher>(`${API_URL}/teacher/refresh`, {withCredentials: true})
            localStorage.setItem('token', responseUser.data.accessToken);
            localStorage.setItem('tokenTeacher', responseTeacher.data.accessToken);

            return $api.request(originalRequest);
        } catch (error) {
            console.log("Пользователь не авторизован");
            
        }
    }
    throw error;
})

export default $api;