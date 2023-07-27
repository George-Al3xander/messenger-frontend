import { useState, useContext, useEffect } from 'react'
import { Context } from "../context"



const Chats = () => {

    const {apiLink, token, currentUser} = useContext(Context);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const getChats = async () => {
            const chats = await fetch(`${apiLink}/rooms/${currentUser._id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,           
                }                      
            })
            setChats(await chats.json().rooms)
        }
        getChats();
    }, [])

    return(<ul className='chats'>
        <h1>Chats</h1>
        {chats.length > 0 ? chats.map((chat) => {
            return <h1>{chat._id}</h1>
        }) : null}
    </ul>)
}

export default Chats