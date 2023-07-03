import React, { useContext, useEffect, useState } from "react";
import { Container, Dropdown, Form, Button } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { Context } from "../index";
import UserService from "../services/UserService";
import BootstrapTable from 'react-bootstrap-table-next';
import ModalAddLab from "../components/ModalAddLab";
import ModalDelLab from "../components/ModalDelLab";

const Teacher = () => {
    const {storeTeacher} = useContext(Context)
    const [groups, setGroups] = useState([]) // используется, чтобы получить массив объектов групп
    const [group, setGroup] = useState("") // используется для DropdownToggle
    const [isFunctionCalled, setIsFunctionCalled] = useState(false)
    const [students, setStudents] = useState([])// используется, чтобы получить массив объектов студентов
    const [student, Setstudent] = useState("") // используется для DropdownToggle
    const [studentGroupId, setStudentGroupId] = useState("")
    const [data, setData] = useState([])
    const [visibleModal, setVisibleModal] = useState(false)
    const [visibleDelModal, setVisibleDelModal] = useState(false)

    const teacherId =  storeTeacher.teacher.id 
    console.log("STORETEACHER", storeTeacher.teacher.id);
    console.log("GROUP", group);

    // if (!isFunctionCalled) {
    //     getGroups()
    //     setIsFunctionCalled(true)
    // }

    // useEffect( () => {
    //     getGroups()
    // }, [])

    const columns = [{
        dataField: 'id',
        text: '№',
        sort: true,
        headerStyle: (colum, colIndex) => {
              return { width: '10%', textAlign: 'center' };
            }
      }, {
        dataField: 'nameStudent',
        text: 'Фамилия и Имя студента',
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: '20%', textAlign: 'center' };
        }
      },
      {
        dataField: 'nameLesson',
        text: 'Наименование дисциплины',
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: '20%', textAlign: 'center' };
        }
      }, {
        dataField: 'nameFile',
        text: 'Отчет',
        headerStyle: (colum, colIndex) => {
          return { width: '20%', textAlign: 'center' };
        }
      }, 
      {
        dataField: 'data',
        text: 'Дата загрузки',
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: '20%', textAlign: 'center' };
        }
      },];
    



    async function getFiles(){
        const responseGroupsId = await UserService.fetchTeacherGroupId(storeTeacher.teacher.id)
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

        setGroups(groupIdName)
        console.log("IDNAMEgroup", groupIdName);
        
        let studentsGroup; // хранит id группы

        for (let i = 0; i < groupIdName.length; i++){
            if (groupIdName[i].nameGroup == group.toUpperCase()) {
                // setStudentGroupId(groupIdName[i].id)
                studentsGroup = groupIdName[i].id
                console.log("IDDDD", groupIdName[i].id);
                break
            }
        }
        console.log("IDDDDD", studentsGroup);

        const responseStudents = await UserService.fetchStudent(studentsGroup)

        console.log("Students", responseStudents);


        if (student) {

            let studentId // хранит id заданного студента 

            //Преобразование введенное имя студента к правильной форме
            // ************************************* //
            let metaArray = student.split(" ")
            let studentFirstName = metaArray[0]
            let validatorStudentFirstName = studentFirstName[0].toUpperCase() + studentFirstName.slice(1)
            console.log("METAARRAY", studentFirstName.split(1));
            let StudentSecondName = metaArray[1]
            let validatorStudentSecondName = StudentSecondName[0].toUpperCase() + StudentSecondName.slice(1)
            let validateStudentName = validatorStudentFirstName + " " + validatorStudentSecondName
            // ************************************* //
    
    
    
            for (let i = 0; i < responseStudents.data.length; i++){
                if (responseStudents.data[i].nameStudent == validateStudentName){
                    studentId = responseStudents.data[i].id
                    break
                }
            }
    

            const responseFiles = await UserService.fetchFile(studentId)

            console.log("FilES", responseFiles);
    
            let dataOfFiles = [] //заполнение таблицы
            let nameStudent;
            let nameLesson;
            let nameFile;
            let dataOfDownload;
    
            const responseLesson = await UserService.fetchLesson(studentsGroup)
    
            console.log("Lessson", responseLesson);
    
            for (let i = 0; i < responseFiles.data.rows.length; i++) {
                nameFile = responseFiles.data.rows[i].nameFile
                dataOfDownload = responseFiles.data.rows[i].createdAt
                for (let y = 0; y < responseStudents.data.length; y++){
                    if (responseFiles.data.rows[i].UserId == responseStudents.data[y].id){
                        nameStudent = responseStudents.data[y].nameStudent
                        break
                    }
                }
                for (let z = 0; z < responseLesson.data.length; z++){
                    if (responseFiles.data.rows[i].studentLessonId == responseLesson.data[z].id){
                        nameLesson = responseLesson.data[z].nameLesson
                        break
                    }
                }
                dataOfFiles.push({id: i + 1, nameStudent: nameStudent, nameLesson: nameLesson, nameFile: nameFile, data: dataOfDownload})
    
            }
            setData(dataOfFiles)    
        } else {
            

            let dataOfFiles = [] //заполнение таблицы
            let nameStudent;
            let nameLesson;
            let nameFile;
            let dataOfDownload;
            let id = 0
            for (let i = 0; i < responseStudents.data.length; i++){
                let studentId = responseStudents.data[i].id

                const responseFiles = await UserService.fetchFile(studentId)

                console.log("FilES", responseFiles);
        
                
        
                const responseLesson = await UserService.fetchLesson(studentsGroup)
        
                console.log("Lessson", responseLesson);
        
                for (let i = 0; i < responseFiles.data.rows.length; i++) {
                    nameFile = responseFiles.data.rows[i].nameFile
                    dataOfDownload = responseFiles.data.rows[i].createdAt
                    for (let y = 0; y < responseStudents.data.length; y++){
                        if (responseFiles.data.rows[i].UserId == responseStudents.data[y].id){
                            nameStudent = responseStudents.data[y].nameStudent
                            break
                        }
                    }
                    for (let z = 0; z < responseLesson.data.length; z++){
                        if (responseFiles.data.rows[i].studentLessonId == responseLesson.data[z].id){
                            nameLesson = responseLesson.data[z].nameLesson
                            break
                        }
                    }
                    dataOfFiles.push({id: ++id, nameStudent: nameStudent, nameLesson: nameLesson, nameFile: nameFile, data: dataOfDownload})
                }
            }
            setData(dataOfFiles)    
        }

    }

    async function getStudents() {
        console.log("Ghbdtn");
    }
    


    return (
        
        // <Container style={{width: 600}} className="right-block">
            <Form>
                {/* <Dropdown className="mt-2">
                <DropdownToggle onChange={getStudents}>{group || "Выберите дисциплину"}</DropdownToggle>
                <DropdownMenu>
                {groups.map((info) => 
                    <DropdownItem key={info.id} onClick={() => setGroup(info.nameGroup)}> {info.nameGroup} </DropdownItem> 
                    )} 
                </DropdownMenu>
                </Dropdown> */}

                <Form.Control 
                    className="mt-2"
                    onChange={e => setGroup(e.target.value)}
                    value={group}
                    type="text"
                    placeholder="Введите номер группы"
                />
                
                <Form.Control 
                    className="mt-2"
                    onChange={e => Setstudent(e.target.value)}
                    value={student}
                    type="text"
                    placeholder="Введите имя и фамилию студента или оставьте поле пустым, чтобы получить отчеты всей группы"
                />

                <Button className="mt-3 mb-3" variant={"outline-success"} onClick={getFiles}>Получить список отчетов</Button>

                <Button variant='outline-dark' className='mt-3 mb-3 ms-3' onClick={() => setVisibleModal(true)}> Добавить дисциплину </Button>
                <ModalAddLab show={visibleModal} onHide={() => setVisibleModal(false)} nameGroup={groups}/>

                <Button variant='outline-dark' className='mt-3 mb-3 ms-3' onClick={() => setVisibleDelModal(true)}> Удалить дисциплину </Button>
                <ModalDelLab show={visibleDelModal} onHide={() => setVisibleDelModal(false)} />
                
            <BootstrapTable triped hover keyField='id' data={data} columns={ columns } />
            
            

            </Form>       
            
            
        // </Container>
        // <div>
        // </div>
    );
};

export default Teacher;