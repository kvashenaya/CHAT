import React, {useState} from 'react'
import { Card, CardImg, CardText, CardBody, CardTitle } from "reactstrap";
const ChatBar = ({chatBots, users, chooseChat, chooseUser, currentUser}) => {
    const [query, setQuery] = useState('');
    const [stateOnline, setStateOnline] = useState(true);

    const filteredChatUsers = users?users.filter(user=>user.name.toLowerCase().includes(query.toLowerCase())
    ):null;

    const handleSearchInputChange = (event) => {
    setQuery(event.target.value);
    };
    
    const onlineOrAllBotsFiltered = chatBots?((stateOnline)?chatBots.filter(bot=>{ return bot.status==='online' && 
        bot.name.toLowerCase().includes(query.toLowerCase())})
        :chatBots.filter(bot=>bot.name.toLowerCase().includes(query.toLowerCase()))):null;
    
    const onlineClick = () =>{  
        setStateOnline(true);
        }

    const allClick = () =>{ 
        setStateOnline(false);
        }

  return (
    <div className='chat__sidebar'>
        <div>
            <div className='block_inline'>
                <div onClick={onlineClick} className='elem_inline'>Online</div>
                <div onClick={allClick} className='elem_inline'>All</div>
            </div>

            <div className='chat__users'>
            {onlineOrAllBotsFiltered?onlineOrAllBotsFiltered.map(bot => 
            <Card className='chat__user' onClick={()=>chooseChat(bot.name)} key={bot.id}>
                    <CardImg style={{width:"25%", display:'inline-block'}} src={bot.photo} alt={bot.name} />
                    <CardBody style={{marginLeft:"4%", width:"70%", display:'inline-block'}}>
                        <CardTitle style={{fontSize: '16px'}}>{bot.name}</CardTitle>
                        <CardText style={{fontSize: '13px', color: 'grey'}}>{bot.description}</CardText>
                    </CardBody>
            </Card>
            ):null}
            </div>
            <h4 className='chat__header'>Users:</h4>
            <div className='chat__users'>
                {filteredChatUsers?filteredChatUsers.map(user => {if(user.id!==currentUser.id){
                    return(
                <Card className='chat__user' onClick={()=>{chooseUser(user)}} key={user.id}>
                    <CardImg src="https://www.creativefabrica.com/wp-content/uploads/2019/02/User-icon-EPS10-by-Kanggraphic-580x386.jpg" style={{width:"25%", display:'inline-block'}} />
                    <CardBody style={{marginLeft:"4%", width:"70%", display:'inline-block'}}>
                        <CardTitle style={{fontSize: '16px'}}>{user.name}</CardTitle>
                    </CardBody>
                </Card>)}}):null} </div>
        
            <input
                style={{width:'100%'}}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleSearchInputChange}
            />  
            {(currentUser)?
            <div className='chat__user' key={currentUser.id}>
                    <span style={{marginLeft:'7%', width:"22%", display:'inline-block'}}>You: </span>
                    <span style={{display:'inline-block'}}>{currentUser.name}</span>
            </div> : null}
        </div>
  </div>
  )
}

export default ChatBar