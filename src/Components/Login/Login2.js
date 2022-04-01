import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login2 = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const onSubmit = data => {
        axios.get(`https://rhubarb-cobbler-14699.herokuapp.com/userToken/${data.token}`).then(res => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Login Successfully',
                showConfirmButton: false,
                timer: 1500
              })
            localStorage.setItem("user", JSON.stringify(res.data));
            navigate("/chating")
        })     
    }

    return (
        <section>
            <div className="main">
                <div className="signup">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label>Sign In</label>
                        <input type="text" {...register("token", { required: true })} placeholder="Type Token" />
                        <button className='button' type='submit'>Login</button>
                        <button className='button' onClick={navigate("/register")} >Go to Register</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Login2;