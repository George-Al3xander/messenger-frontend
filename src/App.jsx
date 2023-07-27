import { useState, useContext } from 'react'
import { Context } from './context'
import { Route, Routes } from 'react-router-dom';
import Login from "./components/user/Login"
import Chats from "./components/Chats"
//{Object.keys(currentUser).length !== 0  ? <h1>Welcome back, {currentUser.name.first}</h1> : null}
function App() {  
  const apiLink = "http://localhost:3000"
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  return (
    <Context.Provider value={{apiLink, token, setToken, currentUser, setCurrentUser}}>
      <Routes>
        <Route path="/login" element={token.length > 0 ?  null : <Login />}/>    
        <Route path="/chats"  element={<Chats />} />
      </Routes>      
     

    </Context.Provider>
  )
}

export default App
