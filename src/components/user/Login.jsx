import { useState, useContext, useRef, useEffect } from 'react'
import  {Context } from '../../context.js';
import { Link } from 'react-router-dom';

const Login = () => {
    const form = useRef();
    const [msgError, setMsgError] = useState("")
    const {apiLink, setToken, setCurrentUser, currentUser,token, navigate, loggedInCoond} = useContext(Context)

    useEffect(() => {
        if(loggedInCoond) {
            navigate("/")
        }
    })    
    const login = async (e) => {
        e.preventDefault();
        try {
        const formData = new FormData(form.current);
        const username = formData.get("username").trim();
        const password = formData.get("password");        
        const res = await fetch(`${apiLink}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",           
            },
            body: JSON.stringify({username, password})                      
        })
        const data = await res.json();      
        if(res.status == 200) {
            setToken(data.token)           
            
            setCurrentUser(data.user) 
        } else {
            throw data.msg
        }
        } catch (error) {
            setMsgError(error)
        }       
    }
    return(        
    <div className="form-wrap container">
        <form  onSubmit={login} ref={form}>           
            <div className='form-header'>
                <legend>Sign in</legend>
            </div>
            <div className="form-body">
                <input required type="text"  placeholder='Username' name='username'/>
                <input required type="password"  placeholder='Password' name='password'/>
                {msgError != "" ? <div className='error'><h1>{msgError}</h1></div> : null}
            <button>Sign in</button>
            </div>
            <div className='form-footer'>
                <p>Don't have an account?</p>
                <Link to="/register">Sign up now</Link>
            </div>
        </form>
    </div>
    )
}

export default Login
