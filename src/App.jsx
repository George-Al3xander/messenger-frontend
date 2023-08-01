import { useState, useContext } from 'react'
import { Context } from './context'
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from "./components/user/Login"
import Register from "./components/user/Register"
import Chats from "./components/chats/Chats"
import Chat from "./components/chats/Chat"
//{Object.keys(currentUser).length !== 0  ? <h1>Welcome back, {currentUser.name.first}</h1> : null}
function App() {  
  const apiLink = "http://192.168.0.111:3000"
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);

  const [currentUser, setCurrentUser] = useState({});
  const loggedInCoond = (Object.keys(currentUser).length !== 0 && token.length > 0)
  return (
    <Context.Provider value={{apiLink, token,chats,setChats, setToken, currentUser, setCurrentUser, navigate, loggedInCoond}}>       
      <Routes>
        <Route path="/"  element={<Chats/>} />
        <Route path="/chats"  element={<Chats/>} />
        <Route path="/chats/:id"  element={<Chat />} />
        <Route path="/login" element={<Login />}/>    
        <Route path="/register" element={<Register />}/>    
      </Routes>      

    </Context.Provider>
  )
}

export default App
