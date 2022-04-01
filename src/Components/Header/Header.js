import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './Header.css'

const Header = () => {
   const navigate= useNavigate()
    const logout = () => {
        localStorage.removeItem("user")
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Logout Successfully',
            showConfirmButton: false,
            timer: 1500
          })
          
        navigate("/register")
        
    }
    const user = JSON.parse(localStorage.getItem("user"))

    return (
        <nav>
          {!user?.token ? <Link to='/login'>Login</Link>:
          <button onClick={logout}>Logout</button>}
        <Link to='/chating'>Chatly</Link>
        </nav>
        
    );
};

export default Header;