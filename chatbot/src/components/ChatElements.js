import React, { useEffect, useState} from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';

const ChatElements = ({socket}) => { 
  const [chatBots, setChatBots] = useState(JSON.parse(localStorage.getItem('Bots')));
  const [users, setUsers] = useState(JSON.parse(localStorage.getItem('Users')));
  const [currentUser, setCurrentUser] = useState({id:0, name:'default user'});

  const [typingStatus, setTypingStatus] = useState("");
  const [activeChat, setActiveChat] = useState("");
  const [activeUser, setActiveUser] = useState(null);

  const chooseChat = (chat) => {
    setActiveChat(chat);
    setActiveUser(null);     
  }
  const chooseUser = (user) => {
    setActiveUser(user);
    setActiveChat("");
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      socket.connect();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  useEffect(()=>{
    socket.on("getCurrentUser", data=>{
      localStorage.setItem('CurrentUser', JSON.stringify(data)); 
    });
    setCurrentUser(JSON.parse(localStorage.getItem('CurrentUser')))
  }, [socket]);

  useEffect(()=>{
    socket.on("getUsers", data=>{
      localStorage.setItem('Users', JSON.stringify(data));
      setUsers(JSON.parse(localStorage.getItem('Users')))
    });

    socket.on("getCurrentUser", data=>{
      localStorage.setItem('CurrentUser', JSON.stringify(data)); 
      setCurrentUser(JSON.parse(localStorage.getItem('CurrentUser')))
    });  
     
    socket.on("getData", data=>{
      localStorage.setItem('Bots', JSON.stringify(data));
      setChatBots(JSON.parse(localStorage.getItem('Bots')))
    });     
  });
 
  useEffect(()=>{    
    socket.on("getData", data=>localStorage.setItem('Bots', JSON.stringify(data)));    
    socket.on("getUsers", data=>localStorage.setItem('Users', JSON.stringify(data))); 
    setUsers(JSON.parse(localStorage.getItem('Users')))
    socket.on("typingResponse", data => setTypingStatus(data));
  }, [socket]);
  
  return (
    <div className="chat">  
      <div className='chat__main'>
        <ChatBody 
        socket={socket}
        botData={chatBots}
        activeChat={activeChat}
        activeUser={activeUser}
        typingStatus={typingStatus} 
        currentUser={currentUser}
        />
      </div>
      <ChatBar chooseChat={chooseChat}
      chooseUser={chooseUser}
      chatBots={chatBots} 
      currentUser={currentUser}
      users={users}
      socket={socket}/>
    </div>
  )
}

export default ChatElements
  
  
  