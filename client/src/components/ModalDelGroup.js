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

const ModalDelGroup = ({show, onHide}) => {
    const [group, setGroup] = useState("")
    const [groups, setGroups] = useState([])


    useEffect(() => {
        getGroups()
    }, [])


    async function getGroups(){
        const responseGroups = await UserService.getAllGroups()

        setGroups(responseGroups.data)
    }

    async function delGroup() {
        const responseGroup = await UserService.delGroup(group)

        for (let i = 0; i < groups.length; i++) {
            if (groups[i].nameGroup == group){
                delete groups[i]
                break
            }
        }
    }

    function close() {
        onHide()
        // window.location.reload()
    }

    return (
        <>
            <Modal show={show} onHide={onHide} backdrop="static">
                <Modal.Header closeButton>
                <Modal.Title>Удалить номер группы из БД</Modal.Title>
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

                    

                </Form>

                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={close}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={delGroup}>
                    Удалить
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default observer(ModalDelGroup)