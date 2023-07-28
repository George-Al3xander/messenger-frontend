import { useState, useContext, useRef, useEffect } from 'react'
import  {Context } from '../../context.js';


const Register = () => {
    const form = useRef();
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
        console.log(user)

    }

    return(
    <form onSubmit={register} ref={form}>
        {msgError != "" ? msgError : null}
        <br />
        <input required type="text" placeholder='username' name='username'/>
        <br />
        <input name='first-name' required placeholder='First name' type="text" />
        <input name='last-name' placeholder='Last name' type="text" />
        <br />
        <input required type="password" placeholder='password' name='password' />
        <br />
        <input required type="password" placeholder='confirm password' name='password' />
        <br />
        <button>Register</button>
    </form>
    )
}


export default Register