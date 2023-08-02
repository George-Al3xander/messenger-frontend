
import { useState, useContext, useEffect, useRef } from 'react'
import { Context } from "../../context"
import moment from 'moment';
const Message = ({message, partner, messageIndex, messagesLength}) => {
    const {apiLink, setToken, currentUser ,setCurrentUser, token, navigate, loggedInCoond} = useContext(Context);
    const msgRef = useRef();    
    useEffect(() => {
        msgRef.current.focus();
    },[])
    return(<>

    {partner.id != message.userId ?
         <div tabIndex={messageIndex == messagesLength ? 0 : null} ref={msgRef} className='message message-user'>
            <div className='message-content'>
                <p>{message.text}</p>
            </div>           
            <div className='message-time'><h2>{moment(message.createdAt).format("LT")}</h2></div>
        </div>        
        : 
        
        <div tabIndex={messageIndex == messagesLength ? 0 : null} ref={msgRef} className='message message-partner'>
            <div className='message-content'>
                <p>{message.text}</p>
            </div>
            <div className='message-time'><h2>{moment(message.createdAt).format("LT")}</h2></div>
        </div>}   
    
    
    </>)
}

export default Message