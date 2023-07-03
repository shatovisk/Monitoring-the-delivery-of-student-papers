import React, { useState } from "react";
import { Container, Dropdown, Form, Button } from "react-bootstrap";
import ModalAddGroup from "../components/ModalAddGroup";
import ModalDelGroup from "../components/ModalDelGroup";
import ModalAddLessonAsAdmin from "../components/ModalAddLessonAsAdmin";
import ModalUpdateTeacherToLesson from "../components/ModalUpdateTeacherToLesson";
import ModalDelTeacherFromLesson from "../components/ModalDelTeacherFromLesson";
import ModalDelTeacher from "../components/ModalDelTeacher";

const Admin = () => {
    const [visibleModalAddGroup, setVisibleModalAddGroup] = useState(false)
    const [visibleModalDelGroup, setVisibleModalDelGroup] = useState(false)
    const [visibleModalAddLesson, setVisibleModalAddLesson] = useState(false)
    const [visibleModalUpdateLesson, setVisibleModalUpdateLesson] = useState(false)
    const [visibleModalDelLesson, setVisibleModalDelLesson] = useState(false)
    const [visibleModalDelTeacher, setVisibleModalDelTeacher] = useState(false)



    return (
        <Container className="d-flex flex-column">
            <Button variant='outline-dark' className='mt-3 mb-3 ms-3' onClick={() => setVisibleModalAddGroup(true)}> Добавить группу </Button>
            <ModalAddGroup show={visibleModalAddGroup} onHide={() => setVisibleModalAddGroup(false)}/>

            <Button variant='outline-dark' className='mb-3 ms-3' onClick={() => setVisibleModalDelGroup(true)}> Удалить группу </Button>
            <ModalDelGroup show={visibleModalDelGroup} onHide={() => setVisibleModalDelGroup(false)}/>

            <Button variant='outline-dark' className='mb-3 ms-3' onClick={() => setVisibleModalAddLesson(true)}> Назначить предмет преподавателю </Button>
            <ModalAddLessonAsAdmin show={visibleModalAddLesson} onHide={() => setVisibleModalAddLesson(false)}/>

            <Button variant='outline-dark' className='mb-3 ms-3' onClick={() => setVisibleModalUpdateLesson(true)}> Назначить нового преподавателя на предмет </Button>
            <ModalUpdateTeacherToLesson show={visibleModalUpdateLesson} onHide={() => setVisibleModalUpdateLesson(false)}/>

            <Button variant='outline-dark' className='mb-3 ms-3' onClick={() => setVisibleModalDelLesson(true)}> Удалить дисциплину </Button>
            <ModalDelTeacherFromLesson show={visibleModalDelLesson} onHide={() => setVisibleModalDelLesson(false)}/>

            <Button variant='outline-dark' className='mb-3 ms-3' onClick={() => setVisibleModalDelTeacher(true)}> Удалить преподавателя </Button>
            <ModalDelTeacher show={visibleModalDelTeacher} onHide={() => setVisibleModalDelTeacher(false)}/>
        </Container>
    );
};

export default Admin;