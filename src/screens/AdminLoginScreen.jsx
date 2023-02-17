import React, { useEffect } from "react";
import { login } from "../api/api";
import {redirect, useNavigate, Form } from 'react-router-dom'
import localforage from 'localforage';


  export const loginAction = async({request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const isAuth = await login(data)
    if(isAuth){ return redirect("/panel")}else{
      return null
    }
  }

const AdminLoginScreen = () => {
  const navigate = useNavigate()

  const deleteSession = async() => {
      console.log("deleting shit")
      await localforage.removeItem('token')
      await localforage.removeItem('user') 
  } 

  useEffect(() => {
    deleteSession()
  },[])
  

    return (
    <div className="centeredContainer">

      <div className="formContainer">
       <Form
       method="POST"
       id="loginForm"
       >

        <span className="loginText">Email de Admin</span>
        <input
          className="loginInput"
          type="email"
          name="email"
          />


        <span
        className="loginText"
        >Contraseña</span>
        <input
        className="loginInput"
        type="password"
        name="password"
        />

      <div className="formBtnContainer">
        
        <button type="submit"
        className="btn btn-submit formbtn"
        >
          Login
        </button>
      </div>
       </Form>
      </div>
      
    </div>
   

    );
  };

  export default AdminLoginScreen