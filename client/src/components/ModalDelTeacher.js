import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { Dropdown, Form } from "react-bootstrap";
import UserService from "../services/UserService";

const ModalDelTeacher = ({show, onHide}) => {
    const [teacher, setTeacher] = useState("")
    const [teachers, setTeachers] = useState([])

    useEffect(() => {
        getTeachers()
    }, [])

    async function getTeachers(){
        const responseTeachers = await UserService.getTeachers()

        setTeachers(responseTeachers.data)
    }

    async function delTeacher(){
        let teacherId
        for (let i = 0; i < teachers.length; i++){
            if (teachers[i].name == teacher){
                teacherId = teachers[i].id
                break
            }
        }

        const responseTeacher = await UserService.delTeacher(teacherId)
    }

    function close() {
        onHide()
        // window.location.reload()
    }

    return (
        <>
            <Modal show={show} onHide={onHide} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Удалить преподавателя из БД</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Dropdown>
                    <DropdownToggle>{teacher || "Выберите преподавателя"}</DropdownToggle>
                    <DropdownMenu>
                    {teachers.map((info) => 
                        <DropdownItem key={info.id} onClick={() => setTeacher(info.name)}> {info.name} </DropdownItem> 
                        )} 
                    </DropdownMenu>
                    </Dropdown>

                    

                </Form>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={delTeacher}>
                    Удалить
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default observer(ModalDelTeacher)