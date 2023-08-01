import { useState, useContext, useRef, useEffect } from 'react'
import  {Context } from '../../context.js';
import { Link } from 'react-router-dom';

const Register = () => {
    const form = useRef();
    const usernameValid = new RegExp(/^([\d_]*[a-z][\d_]*){3,}[\d_a-z]{2,}$/);
    const passwordValid = new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm);
    const confirmPasswordValid = new RegExp();
    const [msgError, setMsgError] = useState("")
    const {apiLink, setToken, setCurrentUser, currentUser,token, navigate, loggedInCoond} = useContext(Context)

    useEffect(() => {
        if(loggedInCoond) {
            navigate("/")
        }
    })    

    const register = async (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);
        const username = formData.get("username").trim();
        const password = formData.get("password").trim();
        const name = {
            first: formData.get("first-name").trim(),
            last: formData.get("last-name").trim()
        }

        const user = {username, password, name}
        
        
        try { 
            const res = await fetch(`${apiLink}/users/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",           
                },
                body: JSON.stringify(user)                      
            })
            const data = await res.json();
            if(res.status == 200) {
                setMsgError("")
                navigate("/login")              
            } else {
                throw data.msg
            }
            } catch (error) {
                setMsgError(error)
            }        
 
    }

    return(
        <div className="form-wrap container">
        <form  onSubmit={register} ref={form}>           
            <div className='form-header'>
                <legend>Sign up</legend>
            </div>
            <div className="form-body">
            <input required type="text" placeholder='Username' name='username'/>
           <input name='first-name' required placeholder='First name' type="text" />
            <input name='last-name' placeholder='Last name' type="text" />
            <input required type="password" placeholder='Password' name='password' />
            <input required type="password" placeholder='Confirm password' name='confirm-password' />
            {msgError != "" ? <div className='error'><h1>{msgError}</h1></div> : null}
            <button>Sign up</button>
            </div>
            <div className='form-footer'>
                <p>Alredy have an account?</p>
                <Link to="/login">Log in</Link>
            </div>
        </form>
    </div>    
    )
}


export default Register