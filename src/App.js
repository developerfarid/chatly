import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ChatPage from './Components/ChatHome/ChatPage/ChatPage';
import Header from './Components/Header/Header';
import Login from './Components/Login/Login';
import Login2 from './Components/Login/Login2';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';

function App() {
  return (

    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login2 />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path='/chating' element={<ChatPage />} />
          </Route>
          <Route path='/register' element={<Login />} />
   
         

        </Routes>
      </BrowserRouter>
  );
}

export default App;
