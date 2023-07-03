import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";
import { useNavigate } from "react-router-dom";
import { STUDENT_PAGE_ROUTE } from "../utils/consts";
import { ILesson } from "../models/ILesson";
import { IFile } from "../models/IFile";
import { IGroup } from "../models/IGroup";
import { ITeacher } from "../models/ITeacher";

export default class Store {
    user = {} as IUser
    isAuth = false;
    isLoading = false;
    lesson = {} as ILesson;
    file = {} as IFile;
    group = {} as IGroup;
    isStudent = true;


    // teacher = {} as ITeacher
    // isAuthTeacher = false;
    // lessonTeacher = {} as ILesson;
    // fileTeacher = {} as IFile;




    constructor() {
        this.user = {} as IUser
        this.isAuth = false;
        this.isLoading = false;
        this.lesson = {} as ILesson;
        this.file = {} as IFile;
        this.group = {} as IGroup;
        this.isStudent = true;
        makeAutoObservable(this) // Следит за изменениями переменных и при изменении компоненты будут перерендываться
    }

    setIsStudent(isStudent: boolean){
        this.isStudent = isStudent
    }

    setGroup(group: IGroup){
        this.group = group
    }

    setAuth(bool: boolean){
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean){
        this.isLoading = bool;
    }

    setLesson(lesson: ILesson){
        this.lesson = lesson;
    }
    

    get groups(){
        return this.group
    }

    get Auth() {
        return this.isAuth
    }

    get users() {
        return this.user
    }

    get lessons() {
        return this.lesson
    }

    async login(studentCardNumber: string, password: string) {
        try {
            const response = await AuthService.login(studentCardNumber, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            console.log("DATAUSER", response.data.user);
            return response //добавлено, чтобы был переход между страницами, если будут ошибки, можно удалять. искать в файле loginCard
        } catch (error: any) {
            console.log(error.response?.data?.message);
            alert(error.response.data.message)
        }
    }

    async registration(studentCardNumber: string, email: string, password: string, studentGroup: string, studentName: string) {
        try {
            
            const response = await AuthService.registration(studentCardNumber, email, password, studentGroup, studentName);
            
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
            return response //добавлено, чтобы был переход между страницами, если будут ошибки, можно удалять. искать в файле loginCard
        } catch (error: any) {
            console.log(error.response?.data?.message);
            alert(error.response.data.message)
            
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (error: any) {
            console.log(error.response?.data?.message);
            
        }
    }

    async cheackAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/student/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error: any) {
            console.log(error.response?.data?.message);
            
        } finally{
            this.setLoading(false);
        }
    }
}