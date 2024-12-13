import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ParkingContextProvider } from './Context/ParkingContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ParkingContextProvider>
    <App />
    </ParkingContextProvider>
  </StrictMode>,
)
