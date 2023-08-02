import { useState, useContext, useEffect } from 'react'
import { Context } from "../../context"

import { Link } from 'react-router-dom';


//Svg setting


const HeaderChats = ({setSearchKey}) => {

    return(
    <header className='header-chats'>
        <nav>
            <ul>
                <li>
                    <Link to={"/settings"}><svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Z"/></svg></Link>
                </li>
                <li>
                    <h1>Chats</h1>
                </li>
                <li>
                    <Link to={"/damn"}><svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30"><path d="M453-280h60v-166h167v-60H513v-174h-60v174H280v60h173v166Zm27.266 200q-82.734 0-155.5-31.5t-127.266-86q-54.5-54.5-86-127.341Q80-397.681 80-480.5q0-82.819 31.5-155.659Q143-709 197.5-763t127.341-85.5Q397.681-880 480.5-880q82.819 0 155.659 31.5Q709-817 763-763t85.5 127Q880-563 880-480.266q0 82.734-31.5 155.5T763-197.684q-54 54.316-127 86Q563-80 480.266-80Z"/></svg></Link>
                </li>
            </ul>            
        </nav>
        <div className='search-field'>
         <input type="text" onChange={(e) => {
            setSearchKey(e.target.value)
         }}placeholder='Search for message or user' />

        </div>
    </header>
    )
}

export default HeaderChats


