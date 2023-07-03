import { observer } from "mobx-react-lite"
import { useState } from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form } from "react-bootstrap";
import UserService from "../services/UserService";


const ModalAddGroup = ({show, onHide}) => {
    const [group, setGroup] = useState("")

    async function addGroup() {
        const responseGroup = await UserService.addGroup(group.toUpperCase())
        
    }

    function close() {
        onHide()
        window.location.reload()
    }

    return (
        <>
            <Modal show={show} onHide={onHide} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Добавить номер группы в БД</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    

                    <Form.Control 
                            className="mt-2"
                            onChange={e => setGroup(e.target.value)}
                            value={group}
                            type="text"
                            placeholder="Введите номер группы. Пример: '19-ПО'"
                    />


                </Form>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={addGroup}>
                    Добавить
                </Button>
                </Modal.Footer>
            </Modal>
        
        </>
    );
}

export default observer(ModalAddGroup)