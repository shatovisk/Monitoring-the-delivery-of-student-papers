import Admin from "./pages/Admin"
import AuthStudent from "./pages/AuthStudent"
import AuthTeacher from "./pages/AuthTeacher"
import Student from "./pages/Student"
import Teacher from "./pages/Teacher"
import { ADMIN_ROUTE, STUDENT_LOGIN_ROUTE, STUDENT_PAGE_ROUTE, STUDENT_REGISTRATION_ROUTE, TEACHER_LOGIN_ROUTE, TEACHER_PAGE_ROUTE, TEACHER_REGISTRATION_ROUTE } from "./utils/consts"

export const authStudentRoutes = [

    {
        path: STUDENT_PAGE_ROUTE,
        Component: Student
    },
   
]

export const authTeacherRoutes = [
    {
        path: TEACHER_PAGE_ROUTE,
        Component: Teacher
    },
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
]

export const publicRoutes = [
    {
        path: STUDENT_LOGIN_ROUTE,
        Component: AuthStudent
    },
    {
        path: STUDENT_REGISTRATION_ROUTE,
        Component: AuthStudent
    },
    {
        path: TEACHER_LOGIN_ROUTE,
        Component: AuthTeacher
    },
    {
        path: TEACHER_REGISTRATION_ROUTE,
        Component: AuthTeacher
    }
]