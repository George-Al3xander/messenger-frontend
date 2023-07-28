import { useState, useContext, useEffect } from 'react'
import { Context } from "../../context"

const ChatPreview = ({chat}) => {    
    const {currentUser } = useContext(Context)
    const partner = chat.participants.filter((party) =>  party.id != currentUser._id)[0]
    
    return(<li className='chat-preview'>
        <h1>{partner.username}</h1>
        <p>{chat.messages[0].text}</p>
    </li>)
}


export default ChatPreview