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


const ModalAddLab = ({show, onHide}) => {
    const [group, setGroup] = useState("")
    const {storeTeacher} = useContext(Context)
    const [groups, setGroups] = useState([])
    const [lesson, setLesson] = useState("")
    console.log("TEACHER", storeTeacher);

    let teacherId = storeTeacher.teacher.id || 0

    useEffect(() => {
        getGroups()
    }, [])


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
    }


    async function addLesson(){
        let groupId
        
        for (let i = 0; i < groups.length; i++) {
            if (groups[i].nameGroup == group){
                groupId = groups[i].id
                break
            }
        }

        console.log("PARAMS", groupId, teacherId, lesson);
        const responseLesson = await UserService.addLesson(groupId, teacherId, lesson)
    } 



    function close() {
        onHide()
        // window.location.reload()
    }

    return (
        <>

      <Modal show={show} onHide={onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Добавить дисциплину для сдачи</Modal.Title>
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

            <Form.Control 
                    className="mt-2"
                    onChange={e => setLesson(e.target.value)}
                    value={lesson}
                    type="text"
                    placeholder="Введите название дисциплины. Пример: 'ОТИВС_ЛР1'"
            />


          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={addLesson}>
            Добавить
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    );
}

export default observer(ModalAddLab)