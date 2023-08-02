import { useState, useContext, useEffect } from 'react'
import { Context } from "../../context"
import moment from "moment"
const ChatPreview = ({chat}) => {   
    const {apiLink, setToken, currentUser ,setCurrentUser, token, navigate, loggedInCoond, chats} = useContext(Context);


    const getPartner = async ()=> {        
        const res = await fetch(`${apiLink}/users/${currentUser._id}/search?searchKey=${chat.participants.filter((party) =>  party.id != currentUser._id)[0].username}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,           
            }                      
            })
        const data = await res.json(); 
        const partner  = await data.data[0];        
        setPartner(partner)
    }

    const [partner, setPartner] = useState({});

    useEffect(() => {       
        getPartner();        
    }, [chat])
    
    
    
    
    

    const [date, setDate] = useState("")
    useEffect(() => {
        let dateDb = chat.messages[chat.messages.length-1].createdAt
        let dateMoment = moment(dateDb)
        if(moment(new Date()).format("L") == dateMoment.format("L")){
            setDate(dateMoment.format("LT"))
        } else  {
            if(dateMoment.format("Y") != moment(new Date()).format("Y")) {
                setDate(dateMoment.format("L"))
            } else {
                //Same year condition

                //Different month, same week condition
                if(
                    dateMoment.format("M") != moment(new Date()).format("M") 
                    &&
                    Math.abs(dateMoment.format("M") - moment(new Date()).format("M")) == 1
                    &&
                    Math.abs(Math.abs(dateMoment.format("D") - 31) - moment(new Date()).format("D")) < 8   
                    &&
                    moment(new Date()).format("d") >  dateMoment.format("d")   

                ) {
                    setDate(dateMoment.format("dddd"))
                } 
                //Same month, same week
                else if(dateMoment.format("M") == moment(new Date()).format("M") 
                && Math.abs(dateMoment.format("D") - moment(new Date()).format("D")) < 8 ) {
                    setDate(dateMoment.format("dddd"))
                }
                else  {
                    setDate(dateMoment.format("MMM D"))
                }                
            }
            
        }
    }, [chat])
    
    return(<li key={chat._id} className='chat-preview'>
        
        
        <div >
            {Object.keys(partner).length > 0 ?   
            <h1>{partner.name.first + " " + partner.name.last}</h1>
            : null}
           
            {chat.messages.length > 0 ?<p>{chat.messages[chat.messages.length-1].text}</p> : null}
        </div>

        <div >
            <h2>{date}</h2>
        </div>
        
    </li>)
}


export default ChatPreview