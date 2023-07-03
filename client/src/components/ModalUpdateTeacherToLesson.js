import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { Dropdown, Form } from "react-bootstrap";
import UserService from "../services/UserService";
import { Context } from "../index";

const ModalUpdateTeacherToLesson = ({show, onHide}) => {
    const [group, setGroup] = useState("")
    const [groups, setGroups] = useState([])
    const [lesson, setLesson] = useState("")
    const [lessons, setLessons] = useState([])
    const [teacher, setTeacher] = useState("")
    const [teachers, setTeachers] = useState([])


    useEffect(() => {
        getGroups()
        getTeachers()
    }, [])

    useEffect(() => {
        if (group){
            getLesson()
        }
    }, [group])


    async function getGroups(){
        const responseGroups = await UserService.getAllGroups()

        setGroups(responseGroups.data)

        // getLesson()
    }

    async function getTeachers(){
        const responseTeachers = await UserService.getTeachers()

        setTeachers(responseTeachers.data)
    }

    async function getLesson() {
        let groupId
        for (let i = 0; i < groups.length; i++){
            if (groups[i].nameGroup == group){
                groupId = groups[i].id
                break
            } 
        }

        const responseLessons = await UserService.getLesson(groupId)
        setLessons(responseLessons.data)
    }

    async function updateLesson(){
        let groupId
        for (let i = 0; i < groups.length; i++){
            if (groups[i].nameGroup == group){
                groupId = groups[i].id
                break
            } 
        }

        let teacherId
        for (let i = 0; i < teachers.length; i++){
            if (teachers[i].name = teacher){
                teacherId = teachers[i].id
                break
            }
        }

        console.log("PARAMS", groupId, group, teacherId, teacher, lesson);
        const responseLesson = UserService.updateLesson(groupId, teacherId, lesson)
    }

    function close() {
        onHide()
        // window.location.reload()
    }

    return (
        <>
            <Modal show={show} onHide={onHide} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Переназначить преподавателя для дисциплины</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Dropdown>
                    <DropdownToggle>{group || "Выберите группу"}</DropdownToggle>
                    <DropdownMenu>
                    {groups.map((info) => 
                        <DropdownItem key={info.id} onClick={() => setGroup(info.nameGroup)}> {info.nameGroup} </DropdownItem> 
                        )} 
                    </DropdownMenu>
                    </Dropdown>

                    <Dropdown className="mt-2">
                    <DropdownToggle>{teacher || "Выберите преподавателя"}</DropdownToggle>
                    <DropdownMenu>
                    {teachers.map((info) => 
                        <DropdownItem key={info.id} onClick={() => setTeacher(info.name)}> {info.name} </DropdownItem> 
                        )} 
                    </DropdownMenu>
                    </Dropdown>

                    <Dropdown className="mt-2">
                    <DropdownToggle>{lesson || "Выберите дисциплину"}</DropdownToggle>
                    <DropdownMenu>
                    {lessons.map((info) => 
                        <DropdownItem key={info.id} onClick={() => setLesson(info.nameLesson)}> {info.nameLesson} </DropdownItem> 
                        )} 
                    </DropdownMenu>
                    </Dropdown>


                </Form>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={updateLesson}>
                    Обновить
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
} 

export default observer(ModalUpdateTeacherToLesson)