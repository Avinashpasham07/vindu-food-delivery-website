import React from 'react'
import AppRoutes from './routes/AppRoutes.jsx'
import './App.css'
import { CartProvider } from './context/CartContext';
import { SquadProvider } from './context/SquadContext';
import { ToastProvider } from './context/ToastContext';

import { Toaster } from 'react-hot-toast';
import { requestForToken, onMessageListener } from './firebase';
import toast from 'react-hot-toast';

function App() {

  return (
    <CartProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <SquadProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </SquadProvider>
    </CartProvider>
  )
}

export default App
