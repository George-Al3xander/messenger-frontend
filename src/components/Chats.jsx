import { useState, useContext, useEffect, useRef } from 'react'
import { Context } from "../context"
import ChatPreview from './chats/ChatPreview';
import { Link } from 'react-router-dom';



const Chats = () => {

    const {apiLink, setToken, currentUser ,setCurrentUser, token, navigate, loggedInCoond, setChats, chats} = useContext(Context)
    const [searchKey, setSearchKey] = useState("");
    const [searchResultUsers, setSearchResultUsers] = useState([])
    const [searchResultLocal, setSearchResultLocal] = useState([])
    const input = useRef()
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

    const search = async () => {
        const valid = new RegExp(`${searchKey.toLowerCase()}`);
       

       const res = await fetch(`${apiLink}/users/search?searchKey=${searchKey}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,           
        }                      
        })
        const data = await res.json();        
        setSearchResultUsers(await data.data);  
        
        let locals = chats.filter((chat) => {            
            return (
                valid.test(chat.participants[0].username.toLowerCase()) == true
                ||
                valid.test(chat.participants[1].username.toLowerCase()) == true
                ||
                chat.messages.some((message) => {
                    return valid.test(message.text.toLowerCase()) == true
                })
            ) 
        })
        setSearchResultLocal(locals)        
    }

    useEffect(() => {
        if(searchKey != "") {
            search();
        } else {
            setSearchResultUsers([])
            setSearchResultLocal([])
        }
        
    }, [searchKey])

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
   
    return(
    <>
    <div className='search-field'>
        <input type="text" onChange={() => {
            setSearchKey(input.current.value)
        }} ref={input} placeholder='What or who you looking for?' />
        {searchResultUsers.length > 0 ? searchResultUsers.map((user) => {            
            return <h2>{user.username}</h2>
        }) : null}
        {searchResultLocal.length > 0 ? searchResultLocal.map((chat) => {            
            return <Link to={"/chats/" + chat._id}><ChatPreview chat={chat}/></Link>
        }) : null}
    </div>
    
    <ul className='chats'>
        <button onClick={async () => {               
        }} >Click</button>
        <h1>Chats</h1>
        {chats.length > 0 ? chats.map((chat) => {
            return <Link to={"/chats/" + chat._id}><ChatPreview chat={chat}/></Link>
        }) : null}
    </ul>
    </>
    )
}

export default Chats