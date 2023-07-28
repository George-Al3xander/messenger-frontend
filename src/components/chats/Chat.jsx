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
    const partner = chat.participants.filter((party) =>  party.id != currentUser._id)[0] || {};
    const getChat = async () => {
        const res = await fetch(`${apiLink}/rooms/${currentUser._id}/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,           
            }                      
        })
        const data = await res.json();
        setChat(data)
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
        if(Object.keys(chat).length > 0) {
            getMessages(chat._id)
        }
    },[chat])
    return(<div>
        <h1>{chat._id}</h1>
        

        {messages.length > 0 ? messages.map((message) => {
            return <Message partner={partner} message={message} /> 
        }) : null}
    </div>)
}

export default Chat