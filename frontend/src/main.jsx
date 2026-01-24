import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './i18n';

createRoot(document.getElementById('root')).render(

    <ErrorBoundary>
        <App />
    </ErrorBoundary>

)
