import React from 'react';

const RudeBot = ({messages}) => {  
  return (
        <div>           
          {(messages.map(m=>
                (m.side === "server")?
                <div className="message__chats" key={m.id}>
                  <div className="rec_title"><p>{m.name}</p></div>
                  <div className='recipient'>
                    <p>{m.text}</p>
                  </div>
                </div>
              :(m.side === "client")?         
                <div className="message__chats" key={m.id}>
                  <div className="send_title"><p className='sender__name'>You</p></div>
                  <div className='sender'>
                  <div><p>{m.text}</p></div>
                  </div>
                </div>:null ))}
          </div>
  )
}

export default RudeBot