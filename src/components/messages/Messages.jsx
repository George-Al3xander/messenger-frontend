import { useState, useEffect } from 'react'
import Message from './Message'
import moment from 'moment'

const Messages = ({messages, partner}) => {

    function removeDuplicateObjects(array, property) {
        const uniqueIds = [];
      
        const unique = array.filter(element => {
          const isDuplicate = uniqueIds.includes(element[property]);
      
          if (!isDuplicate) {
            uniqueIds.push(element[property]);
      
            return true;
          }
      
          return false;
        });
      
        return unique;
    }
    const [sortedMessages, setSortedMessages] = useState([])

    useEffect(() => {
        if(messages.length > 0) {
            let res = messages.map((message) => {
                let sorted = messages.filter((msg) => {
                    return moment(message.createdAt).format('L') == moment(msg.createdAt).format('L');
                })
                let obj = {date: moment(message.createdAt).format('L'), messages:sorted}
                return obj
            })
    
            res = removeDuplicateObjects(res, "date")        
            setSortedMessages(res)
        }
    }, [messages])
    return(
        <ul className='messages'>
            {sortedMessages.map((sorted) => {
                return <>   

                {(messages.length > 0 && Object.keys(partner).length > 0) ?             
                    <>
                    <h1 className='message-date'>
                    {moment(new Date()).format("YYYY") == moment(sorted.date).format("YYYY") ?
                    
                    moment(new Date()).format("L") == moment(sorted.date).format("L") ? 

                    "Today"
                    :

                    moment(sorted.date).format("MMM D")

                    :

                    moment(sorted.date).format("ll")
                    }</h1>

                    {sorted.messages.map((message) => {
                        return <Message messageIndex={messages.indexOf(message)} messagesLength={messages.length - 1}  partner={partner} message={message}/>
                    })}
                    </>
                    :
                    null}
                </>
                //
            })}
        </ul>
    )
}

export default Messages