import { useParams } from 'react-router-dom';
    import { useState, useContext, useEffect, useRef } from 'react'
import { Context } from "../../context"
import Message from '../messages/Message';




const Chat = () => {
    const {id} = useParams();    
    const {apiLink, setToken, currentUser ,setCurrentUser, token, navigate, loggedInCoond, chats} = useContext(Context);

    useEffect(() => {
        if(!loggedInCoond) {
            navigate("/login")
        }        
    }, [currentUser])
    const [chat, setChat] = useState({});
    const [mockStatus, setMockStatus] = useState(false);
    const input = useRef()
    const [messages, setMessages] = useState({});
    const [messageText, setMessageText] = useState("")
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
            setChat(data)
        } else {
            let arr = chats.filter((chat) => {
                let res = chat.participants.filter((party) => {
                    if(id == party.username) {
                        return true
                    }
                    return false
                })[0]                
                return res
            })[0]
            if(arr != undefined) {
                setChat(arr)
            } else{
                setMockStatus(true)
                console.log(1)
            }           
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

    const sendMessage = async () => {
        const valid = new RegExp(/\S/);
        if(valid.test(messageText)) {
            if(mockStatus) {
                const res = await fetch(`${apiLink}/rooms/${currentUser._id}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",           
                    },
                    body: JSON.stringify({partnerId: partner.id})                      
                }) 
                if(res.status == 200) {
                    let chatsDb = await fetch(`${apiLink}/rooms/${currentUser._id}/`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,           
                        }                      
                    })
                    chatsDb = await chatsDb.json();
                    let thisChat = chatsDb.filter((chat) => {
                        let result = chat.participants.filter((party) => {
                            if(id == party.username) {
                                return true
                            }
                            return false
                        })   
                        result = result.filter((party) => {
                            if(currentUser._id == party.username) {
                                return true
                            }
                            return false
                        })            
                        return result
                    })[0]

                    console.log(thisChat)
                }
            } else {
                await fetch(`${apiLink}/messages/${currentUser._id}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",           
                    },
                    body: JSON.stringify({roomId: chat._id, text: messageText.trim()})                      
                })  
                input.current.value = ""
                getMessages(chat._id)
            }
        }        
    }
    useEffect(() => {
        getChat();
    }, []);
    useEffect(() => {
        if(chat._id && mockStatus == false) {
            getMessages(chat._id)            
        }
    },[])


    const getPartner = async ()=> {
        const res = await fetch(`${apiLink}/users/${currentUser._id}/search?searchKey=${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,           
            }                      
            })
            const data = await res.json(); 
            const partner  = await data.data[0];
            setPartner(partner)
    }

    useEffect(() => {
        if(mockStatus == false && Object.keys(chat).length > 0) {           
            setPartner(chat.participants.filter((party) =>  party.id != currentUser._id)[0])
        } else {
            getPartner();
        }
    },[chat])

    
    return(<div>
        <h1>{Object.keys(partner).length !== 0 ? partner.username : null}</h1>
        {messages.length > 0 ? messages.map((message) => {
            return <Message partner={partner} message={message} /> 
        }) : null}

        <input ref={input} type="text" onChange={(e) => {                      
            setMessageText(e.target.value)
        }} /><button onClick={sendMessage}>Send</button>
    </div>)
}

export default Chat
