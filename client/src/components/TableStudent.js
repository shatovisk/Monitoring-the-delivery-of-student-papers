// import logo from './logo.svg';
// import './App.css';
import React, { Component, useContext, useState } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { observer } from "mobx-react-lite"; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import BootstrapTable from 'react-bootstrap-table-next';
import UserService from '../services/UserService';
import { Context } from '../index';
import ModalDownloadWindow from './ModalDownloadWindow';
import ModalDeleteWindow from './ModalDeleteWindow';



const Table1 = () => {

      const {store} = useContext(Context)
      const [data1, setData] = useState([])
      const [isFunctionCalled, setIsFunctionCalled] = useState(false)
      const [modalDownloadVisible, setModalDownloadVisible] = useState(false)
      const [modalDeleteVisible, setModalDeleteVisible] = useState(false)
      const [objectLesson, setObjectLesson] = useState([])

      const studentGroupId  = store.user.studentGroupId || 1
      const UserId = store.user.id;

      if (!isFunctionCalled) {
        getLesson()
        setIsFunctionCalled(true)
        console.log("LESSONaasdasdasdasdasd", data1);
      }

    
    const columns = [{
        dataField: 'id',
        text: '№',
        headerStyle: (colum, colIndex) => {
              return { width: '10%', textAlign: 'center' };
            }
      }, {
        dataField: 'nameLesson',
        text: 'Наименование предмета',
        sort: true,
        headerStyle: (colum, colIndex) => {
          return { width: '45%', textAlign: 'center' };
        }
      }, {
        dataField: 'nameFile',
        text: 'Отчет',
        headerStyle: (colum, colIndex) => {
          return { width: '45%', textAlign: 'center' };
        }
      }, ];
    
    
      async function getLesson() {
        const responseLesson = await UserService.fetchLesson(studentGroupId)
        setObjectLesson(responseLesson.data)
        const responseFiles = await UserService.fetchFile(UserId)
        let data = []
        let nameLesson = []
        let nameFiles = []

        // console.log("FILEs", responseLesson.data, responseFiles.data.rows, responseFiles.data.rows.length);
        for (let i = 0; i < responseLesson.data.length; i++) {
          nameLesson.push(responseLesson.data[i].nameLesson)
          for (let y = 0; y < responseFiles.data.rows.length; y++){
            // console.log("I Id", i, responseFiles.data.rows[y].studentLessonId);
            if (responseLesson.data[i].id == responseFiles.data.rows[y].studentLessonId){
              nameFiles.push({ [nameLesson[i]]: responseFiles.data.rows[y].nameFile })
              break
            }
          }
        }
        // console.log("nameFiles", Object.keys(nameFiles[0]));
        nameLesson = nameLesson.sort()
        // console.log("nameLesson", nameLesson);

        for (let i = 0; i < responseLesson.data.length; i++){
          if (nameFiles.length == 0){
            data.push({id: i + 1, nameLesson: nameLesson[i], nameFiles: null})
          } else {
            for (let y = 0; y < nameFiles.length; y++){
              // если отчет загружен
              if (Object.keys(nameFiles[y])[0] === nameLesson[i]){
                data.push({id: i + 1, nameLesson: nameLesson[i], nameFile: Object.values(nameFiles[y])})
                console.log("DATA", data);
                break
              } 
              // если отчет не загружен
              if (nameFiles.length - 1 == y){
                data.push({id: i + 1, nameLesson: nameLesson[i], nameFiles: null})                                
              }
            }
          }
        }
        
        setData(data)
        console.log("LESSON2", data1);
      }


      return (
        <div className="App">
          
          <BootstrapTable striped hover keyField='id' data={ data1 } columns={ columns } />

          <Button variant='outline-dark' className='mt-4 p-2' onClick={() => setModalDownloadVisible(true)}> Загрузить отчет </Button>
          <Button variant='outline-dark' className='mt-4 p-2 ms-3' onClick={() => setModalDeleteVisible(true)}> Удалить отчет </Button>
          <ModalDownloadWindow show={modalDownloadVisible} onHide={() => setModalDownloadVisible(false)} nameLesson={objectLesson}/>
          <ModalDeleteWindow show={modalDeleteVisible} onHide={() => setModalDeleteVisible(false)} nameLesson={objectLesson}/>
          
        </div>
      );
  }

export default observer(Table1);