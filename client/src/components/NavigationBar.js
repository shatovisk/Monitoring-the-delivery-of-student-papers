import React, {useContext, useState} from 'react';
import { Context } from '../index';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Button } from 'react-bootstrap';
import {NavLink} from "react-router-dom"
import { STUDENT_LOGIN_ROUTE, STUDENT_PAGE_ROUTE, TEACHER_LOGIN_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { Navigate, Route, useNavigate, useLocation } from 'react-router-dom';

//отслеживает измение компонентов, в режиме реального времени(logout)
const NavigationBar = observer(() => {
    const {store, storeTeacher} = useContext(Context)
    const history = useNavigate()

    const location = useLocation()
    const isStudentPage = location.pathname === STUDENT_PAGE_ROUTE


    function exit(){
      if (isStudentPage){
        store.logout()
      } else {
        storeTeacher.logout()
        storeTeacher.setAuth(false)
      }
    }

    // function StudentPage() {
    //   setIsStudentPage(true)
    // }

    // function TeacherPage() {
    //   setIsStudentPage(false)
    // }


    return (
        <Navbar bg="primary" variant="dark">
          <Container>
            <NavLink style={{color: "white"}} to={STUDENT_LOGIN_ROUTE}>НГТУ им. Р.Е. Алексеева</NavLink>
            { store.isAuth || storeTeacher.isAuth ?
              <Nav className="ml-auto">
                <NavLink style={{color: "white"}} to={STUDENT_LOGIN_ROUTE}> <Button className='ms-2' variant={'outline-light'} onClick={exit}>Выход</Button> </NavLink>
              </Nav>
              :
              <Nav className="ml-auto">
                <NavLink style={{color: "white"}} to={STUDENT_LOGIN_ROUTE}> <Button className='ms-2' variant={'outline-light'} >Студент</Button> </NavLink>
                <NavLink style={{color: "white"}} to={TEACHER_LOGIN_ROUTE}> <Button className='ms-2' variant={'outline-light'} >Преподаватель</Button> </NavLink>
                {/* <Button className='ms-2' variant={'outline-light'} onClick={redirectToTeacher}>Преподаватель</Button> */}
              </Nav>
            }
          </Container>
        </Navbar>
    )
});

export default NavigationBar;