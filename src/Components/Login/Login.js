import axios from 'axios';
import React, { useRef, useState } from 'react';
import FileBase64 from 'react-file-base64';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "./Login.css";

const Login = () => {
    const [img, setImg] = useState("")
    const [token, setToken] = useState("")
    const [login, setLogin] = useState(true)
    const textAreaRef = useRef(null);
    const navigate = useNavigate()
    const { register, reset, formState: { errors }, handleSubmit } = useForm();

    const onSubmitRegister = async (data) => {
        data["photoURL"] = img
        await axios.post("https://rhubarb-cobbler-14699.herokuapp.com/user", data).then(res => {
            if (res.status === 200) {
                axios.get(`https://rhubarb-cobbler-14699.herokuapp.com/user/${res.data.insertedId}`).then(res => {
                    setLogin(false)
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Token Create Successfully',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      
                    setToken(res.data.token)
                })
                reset()
            }
        })

    };
    const handleCopy = (e) => {
        textAreaRef.current.select();
        document.execCommand('copy');
        // This is just personal preference.
        // I prefer to not show the the whole text area selected.
        e.target.focus();
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Token Copy Successfully',
            showConfirmButton: false,
            timer: 1500
          })
          
    }
    const goToLoginPage = () => {
        navigate("/login")
    }

    return (
        <>
            <section>
                <div className="main">
                    {login ?
                        <>
                            <div className="signup">
                                <form onSubmit={handleSubmit(onSubmitRegister)}>
                                    <label>Sign up</label>
                                    <input type="text" {...register("displayName", { required: true })} placeholder="User name" />
                                    <FileBase64
                                        type="file"
                                        multiple={false}
                                        placeholder="Update Your Photo"
                                        onDone={({ base64 }) => setImg(base64)}
                                    />
                                    <input type="number" {...register("phone", { required: true })} placeholder="Mobile Number" />
                                    <button className='button' type='submit'>Generate Token</button>
                                    <button className='button' onClick={goToLoginPage} >Go To Login</button>
                          
                                </form>
                            </div> </> : <div className="signup">
                            <label>Generated Token</label>
                            <textarea ref={textAreaRef} readOnly type="text" value={token} />
                            <button className='button' onClick={handleCopy}>Copy Token</button>
                            <button className='button' onClick={goToLoginPage}>Go To Login Page </button>
                        </div>}
                </div>
            </section>
        </>
    );
};

export default Login;