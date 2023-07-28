import { useState, useContext, useEffect } from 'react'
import { Context } from "../context"
import ChatPreview from './chats/ChatPreview';
import { Link } from 'react-router-dom';



const Chats = () => {

    const {apiLink, setToken, currentUser ,setCurrentUser, token, navigate, loggedInCoond} = useContext(Context)
    const [chats, setChats] = useState([]);

    const getChats = async () => {
        let chatsDb = await fetch(`${apiLink}/rooms/${currentUser._id}/`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,           
            }                      
        })
        chatsDb = await chatsDb.json();
        return chatsDb
    }

    const getMessages = async (chatId) => {
        let messages = await fetch(`${apiLink}/rooms/${currentUser._id}/${chatId}/messages`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,           
            }                      
        })
        messages = await messages.json();
        return messages
    }

    useEffect(() => {
        if(!loggedInCoond) {
            navigate("/login")
        } else {
           const getDone = async () => {
                let messages; 
                let chatsDb = await getChats();
                chatsDb = Promise.all(chatsDb.map(async (chatDb) => {
                    messages = await getMessages(chatDb._id);
                    return {...chatDb,messages}
                    }))
                setChats(await chatsDb)
            }

           getDone()
        }        
    }, [currentUser])
    //"64c1f44f0d727b6f031474d0" - chat ID
    return(<ul className='chats'>
        <button onClick={async () => {               
        }} >Click</button>
        <h1>Chats</h1>
        {chats.length > 0 ? chats.map((chat) => {
            return <Link to={"/chats/" + chat._id}><ChatPreview chat={chat}/></Link>
        }) : null}
    </ul>)
}

export default Chats