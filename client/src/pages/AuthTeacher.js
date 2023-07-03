import LoginCardTeacher from "../components/loginCardTeacher";
import { Context } from '../index';
import React, {useContext} from "react";



const AuthTeacher = () => {
    const {store} = useContext(Context)

    // console.log("ISSTUDENT", store.isStudent);

    return (
        <LoginCardTeacher/>
    ); 
};

export default AuthTeacher;