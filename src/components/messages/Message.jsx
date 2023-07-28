import { useParams } from 'react-router-dom';
    import { useState, useContext, useEffect } from 'react'
import { Context } from "../../context"

const Message = ({message, partner}) => {
    const {apiLink, setToken, currentUser ,setCurrentUser, token, navigate, loggedInCoond} = useContext(Context);

    return(<>

    {/* {partner.id != message.userId ? <div className='message'>
        
        </div>: <div className='message'>
        
        </div>}    */}
    
    
    </>)
}

export default Message