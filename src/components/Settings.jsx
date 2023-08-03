import { useState, useContext, useEffect,  useRef } from 'react'
import { Context } from "../context"
import { Link } from 'react-router-dom';
import HeaderSettings from './headers/HeaderSettings';
const Settings = () => {    
    const {apiLink, currentUser, token,loggedInCoond,navigate, setCurrentUser} = useContext(Context);
    const [msgError, setMsgError] = useState("");    
    const [editStatus,  setEditStatus] = useState(false);
    const [changesStatus,  setChangesStatus] = useState(false);


    useEffect(() => {
        if(!loggedInCoond || !currentUser.name) {
            navigate("/login")
        }
    })

    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");    
    const blankValid = new RegExp(/\S/);

   useEffect(() => {           
        let user = {};        
        if(blankValid.test(username) && currentUser.username != username.trim()) {          
            user = {...user, username: username.trim()}
        }       
        if(blankValid.test(firstName) && currentUser.name.first != firstName.trim()) {          
            user = {...user, name: {...user.name, first: firstName.trim()}}
        } 
        if(blankValid.test(lastName) && currentUser.name.last != lastName.trim()) {            
            user = {...user, name: {...user.name, last: lastName.trim()}}
        }
        if(Object.keys(user).length > 0) {
            setChangesStatus(true)            
        } else {
            setChangesStatus(false)
            
        }    
   })

    const editUser = async (e) => {        
        e.preventDefault();
        setMsgError("")
        if(changesStatus) {
            const res = await fetch(`${apiLink}/users/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Authorization" : `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: blankValid.test(username)  ? username  : undefined, 
                    name: {
                    first: blankValid.test(firstName)  ? firstName  : undefined,
                    last: blankValid.test(lastName)  ? lastName  : undefined,
                }})
            })
            const data = await res.json()
            if(res.status == 200) {
                let updatedUser = await fetch(`${apiLink}/users/${currentUser._id}/current`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,           
                    }                      
                })
                updatedUser = await updatedUser.json()                
                setCurrentUser(updatedUser);
                setMsgError("")

                setEditStatus(false)
            } else {
                setMsgError(data.msg)
            } 
        }       
    }
    return (<div className='content'>
        <HeaderSettings />
        {
            currentUser.name ? 

            editStatus ? 
        <form  onSubmit={editUser} className='form-settings'>
            <fieldset>
                <label htmlFor="username">Username</label>                
                <input onChange={(e) => {
                    if(blankValid.test(e.target.value) && currentUser.username != e.target.value.trim()) {
                        setUsername(e.target.value)
                    } else {
                        setUsername("")
                    }
                    }
                    } id='username' type="text" placeholder='username' name='username' defaultValue={currentUser.username} />
            </fieldset>
            <fieldset>
                    <div>
                        <label htmlFor="name-first">First name</label>
                        <label htmlFor="name-last">Last name</label>
                    </div>                                     
                    <div>                       
                        <input onChange={(e) => {
                            if(blankValid.test(e.target.value) && currentUser.name.first != e.target.value.trim()) {
                                setFirstName(e.target.value)
                            } else {
                                setFirstName("")
                            }
                            }
                            
                            } type="text" placeholder='First name' name='name-first' id='name-first' defaultValue={currentUser.name.first}/>
                        <input onChange={(e) => {
                              if(blankValid.test(e.target.value) && currentUser.name.last != e.target.value.trim()) {
                                  setLastName(e.target.value)
                                }
                                else {
                                    setLastName("")
                                }
                              }      

                            } type="text" placeholder='Last name' name='name-last' id='name-last' defaultValue={currentUser.name.last}/>
                    </div>
            </fieldset>
            {msgError.length > 0 ? <div className='error'><h1>{msgError}</h1>
                </div> : null}
             <div>
                 {changesStatus ? <button>Submit</button> : <button className='btn-disabled' disabled >Submit</button>}
                 <button onClick={(e) => {e.preventDefault();setEditStatus(false)}}>Cancel</button>
             </div>
        </form>

        :

        currentUser ? 
        <div className='settings-user-info'>
            <div>
                <h1>{currentUser.username}</h1>
                <p>Username</p>
            </div>
            <div>
                <h1>{currentUser.name.first + " " + currentUser.name.last}</h1>
                <p>First and last name</p>
            </div>
            <button onClick={() => setEditStatus(true)}>Edit</button>
        </div>
        : 
        null

        :
        null
        }        
    </div>
    )
}


export default Settings