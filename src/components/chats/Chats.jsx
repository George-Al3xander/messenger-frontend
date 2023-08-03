import { useState, useContext, useEffect} from 'react'
import { Context } from "../../context"
import ChatPreview from './ChatPreview';
import { Link } from 'react-router-dom';
import HeaderChats from '../headers/HeaderChats';



const Chats = () => {

    const {apiLink, setToken, currentUser ,setCurrentUser, token, navigate, loggedInCoond, setChats, chats} = useContext(Context)
    const [searchKey, setSearchKey] = useState("");
    const [searchUserStatus, setSearchUserStatus] = useState(false)
    const [searchResultUsers, setSearchResultUsers] = useState([])
    const [searchResultLocal, setSearchResultLocal] = useState([])    
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
        //console.log(messages)
        return messages
    }

    const search = async () => {
        const valid = new RegExp(`${searchKey.toLowerCase()}`);
        const res = await fetch(`${apiLink}/users/${currentUser._id}/search?searchKey=${searchKey}&status=full`, {
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

    const getDone = async () => {
        let messages; 
        let chatsDb = await getChats();
        chatsDb = Promise.all(chatsDb.map(async (chatDb) => {
            messages = await getMessages(chatDb._id);
            return {...chatDb,messages}
            }))
        chatsDb = await chatsDb;            
        chatsDb = chatsDb.sort((a,b) => {
            let date_a = a.messages[a.messages.length - 1].createdAt;
            let date_b = b.messages[b.messages.length - 1].createdAt;   
            return new Date(date_b) - new Date(date_a);
          })
        setChats(chatsDb)
    }

    useEffect(() => {
        if(!loggedInCoond) {
            navigate("/login")
        } else {           
           getDone()
        }        
    }, [])
   
    return(
    <div className='content'>
        <HeaderChats searchUserStatus={searchUserStatus} setSearchUserStatus={setSearchUserStatus}  setSearchKey={setSearchKey} />
        
        
        
        {searchUserStatus ? 

        searchResultUsers.length > 0 ? 
        
        searchResultUsers.map((user) => { 
            //className='chat-preview'
            //<h1>{partner.name.first + " " + partner.name.last}</h1>      
            return <Link to={"/chats/" + user.username}><div className='chat-preview'>
                <div>
                <h1>{user.name.first + " " + user.name.last }
                {/* <span>{`${user.username}`}</span> */}
                </h1>  
                <h2>{user.username}</h2>
                </div>
                
                </div>
                </Link>
        }) 
        : 
        <h1 className='error-msg'>No results :(</h1>
        :
        <ul className='chats'>
            {chats.length > 0 ? 

            searchResultLocal.length > 0 ? 
            searchResultLocal.map((chat) => {            
                return <Link key={chat._id} to={"/chats/" + chat._id}><ChatPreview chat={chat}/></Link>
            })

            :
            
            !new RegExp(/\S/).test(searchKey) ?

                        
            chats.map((chat) => {
                return <Link to={"/chats/" + chat._id}><ChatPreview chat={chat}/></Link>
            })

            :
            <h1 className='error-msg'>No results :(</h1>
            : 
            
            null
            }
        </ul>
        }
    </div>
    )
}

export default Chats