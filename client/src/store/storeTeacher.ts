import axios from "axios";
import { IFile } from "../models/IFile";
import { ILesson } from "../models/ILesson";
import { ITeacher } from "../models/ITeacher";
import AuthTeacherService from "../services/AuthTeacherService";
import { AuthResponseTeacher } from "../models/response/AuthResponseTeacher";
import { API_URL } from "../http";
import { makeAutoObservable } from "mobx";
import { IGroupTeacher } from "../models/IGroupTeacher";



export default class StoreTeacher {
    teacher = {} as ITeacher
    id = 0;
    isAuth = false;
    isLoading = false;
    lesson = {} as ILesson;
    file = {} as IFile;
    group = {} as IGroupTeacher;

    constructor() {
        this.teacher = {} as ITeacher;
        this.id = 0;
        this.isAuth = false;
        this.isLoading = false;
        this.lesson = {} as ILesson;
        this.file = {} as IFile;
        this.group = {} as IGroupTeacher;

        makeAutoObservable(this)
    }

    setId (id: number){
        this.id = id
    }

    setGroup(group: IGroupTeacher){
        this.group = group
    }

    setTeacher(teacher: ITeacher){
        this.teacher = teacher
    }

    setLoading(bool: boolean){
        this.isLoading = bool;
    }

    setLesson(lesson: ILesson){
        this.lesson = lesson;
    }

    setAuth(bool: boolean){
        
        this.isAuth = bool;
    }

    get ids() {
        return this.id
    }

    get groups() {
        return this.group
    }

    get Auth() {
        return this.isAuth
    }

    get lessons() {
        return this.lesson
    }

    get teachers() {
        return this.teacher
    }


    async login (email: string, password: string) {
        try {
            const response = await AuthTeacherService.login(email, password);
            localStorage.setItem('tokenTeacher', response.data.accessToken);
            this.setAuth(true);
            this.setTeacher(response.data.teacher);
            console.log("DATAUSER", response.data.teacher);
            
            return response //добавлено, чтобы был переход между страницами, если будут ошибки, можно удалять. искать в файле loginCard
        } catch (error: any) {
            console.log(error.response?.data?.message);
            alert(error.response.data.message)
        }
    }

    async registration(email: string, password: string, name: string) {
        try {
            const response = await AuthTeacherService.registration(email, password, name)

            localStorage.setItem('tokenTeacher', response.data.accessToken);
            this.setAuth(true);
            this.setTeacher(response.data.teacher);
            return response //добавлено, чтобы был переход между страницами, если будут ошибки, можно удалять. искать в файле loginCard

        } catch (error: any) {
            console.log(error.response?.data?.message);
            alert(error.response.data.message)
        }
    }


    async logout() {
        try {
            const response = await AuthTeacherService.logout();
            localStorage.removeItem('tokenTeacher');
            this.setAuth(false);
            this.setTeacher({} as ITeacher);
        } catch (error: any) {
            console.log(error.response?.data?.message);
            
        }
    }

    async cheackAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponseTeacher>(`${API_URL}/teacher/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('tokenTeacher', response.data.accessToken);
            this.setAuth(true);
            this.setTeacher(response.data.teacher);            
        } catch (error: any) {
            console.log(error.response?.data?.message);
            
        } finally{
            this.setLoading(false);
        }
    }
}