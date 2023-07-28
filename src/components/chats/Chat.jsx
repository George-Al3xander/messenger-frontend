import { useParams } from 'react-router-dom';
    import { useState, useContext, useEffect } from 'react'
import { Context } from "../../context"
import Message from '../messages/Message';




const Chat = () => {
    const {id} = useParams();    
    const {apiLink, setToken, currentUser ,setCurrentUser, token, navigate, loggedInCoond} = useContext(Context);

    useEffect(() => {
        if(!loggedInCoond) {
            navigate("/login")
        }        
    }, [currentUser])
    const [chat, setChat] = useState({});
    const [messages, setMessages] = useState({});
    const [partner, setPartner] = useState({});
    const getChat = async () => {
        const res = await fetch(`${apiLink}/rooms/${currentUser._id}/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,           
            }                      
        })

        if(res.status == 200) {
            const data = await res.json();
            console.log(await data)
            setChat(data)
        } else {
           
        }
    }
    const getMessages = async (chatId) => {
        let messages = await fetch(`${apiLink}/rooms/${currentUser._id}/${chatId}/messages`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,           
            }                      
        })
        messages = await messages.json();
        setMessages(messages)
    }
    useEffect(() => {
        getChat();
    }, []);
    useEffect(() => {
        if(chat._id && chat.participants) {
            getMessages(chat._id)
            setPartner(chat.participants.filter((party) =>  party.id != currentUser._id)[0])
        }
    },[chat])
    return(<div>
        <h1>{chat._id}</h1>
        

        {messages.length > 0 ? messages.map((message) => {
            return <Message partner={partner} message={message} /> 
        }) : null}

        <input type="text" /><button>Send</button>
    </div>)
}

export default Chat
