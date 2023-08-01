import { useState, useContext, useEffect } from 'react'
import { Context } from "../../context"

const ChatPreview = ({chat}) => {    
    const {currentUser } = useContext(Context)
    const partner = chat.participants.filter((party) =>  party.id != currentUser._id)[0]
    
    return(<li className='chat-preview'>
        <h1>{partner.username}</h1>
        {chat.messages.length > 0 ?<p>{chat.messages[chat.messages.length-1].text}</p> : null}
    </li>)
}


export default ChatPreview