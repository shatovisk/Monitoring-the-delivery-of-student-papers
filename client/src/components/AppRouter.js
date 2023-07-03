import React , {useContext, useState, useEffect}from "react";
import {Routes, Route, Navigate} from 'react-router-dom'
import { authStudentRoutes, authTeacherRoutes, publicRoutes } from "../routes";
import { MAIN_PAGE, STUDENT_LOGIN_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
    const {store, storeTeacher} = useContext(Context)

    return (
        <Routes>
            {store.isAuth && authStudentRoutes.map(({path, Component}) => 
                <Route key={path} path={path} element={<Component/>} exact/> //exact(путь должен точно совпадать)
            )}
            {storeTeacher.isAuth && authTeacherRoutes.map(({path, Component}) => 
                <Route key={path} path={path} element={<Component/>} exact/> //exact(путь должен точно совпадать)
            )}
            {publicRoutes.map(({path, Component}) => 
                <Route key={path} path={path} element={<Component/>} exact/> //exact(путь должен точно совпадать)
            )}
            <Route path="/" element={<Navigate replace to={STUDENT_LOGIN_ROUTE}/>}/>
        </Routes>
        
    );
});

export default AppRouter;