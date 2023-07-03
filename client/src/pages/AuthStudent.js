import React, {useContext} from "react";
import {Container, Form} from 'react-bootstrap'
import Card from "react-bootstrap/Card"
import LoginCard from "../components/loginCard";
import { Context } from '../index';

const AuthStudent = () => {
    const {store} = useContext(Context)
    console.log("ISSTUDENT", store.isStudent);

    return (
        <LoginCard/> 
    ); 
};

export default AuthStudent;