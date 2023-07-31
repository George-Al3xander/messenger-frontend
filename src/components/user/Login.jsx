import { useState, useContext, useRef, useEffect } from 'react'
import  {Context } from '../../context.js';

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
        const username = formData.get("username");
        const password = formData.get("password")
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
    <form onSubmit={login} ref={form}>
        {msgError != "" ? msgError : null}
        <br />
        <input required type="text" name='username'/>
        <br />
        <input required type="password" name='password' />
        <br />
        <button>Login</button>
    </form>
    )
}

export default Login
