import { Form, Container } from "react-bootstrap"
import { ADMIN_ROUTE, TEACHER_LOGIN_ROUTE, TEACHER_PAGE_ROUTE, TEACHER_REGISTRATION_ROUTE } from "../utils/consts"
import React, {useContext, useState} from "react";
import { Context } from "../index";
import { useLocation, NavLink, useNavigate  } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import { observer } from "mobx-react-lite";
import Card from "react-bootstrap/Card"



const LoginCardTeacher = () => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const {storeTeacher} = useContext(Context)

    const location = useLocation()
    const isLogin = location.pathname === TEACHER_LOGIN_ROUTE

    const history = useNavigate()

    const click = async () => {
        // блок try-catch пока что не работает, но посмотрим, что будет дальше...
        try {
            let data;
            if (isLogin){
                data = await storeTeacher.login(email, password)
            } else {
                data = await storeTeacher.registration(email, password, name)
            }
            if (data !== undefined){
                console.log("DATATEACHER", data);
                storeTeacher.setTeacher(storeTeacher)
                storeTeacher.setAuth(true)
                storeTeacher.setId(data.data.teacher.id)
                console.log("STORETEACHER", storeTeacher);
                if (data.data.teacher.role == "ADMIN"){
                    history(ADMIN_ROUTE)
                } else {
                    history(TEACHER_PAGE_ROUTE)
                }
                
                // window.location.reload() // перезагрузка страницы, чтобы подгружались файлы 
                
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
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder="E-mail"
                />

                {!isLogin ? 
                    <Form.Control  
                    className="mt-2"
                    onChange={e => setName(e.target.value)}
                    value={name}
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
                            Нет аккаунта? <NavLink style={{color: "blue"}} to={TEACHER_REGISTRATION_ROUTE}>Регистрация</NavLink>
                        </div>
                        :
                        <div>
                            Есть аккаунт? <NavLink style={{color: "blue"}} to={TEACHER_LOGIN_ROUTE}>Войти</NavLink>
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

    )
}

export default observer(LoginCardTeacher);