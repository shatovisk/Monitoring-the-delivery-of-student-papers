import { observer } from "mobx-react-lite";
import React, {FC, useContext, useState} from "react";
import { Context } from "../index";
import Store from "../store/store";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import {NavLink, useLocation, useNavigate } from "react-router-dom"
import {Form, Container} from 'react-bootstrap'
import { STUDENT_LOGIN_ROUTE, STUDENT_PAGE_ROUTE, STUDENT_REGISTRATION_ROUTE } from "../utils/consts";
import Card from "react-bootstrap/Card"



const LoginCard = () => {
    const [studentCardNumber, setStudentCardNumber] = useState(''); //считывает значения из инпута
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [group, setGroup] = useState('')
    const [nameStudent, setNameStudent] = useState('')
    const {store} = useContext(Context) // позволяет читать контекст и подписываться на его изменения

    const location = useLocation()
    const isLogin = location.pathname === STUDENT_LOGIN_ROUTE

    const history = useNavigate ()

    const click = async () => {
        // блок try-catch пока что не работает, но посмотрим, что будет дальше...
        try {
            let data;
            if (isLogin){
                data = await store.login(studentCardNumber, password)
            } else {
                data = await store.registration(studentCardNumber, email, password, group, nameStudent)
            }
            if (data !== undefined){
                store.setUser(store)
                store.setAuth(true)
                store.setGroup(group)

                history(STUDENT_PAGE_ROUTE)
                window.location.reload() // перезагрузка страницы, чтобы подгружались файлы 
               
            }
        } catch (error) {
            alert(error.response.data.message)
        }
    }


    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control 
                        className="mt-2"
                        onChange={e => setStudentCardNumber(e.target.value)}
                        value={studentCardNumber}
                        type="text"
                        placeholder="Номер студ. билета"
                    />
                    {!isLogin ? 
                        <Form.Control  
                        className="mt-2"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="text"
                        placeholder="E-mail"
                        />
                    :
                        null
                        }
                    {!isLogin ? 
                        <Form.Control  
                        className="mt-2"
                        onChange={e => setGroup(e.target.value)}
                        value={group}
                        type="text"
                        placeholder="Название группы"
                        />
                    :
                        null
                        }
                    {!isLogin ? 
                        <Form.Control  
                        className="mt-2"
                        onChange={e => setNameStudent(e.target.value)}
                        value={nameStudent}
                        type="text"
                        placeholder="ФИО"
                        />
                    :
                        null
                        }
                    <Form.Control  
                        className="mt-2"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        placeholder="Пароль"
                    />
                    <Row >
                        <Col className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                Нет аккаунта? <NavLink style={{color: "blue"}} to={STUDENT_REGISTRATION_ROUTE}>Регистрация</NavLink>
                            </div>
                            :
                            <div>
                                Есть аккаунт? <NavLink style={{color: "blue"}} to={STUDENT_LOGIN_ROUTE}>Войти</NavLink>
                            </div>
                        }
                        {isLogin ? 
                            <Button variant={"outline-success"} onClick={click}>Вход</Button>
                            :
                            <Button variant={"outline-success"} onClick={click}>Регистрация</Button>
                        }
                        </Col>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
};

export default observer(LoginCard);