import React from 'react'
import {useNavigate} from "react-router-dom"
//export var CurrentUserContext = createContext({id:0, name:'default user'});
const Home = ({socket}) => {
    const navigate = useNavigate()
    //const [currentUser, setCurrentUser] = useState();
    async function handleSubmit(e){
        e.preventDefault();
        localStorage.clear();
        await socket.connect();
        socket.on("loadMessages", data=>localStorage.setItem('LoadedBotMessages', JSON.stringify(data)));
        navigate("/chat");
    }
  return (  
    
      <form className="home__container" onSubmit={handleSubmit}>
        <h2 className='home__header'>Hello! Welcome to the web application "Chat"</h2>
        <button className='home__cta'>Create name of user</button>
      </form>  
  )
}
export default Home