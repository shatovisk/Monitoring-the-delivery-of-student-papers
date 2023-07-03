import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { Dropdown, Form } from "react-bootstrap";
import UserService from "../services/UserService";

const ModalDelTeacherFromLesson = ({show, onHide}) => {
    const [group, setGroup] = useState("")
    const [groups, setGroups] = useState([])
    const [lessons, setLessons] = useState([])
    const [lesson, setLesson] = useState("")

    useEffect(() => {
        getGroups()
    }, [])

    useEffect(() => {
        getLesson()
    }, [group])


    async function getGroups(){
        const responseGroups = await UserService.getAllGroups()

        setGroups(responseGroups.data)

    }


    async function getLesson(){
        if (group) {
            let groupId
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].nameGroup == group) {
                    groupId = groups[i].id
                    break
                }
            }
    
    
        const responseLessons = await UserService.getLesson(groupId)
        setLessons(responseLessons.data)
        }
     
    }

    function close() {
        onHide()
        // window.location.reload()
    }


    async function delLab(){
        let groupId
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].nameGroup == group) {
                groupId = groups[i].id
                break
            }
        }

        let nameLesson
        for (let i = 0; i < lessons.length; i++){
            if (lessons[i].nameLesson == lesson) {
                nameLesson = lessons[i].nameLesson
                break
            }
        }

        const responseLesson = await UserService.delLesson(groupId, nameLesson)

    }

    return (
        <>
            <Modal show={show} onHide={onHide} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Удалить дисциплину для сдачи</Modal.Title>
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

                    <Dropdown className="mt-3">
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
                <Button variant="primary" onClick={delLab}>
                    Удалить
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default observer(ModalDelTeacherFromLesson)