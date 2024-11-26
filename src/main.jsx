import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ColorProvider } from './contexts/ColorContext'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorProvider>
      <App />
    </ColorProvider>
  </React.StrictMode>,
)