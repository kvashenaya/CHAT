import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Home from "./components/Home"
import ChatElements from "./components/ChatElements";
import {io} from "socket.io-client"
import { BrowserRouter as Router } from "react-router-dom";

const URL = "http://localhost:4000";
const socket = io(URL, { autoConnect: false});
function App() {
  return (   
      <Router>
          <Routes>
            <Route path="/" element={<Home socket={socket}/>}></Route>
            <Route path="/chat" element={<ChatElements socket={socket}/>}></Route>
          </Routes>
      </Router>   
  );
}

export default App;