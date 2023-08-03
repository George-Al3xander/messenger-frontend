import { useState, useContext, useEffect,  useRef } from 'react'
import { Context } from "../../context"

import { Link } from 'react-router-dom';


//Svg setting
//Customize user request
// {async () => {
//     const user = {name: {
//         first: 'Tasty'
//     }}
//     const res = await fetch(`${apiLink}/users/${currentUser._id}`, {
//         method: "PUT",
//         headers: {
//             "Authorization" : `Bearer ${token}`,
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(user)
//     })
//     console.log(await res.json())
// }

const HeaderSettings = ({setSearchKey,searchUserStatus,
    setSearchUserStatus}) => {
    const input = useRef();
    const {apiLink, currentUser, token} = useContext(Context);
    return(
    <header className='header-settings'>
        <nav>
            <ul>
                <li>
                <Link to={"/"}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M359-242 120-481l239-239 43 43-166 166h604v60H236l166 166-43 43Z"/></svg></Link>
                </li>
                <li>
                    <h1>Settings</h1>
                </li>  
            </ul>            
        </nav>               
    </header>    
    )
}

export default HeaderSettings


