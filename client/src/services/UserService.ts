import $api from "../http";
import {AxiosResponse} from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";
import { IUser } from "../models/IUser";
import { IFile } from "../models/IFile";
import { ILesson } from "../models/ILesson";
import { IGroup } from "../models/IGroup";
import { ITeacherIdGroupId } from "../models/ITeacherIdGroupId";
import { IGroupTeacher } from "../models/IGroupTeacher";
import { ITeacher } from "../models/ITeacher";

export default class UserService {
    static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/student/users')
    }

    static uploadFile(formData: FormData): Promise<AxiosResponse<IFile>> {
        return $api.post<IFile>('/student/page/upload', formData,{
            headers: {
              'Content-Type': 'multipart/form-data'
            }})
    }

    static fetchFile(UserId: number, page: number, limit= 5): Promise<AxiosResponse<IFile[]>>{
        return $api.get<IFile[]>('/student/page/upload', {params: {UserId, limit, page}})
    }

    static fetchLesson(studentGroupId: number): Promise<AxiosResponse<ILesson>> {
        return $api.get<ILesson>('/student/lesson', {params: {studentGroupId}})
    }

    static fetchGroup(studentGroupId: number): Promise<AxiosResponse<IGroup[]>> {
        return $api.get<IGroup[]>('/student/group', {params: {studentGroupId}})
    }

    static delFile(UserId: string, studentLessonId: string): Promise<AxiosResponse<IFile>>{
        return $api.delete<IFile>('/student/page/upload', {params: {UserId, studentLessonId}})
    }

    static fetchTeacherGroupId(id: number): Promise<AxiosResponse<ITeacherIdGroupId[]>> {
        return $api.get<ITeacherIdGroupId[]>('/teacher/groupId', {params: {id}})
    }

    static fetchTeacherGroup(groupId: number): Promise<AxiosResponse<IGroupTeacher>> {
        return $api.get<IGroupTeacher>('/teacher/group', {params: {groupId}})
    }

    static fetchStudent(studentGroupId: number): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/teacher/students', {params: {studentGroupId}})
    }

    static addLesson(studentGroupId: number, teacherId: number, nameLesson: string): Promise<AxiosResponse<ILesson>> {
        return $api.post<ILesson>('/teacher/lesson', {studentGroupId, teacherId, nameLesson})
    }

    static delLesson(studentGroupId: number, nameLesson: string): Promise<AxiosResponse<ILesson>> {
        return $api.delete<ILesson>('/teacher/lesson', {params: {studentGroupId, nameLesson}})
    }

    static updateLesson(studentGroupId: number, teacherId: number, nameLesson: string): Promise<AxiosResponse<ILesson>>{
        return $api.put<ILesson>('/teacher/lesson', {studentGroupId, teacherId, nameLesson})
    }

    static getLesson (studentGroupId: number): Promise<AxiosResponse<ILesson[]>>{
        return $api.get<ILesson[]>('/teacher/lesson', {params: {studentGroupId}})
    }

    static addGroup(nameGroup: string): Promise<AxiosResponse<IGroupTeacher>> {
        return $api.post<IGroupTeacher>('/teacher/group', {nameGroup})
    }

    static delGroup(nameGroup: string): Promise<AxiosResponse<IGroupTeacher>>{
        return $api.delete<IGroupTeacher>('/teacher/group', {params: {nameGroup}})
    }

    static getAllGroups(): Promise<AxiosResponse<IGroupTeacher[]>>{
        return $api.get<IGroupTeacher[]>('/teacher/groups')
    }

    static getTeachers(): Promise<AxiosResponse<ITeacher[]>>{
        return $api.get<ITeacher[]>('/teacher/teachers')
    }

    static delTeacher(teacherId: number): Promise<AxiosResponse<ITeacher>>{
        return $api.delete<ITeacher>('/teacher/teachers', {params: {teacherId}})
    }

}