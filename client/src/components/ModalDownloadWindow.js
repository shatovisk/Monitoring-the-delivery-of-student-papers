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



const ModalDownloadWindow = ({show, onHide, nameLesson}) => {

    const {store} = useContext(Context)
    console.log("NAMELESSON", nameLesson);
    const [lesson, setLesson] = useState("")
    const [file, setFile] = useState(null)

    const userId = store.user.id
    console.log("STOREEEE", store.user.id);


    function selectFile(e) {
      setFile(e.target.files[0])
    }

    async function addFile() {
      const formData = new FormData()
      formData.append("nameFile", file.name)
      formData.append("files", file)
      formData.append("UserId", userId)
      let studentLessonId = getStudentLessonId()
      formData.append("studentLessonId", studentLessonId)
      const response = await UserService.uploadFile(formData)
      // if (response) {
      //   onHide()
      //   window.location.reload()
      // }
    }

    function close() {
      onHide()
      window.location.reload()
    }

    function getStudentLessonId () {
      for (let i = 0; i < nameLesson.length; i++){
        if (nameLesson[i].nameLesson == lesson) {
          return nameLesson[i].id
        }
      }
    }

    return (
        <>

      <Modal show={show} onHide={onHide} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Загрузить отчет</Modal.Title>
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

            <Form.Control
              type="file"
              className="mt-3"
              onChange={selectFile}
            />
          </Form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={addFile}>
            Загрузить
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    );
}


export default observer(ModalDownloadWindow)