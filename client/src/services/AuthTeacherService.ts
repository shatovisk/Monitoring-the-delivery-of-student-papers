import $api from "../http";
import {AxiosResponse} from 'axios';
import { AuthResponseTeacher } from "../models/response/AuthResponseTeacher";

export default class AuthTeacherService {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponseTeacher>> {
        return $api.post<AuthResponseTeacher>('/teacher/login', {email, password})
    }

    static async registration(email: string, password: string, name: string): Promise<AxiosResponse<AuthResponseTeacher>> {
        return $api.post<AuthResponseTeacher>('/teacher/registration', {email, password, name})
    }

    static async logout(): Promise<void> {
        return $api.post('/teacher/logout')
    }
}