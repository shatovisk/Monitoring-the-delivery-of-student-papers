import { ITeacher } from "../ITeacher";

export interface AuthResponseTeacher{
    accessToken: string;
    refreshToken: string;
    teacher: ITeacher;
}