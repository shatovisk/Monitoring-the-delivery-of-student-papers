import { observer } from "mobx-react-lite";
import { useState, useContext } from "react";
import { Dropdown, Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { Context } from '../index';
import UserService from '../services/UserService'



const ModalDeleteWindow = ({show, onHide, nameLesson}) => {

    const [lesson, setLesson] = useState("")
    const {store} = useContext(Context)

    const userId = store.user.id

    async function delFile() {
      let studentLessonId = getStudentLessonId()
      const response = await UserService.delFile(userId, studentLessonId)
      // if (response) {
      //   onHide()
      //   window.location.reload()
      // }
    }


    function getStudentLessonId () {
      for (let i = 0; i < nameLesson.length; i++){
        if (nameLesson[i].nameLesson == lesson) {
          return nameLesson[i].id
        }
      }
    }

    function close() {
      onHide()
      window.location.reload()
    }

    return (
        <>

      <Modal show={show} onHide={onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Удаление отчета</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Dropdown>
              <DropdownToggle>{lesson || "Выберите дисциплину"}</DropdownToggle>
              <DropdownMenu>
              {nameLesson.map((info) => 
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
          <Button variant="primary" onClick={delFile}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    );
}


export default observer(ModalDeleteWindow)