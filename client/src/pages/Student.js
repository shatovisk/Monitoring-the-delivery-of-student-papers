import React, {FC, useContext, useEffect, useState} from 'react';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, useParams } from 'react-router-dom';
import UserService from '../services/UserService';
import {Button, Card, Col, Container, Image, Row} from "react-bootstrap";
import Table1 from '../components/TableStudent';


const Student = () => {
    const {store} = useContext(Context)
    const [users, setUsers] = useState([])
    const [nameFile, setNameFile]= useState([])
    const [nameLesson, setNameLesson] = useState([])
    const [tapOnButton, setTapOnButton] = useState(false) // скрывает выпадающий список работ
    const [group, setGroup] = useState("")  
    const [isFunctionCalled, setIsFunctionCalled] = useState(false)
    const UserId = store.user.id;
    const studentGroupId  = store.user.studentGroupId || 0
    // useEffect(() => {
    //     UserService.fetchFile(UserId).then(data => setNameFile(data))
    // }, [])



    if (!isFunctionCalled) {
        getGroup()
        setIsFunctionCalled(true)
    }

    const studentProfile = [
        {id: 1, title: 'E-mail', description: store.user.email},
        {id: 2, title: "Номер студенческого билета", description: store.user.studentCardNumber},
        {id: 3, title: "Группа", description: group},
        {id: 4, title: "Имя", description: store.user.nameStudent}]
    
    
    

    async function getUsers(){
        try {
          const response = await UserService.fetchUsers();
          console.log("SDDFSDFSDFGSDFG", response.data);
          setUsers(response.data)
        } catch (error) {
          console.log(error);
          
        }
    }

    async function getGroup(){
        const group = await UserService.fetchGroup(studentGroupId)
        setGroup(group.data.nameGroup)
    }


    async function getFiles(){
        try {
            if (tapOnButton == false) {
                const response = await UserService.fetchFile(UserId)
                setNameFile(response.data.rows)
                // console.log("RESPONSE",response);
                setTapOnButton(!tapOnButton)
            } else {
                setTapOnButton(!tapOnButton)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getLesson(){
        try {
            if (tapOnButton == false) {
                const response = await UserService.fetchLesson()
                setNameLesson(response)
                console.log("RESPONSE",response);
                setTapOnButton(!tapOnButton)
            } else {
                setTapOnButton(!tapOnButton)
            }
        } catch (error) {
            console.log(error);
        }
    }


    

    return (
        <Container>
            <Row className="d-flex flex-column m-3">
                <h1> Карточка студента </h1>
                <div className='mt-2'>
                {studentProfile.map((info, index) => 
                <Row key={info.id} style={{background: index % 2 === 0 ? "lightcyan" : 'lightgray', padding: 10}}>
                    {info.title}: {info.description}
                </Row>
                )}
                </div>
                {/* <h3 className="mt-4">Сданные работы</h3>
                {file.map((info, index) => 
                <Row key={info.id} style={{background: index % 2 === 0 ? "lightcyan" : 'lightgray', padding: 10}}>
                    {info.nameLesson}: {info.nameFile}
                </Row>
                )} */}
                
                
                { !tapOnButton ? 
                <div>
                <button className='mt-2 mb-2' onClick={getFiles}>Получить список сданных работ</button>
                </div>
                : <div>
                <button className='mt-2 mb-2' onClick={getFiles}>Скрыть список сданных работ</button>
                </div>}

                {/* { tapOnButton ?
                <div>
                {nameFile.map((info, index) => 
                <Row key={info.id} style={{background: index % 2 === 0 ? "lightcyan" : 'lightgray', padding: 10}}>
                    {info.nameFile}
                </Row>
                )} 
                </div>
                : null}  */}
                
                { tapOnButton ? 
                <div className='Table'>
                    <Table1 /> 
                </div>
                : null}
                   
            </Row>

            

            
        </Container>




        // <Row className="d-flex flex-column m-3">
        //     <h1> Карточка студента </h1>
        //     { users.map(user => 
        //         <Row key={user.id} style={{background: user.id % 2 === 0 ? 'blue' : 'lightgray', padding: 10}}>
        //            Номер студенческого: {user.studentCardNumber} </Row>)
        //     // <h1>{store.isAuth ? 'Пользователь авторизован' : 'Необходимо зайти в свой профиль'}</h1>
        //     // <h1>{store.user.isActivated ? "Аккаунт подтвержден по почте" : "Требуется активация аккаунта" }</h1>

        //     // <div className="App">
        //     // </div>
        //     }
        // </Row>
    );
};

export default Student;





{/* <div>
    <button onClick={getUsers}>Получить список пользователей</button>
</div> */}
{/* {users.map(user => 
    <div key={user.email}>{user.email}: {user.studentCardNumber}</div>
)} */}