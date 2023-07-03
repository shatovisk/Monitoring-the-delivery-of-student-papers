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


const ModalDelLab = ({show, onHide}) => {
    const [group, setGroup] = useState("")
    const [groups, setGroups] = useState([])
    const [lessons, setLessons] = useState([])
    const [lesson, setLesson] = useState("")
    const {storeTeacher} = useContext(Context)


    let teacherId = storeTeacher.teacher.id || 0


    useEffect(() => {
        getGroups()
    }, [])

    useEffect(() => {
        getLesson()
    }, [group])


    async function getGroups(){
        const responseGroupsId = await UserService.fetchTeacherGroupId(teacherId)
        console.log("GROUPSID", responseGroupsId);
        let groupId = [] // хранит id групп, которые привязаны к данному учителю

        for (let i = 0; i < responseGroupsId.data.length; i++){
            groupId.push(responseGroupsId.data[i].studentGroupId)
        }

        console.log("ГРУППЫ", groupId);

        let groupIdName = [] // хранит номера групп и их id, которые привязаны к данному учителю

        for (let i = 0; i < groupId.length; i++){
            const responseGroups = await UserService.fetchGroup(groupId[i])

            console.log("Response", responseGroups);

            groupIdName.push(responseGroups.data)
        }

        console.log("IDNAMEgroup", groupIdName);
        setGroups(groupIdName)
        getLesson()

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
    
    
            const responseLesson = await UserService.fetchLesson(groupId)
            setLessons(responseLesson.data)
        }
     
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

    function close() {
        onHide()
        // window.location.reload()
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

    );
}

export default observer(ModalDelLab)