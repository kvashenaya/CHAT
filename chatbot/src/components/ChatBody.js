import React, {useState, useEffect, useRef} from 'react'
import { Card, CardImg, CardText, CardBody, CardTitle } from "reactstrap";
import Messages from "./chatBodies/Messages"
import UserChat from "./chatBodies/UserChat" 
// import { useLocalStorage } from 'react-use';

const ChatBody = ({socket, botData, activeChat, activeUser, currentUser, typingStatus}) => { 
  
  const [messagesEcho, setMessagesEcho] = useState([{
    text: "Hello world!", 
    name: "Echo bot", 
    id: `server${22}`,
    side: 'server'
  }])
  const [messagesReverse, setMessagesReverse] = useState([{
    text: "Hello world!", 
    name: "Reverse bot", 
    id: `server${11}`,
    side: 'server'
  }])
  const [messagesSpam, setMessagesSpam] = useState([{
    text: "Hello world!", 
    name: "Spam bot", 
    id: `server${33}`,
    side: 'server'
  }])
  const [messagesIgnore, setMessagesIgnore] = useState([{
    text: "Hello world! I'm going to ignore you", 
    name: "Ignore bot", 
    id: `server${44}`,
    side: 'server'
  }]);

  const [messagesRude, setMessagesRude] = useState([{
    text: "Hello world!", 
    name: "Rude bot", 
    id: `server${55}`,
    side: 'server'
  }]);

  const [message, setMessage] = useState("");
  const [messagesUser, setMessageUser] = useState([]);
  const chatWindowRef = useRef(null);

  const addMessage = (data) => { 
      if(data.name==="Echo bot"){setMessagesEcho([...messagesEcho, data])}
      else if (data.name==="Spam bot"){setMessagesSpam([...messagesSpam, data])}
      else if (data.name==="Reverse bot"){setMessagesReverse([...messagesReverse, data])}   
      else if(data.name==="Ignore bot"){setMessagesIgnore([...messagesIgnore, data])}
      else if(data.name==="Rude bot"){setMessagesRude([...messagesRude, data])}
    }

  const handleTyping = () => activeChat?socket.emit("typing:bot",`${activeChat} is typing`):socket.emit("typing:bot",`${activeUser.name} is typing`);

  const handleSendMessage = (e) => {
      e.preventDefault() 
      if(activeUser && message!==""){
        setMessageUser([
          {
            text: message, 
            idTo: activeUser.id,
            nameTo: activeUser.name,          
            idFrom: currentUser.id,
            nameFrom: currentUser.name
            }
        ])
        socket.emit("messageUser", 
          {
          text: message, 
          idTo: activeUser.id,
          nameTo: activeUser.name,          
          idFrom: currentUser.id,
          nameFrom: currentUser.name
          }
        )  
      }       
      else if(activeChat!=="" && message.trim()) {
        const messageObj = { 
          name: activeChat, 
          text: message,
          side: 'client'
          }
        addMessage([messageObj])
        socket.emit("message", messageObj)    
      }
      setMessage("");
    }

  const handleNewMessage = () => {
    const chatWindow = chatWindowRef.current;
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  useEffect(()=> {
    socket.on("messageResponse", data => { 
      addMessage(data);   
    })
    socket.on("messageUserResponse", data => setMessageUser(data))   
  })
  
  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    chatWindow.addEventListener('DOMNodeInserted', handleNewMessage);
    return () => {
    chatWindow.removeEventListener('DOMNodeInserted', handleNewMessage);
    };
  }, []);
  
  return (
    <>
      <header className='chat__mainHeader'>
        {(activeUser && activeChat==="")?
         <div>{activeUser.name}</div>
        :(activeChat!=="")?
          <Card height='18vh' key={botData.find(bot => bot.name === activeChat).id}>
                  <CardImg style={{width:"30%", height:'18vh', display:'inline-block'}} src={botData.find(bot => bot.name === activeChat).photo} alt={botData.find(bot => bot.name === activeChat).name} />
                  <CardBody style={{marginLeft:"4%", width:"65%",  display:'inline-block'}} >
                      <CardTitle style={{fontSize: '18px'}}>{activeChat}</CardTitle>
                      <CardText style={{fontSize: '15px', color: 'grey'}}>{botData.find(bot => bot.name === activeChat).description}</CardText>
                  </CardBody>
          </Card>
          :
          <div style={{display:'flex', justifyContent:'center'}}><p>{activeChat}</p></div>
        }
      </header>

        <div ref={chatWindowRef} className='message__container'>     
         {/* <ThemeContext.Consumer>{messageObj.name}</ThemeContext.Consumer> */}
          {(activeChat === "Reverse bot")?
          <Messages messages={messagesReverse} /> 
          :
          (activeChat === "Spam bot")?
          <Messages messages={messagesSpam}/> 
          :
          (activeChat === "Echo bot")?
          <Messages messages={messagesEcho}/>       
          :  
          (activeChat === "Ignore bot")?
          <Messages messages={messagesIgnore}/> 
          :
          (activeChat === "Rude bot")?
          <Messages messages={messagesRude}/> 
          :
          (!activeUser)?
          <div style={{display:'flex', justifyContent:'center', alignContent:'center'}}>
            <p style={{fontSize: '30px'}}>CHOOSE THE CHAT</p> 
          </div> : <UserChat messages={messagesUser} currentUser={currentUser} activeUser={activeUser}/>
          }
        </div>

        <div className="message__status">
  <p>{typingStatus}</p>
</div>


        {(activeChat !== "" || activeUser)?
        <div className='chat__footer'>
        <form className='form' onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder='Write message' 
            className='message' 
            value={message} 
            onChange={e => {setMessage(e.target.value); }}
            onKeyDown={handleTyping}
            />
            <button className="sendBtn">Send message</button>
        </form>
      </div>:
      <div style={{backgroundColor: '#e6f6ff',
        height: '10vh'}}>
      </div>}
    </>
  )
}
export default ChatBody
