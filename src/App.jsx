import { useState, useContext } from 'react'
import { Context } from './context'
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from "./components/user/Login"
import Chats from "./components/Chats"
import Chat from "./components/chats/Chat"
//{Object.keys(currentUser).length !== 0  ? <h1>Welcome back, {currentUser.name.first}</h1> : null}
function App() {  
  const apiLink = "http://localhost:3000"
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const loggedInCoond = (Object.keys(currentUser).length !== 0 && token.length > 0)
  return (
    <Context.Provider value={{apiLink, token, setToken, currentUser, setCurrentUser, navigate, loggedInCoond}}>
        <h1>Hello</h1>
      <Routes>
        <Route path="/"  element={<Chats/>} />
        <Route path="/chats"  element={<Chats/>} />
        <Route path="/chats/:id"  element={<Chat />} />
        <Route path="/login" element={<Login />}/>    
      </Routes>      

    </Context.Provider>
  )
}

export default App
