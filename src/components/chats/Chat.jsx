import { useParams } from 'react-router-dom';
    import { useState, useContext, useEffect, useRef } from 'react'
import { Context } from "../../context"
import Message from '../messages/Message';
import HeaderChat from '../headers/HeaderChat';
import Messages from '../messages/Messages';




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
                console.log("Existing chat, access through room id")
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
                    console.log("Existing chat, access through username")     
    
                    setChat(arr)
                } else{
                    console.log("Not existing chat, access through mock status")   
                    getPartner(); 
                    setMockStatus(true)                    
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

    const sendMessage = async (e) => {
        e.preventDefault();
        const valid = new RegExp(/\S/);
        if(valid.test(messageText)) {
            if(mockStatus == true) {
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
                        let partnerStatus = chat.participants.some((party) => {
                             return partner.id == party.id
                        }) 
                        let userStatus = chat.participants.some((party) => {
                            return currentUser._id == party.id
                       })         
                        return (partnerStatus && userStatus)
                    })[0]
                    
                    setChat(thisChat)
                    await fetch(`${apiLink}/messages/${currentUser._id}`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",           
                        },
                        body: JSON.stringify({roomId: thisChat._id, text: messageText.trim()})                      
                    })  
                    input.current.value = ""
                    setMockStatus(false)
                    getMessages(thisChat._id)                    
                    //navigate(`/chats/${thisChat._id}`)
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
        if(Object.keys(chat).length > 0 && mockStatus == false) {
            getMessages(chat._id) 
        }
    })

    useEffect(() => {        
        //console.log(partner)
        if(partner.name == undefined  && Object.keys(partner).length > 0) {
            const getFullPartner = async ()=> {        
                const res = await fetch(`${apiLink}/users/${currentUser._id}/search?searchKey=${partner.username}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,           
                    }                      
                    })
                const data = await res.json(); 
                const partnerDb  = await data.data[0]; 
                setPartner(partnerDb)
            }
            getFullPartner();
        }
    }, [partner])


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
        if(mockStatus == false && Object.keys(chat).length > 0 && Object.keys(partner).length == 0) {           
            setPartner(chat.participants.filter((party) =>  party.id != currentUser._id)[0])
        } 
    },[chat])

    function autoResize() {
        input.current.style.height = 'auto';
        input.current.style.height = input.current.scrollHeight + 'px';
    }

    
    
    return(
    <div className='chat'>        
        {Object.keys(partner).length > 0 ? <HeaderChat partner={partner}/> : null}        
        {/*
        <form onSubmit={sendMessage}>
            <input ref={input} type="text" onChange={(e) => {
                setMessageText(e.target.value)
            }} /><button >Send</button>
        </form> */}
        <div className="content">
       <Messages partner={partner} messages={messages}/>
        </div>
        <div className="message-input-field">
            <form onSubmit={sendMessage} className='message-input'>
            <textarea  ref={input}  onChange={(e) => {
                autoResize();
                setMessageText(e.target.value)
            }} wrap='off' placeholder='Type a message' name="message"  ></textarea>
                {new RegExp(/\S/).test(messageText) ? 
                    <button>Send</button>
                    :
                    null
                }
            </form>
        </div>        
    </div>
    )
}

export default Chat
