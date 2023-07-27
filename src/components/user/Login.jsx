import { useState, useContext, useRef } from 'react'
import  {Context } from '../../context.js';

const Login = () => {
    const form = useRef();
    const {apiLink, setToken, setCurrentUser} = useContext(Context)
    const login = async (e) => {
        e.preventDefault();
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
        setToken(data.token)
        const user = await fetch(`${apiLink}/users/current`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${data.token}`,           
            }                      
        })
        setCurrentUser(await user.json())        
    }
    return(<form onSubmit={login} ref={form}>
        <input type="text" name='username'/>
        <br />
        <input type="password" name='password' />
        <br />
        <button>Login</button>
    </form>)
}

export default Login
