import React, {FC, useContext, useEffect, useState} from 'react';
import { Context } from './index';
import { observer } from 'mobx-react-lite';
import { IUser } from './models/IUser';
import UserService from './services/UserService';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavigationBar from './components/NavigationBar'
import Student from './pages/Student';
import Teacher from './pages/Teacher';



const App: FC = () => {
  const {store, storeTeacher} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  
  

  useEffect( () => {
    if (localStorage.getItem('token')){
      
        store.cheackAuth()
        
      }
  }, [])

  useEffect( () => {
    if (localStorage.getItem('tokenTeacher')){

      storeTeacher.cheackAuth()
    }
  }, [])


  if (store.isLoading) {
    return <div>Загрузка...</div>
  }

  // if (!store.isAuth) {
    return (
      <BrowserRouter>
        <NavigationBar/>
        <AppRouter/>
        {/* <LoginForm/> */}
      </BrowserRouter>
    )
  // }


  // return (
  //   <BrowserRouter>
  //   <div>
  //     <NavigationBar/>
  //     <Student/>
      
      
  //   </div>

  //   <div>
  //     <NavigationBar/>
  //     <Teacher/>
  //   </div>
  //   </BrowserRouter>
  // );



}

export default observer(App);
