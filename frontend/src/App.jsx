import React from 'react'
import AppRoutes from './routes/AppRoutes.jsx'
import './App.css'
import { CartProvider } from './context/CartContext';
import { SquadProvider } from './context/SquadContext';
import { ToastProvider } from './context/ToastContext';

function App() {

  return (
    <CartProvider>
      <SquadProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </SquadProvider>
    </CartProvider>
  )
}

export default App
