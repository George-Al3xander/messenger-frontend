import { useState, useContext, useEffect } from 'react'
import { Context } from "../../context"

import { Link } from 'react-router-dom';


const HeaderChat = ({partner}) => {
    return(
        <header className='header-chat'>
            <Link to={"/"}><svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M359-242 120-481l239-239 43 43-166 166h604v60H236l166 166-43 43Z"/></svg></Link>

            <h1>{partner.name ? partner.name.first + " " + partner.name.last : null}</h1>
        </header>
    )
} 

export default HeaderChat