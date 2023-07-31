import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { HashRouter } from 'react-router-dom'
import { Context } from './context.js'
import "../src/index.css"

ReactDOM.createRoot(document.getElementById('root')).render(  
      <HashRouter>            
            <App/>            
      </HashRouter>    
  ,
)
