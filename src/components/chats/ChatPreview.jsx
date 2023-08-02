import { useState, useContext, useEffect } from 'react'
import { Context } from "../../context"
import moment from "moment"
const ChatPreview = ({chat}) => {    
    const {currentUser } = useContext(Context)
    const partner = chat.participants.filter((party) =>  party.id != currentUser._id)[0]
    const [date, setDate] = useState("")
    useEffect(() => {
        let dateDb = chat.createdAt
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
            <h1>{partner.username}</h1>
            {chat.messages.length > 0 ?<p>{chat.messages[chat.messages.length-1].text}</p> : null}
        </div>

        <div >
            <h2>{date}</h2>
        </div>
        
    </li>)
}


export default ChatPreview