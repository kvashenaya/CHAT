import React from 'react';

const UserChat = ({messages, currentUser, activeUser}) => {  
  return (
  <div>           
              {(messages.map(m=>
                    (m.idFrom === currentUser.id)?        
                    <div className="message__chats" key={m.idFrom}>
                      <div className="send_title"><p className='sender__name'>You</p></div>
                      <div className='sender'>
                      <div><p>{m.text}</p></div>
                      </div>
                    </div>
                    :null

                    (m.idTo === activeUser.id)?
                    <div className="message__chats" key={m.idTo}>
                      <div className="rec_title"><p>{m.nameTo}</p></div>
                      <div className='recipient'>
                        <p>{m.text}</p>
                      </div>
                    </div>
                   :null))}
                    
                </div>)
}

export default UserChat