import { useState, useContext, useRef, useEffect } from 'react'
import  {Context } from '../../context.js';
import { Link } from 'react-router-dom';

const Register = () => {
    const form = useRef();
    const usernameValid = new RegExp(/^(?=(?:[0-9_]*[a-z]){3})[a-z0-9_]{5,}$/);
    const passwordValid = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*_)(?!.*\W)(?!.* ).{8,16}$/);
    const [usernameValidStatus, setUsernameValidStatus] = useState(true)
    const [passwordValidStatus, setPasswordValidStatus] = useState(true)
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(true);
    const [creationStatus, setCreationStatus] = useState(false);
    const [msgError, setMsgError] = useState([]);
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
            if(formData.get("password").trim() !== formData.get("confirm-password").trim()) {
                setConfirmPasswordValid(false)
                throw "Passwords don't match"
            } else {
                setConfirmPasswordValid(true)

            }
            const data = await res.json();
                if(res.status == 200) {
                    setMsgError("")
                    setUsernameValidStatus(true)
                    setPasswordValidStatus(true)
                    setCreationStatus(true)           
                } else {
                    if(usernameValid.test(formData.get("username").trim()) == false) {
                        setUsernameValidStatus(false)
                    } else {
                        setUsernameValidStatus(true)
                    }
                    if(passwordValid.test(formData.get("password").trim()) == false) {
                        setPasswordValidStatus(false)
                    } else {
                        setPasswordValidStatus(true)
                    }
                    throw data.msg
                }
            } catch (error) {                
                setMsgError(error.split("--"))
            }        
 
    }

    return(
        <div className="form-wrap container">
        <form  onSubmit={register} ref={form}>           
            <div className='form-header'>
                <legend>Sign up</legend>
            </div>
            {creationStatus ? 
            <div className='form-footer'>
                <h1>User created!</h1>
                <Link to="/login">Log in</Link>
             </div>
            :
            <>
                <div className="form-body">
                {usernameValidStatus ? 
                <input required type="text" placeholder='Username' name='username'/> : 
                <input style={{border: "2px solid red"}} required type="text" placeholder='Username' name='username'/>
                }
                <input name='first-name' required placeholder='First name' type="text" />
                <input name='last-name' placeholder='Last name' type="text" />

                {passwordValidStatus ? 
                <input required type="password" placeholder='Password' name='password' /> 
                : 
                <input style={{border: "2px solid red"}} required type="password" placeholder='Password' name='password' />}
                
                {confirmPasswordValid ? 
                <input required type="password" placeholder='Confirm password' name='confirm-password' />
                :
                <input style={{border: "2px solid red"}} required type="password" placeholder='Confirm password' name='confirm-password' />
                }
                {msgError.length > 0 ? <div className='error'>{msgError.map((err) => {
                    return <h1 key={err}>{err}</h1>
                })}</div> : null}
                <button>Sign up</button>
                </div>
                <div className='form-footer'>
                    <p>Alredy have an account?</p>
                    <Link to="/login">Log in</Link>
                </div>
            </>
            
            }
            
        </form>
    </div>    
    )
}


export default Register