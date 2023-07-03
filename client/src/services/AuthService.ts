import $api from "../http";
import {AxiosResponse} from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";

export default class AuthService {
    static async login(studentCardNumber: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/student/login', {studentCardNumber, password})
    }

    static async registration(studentCardNumber: string, email: string, password: string, studentGroup: string, nameStudent: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post<AuthResponse>('/student/registration', {studentCardNumber, email, password, studentGroup, nameStudent})
    }

    static async logout(): Promise<void> {
        return $api.post('/student/logout')
    }
}