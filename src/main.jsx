import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SavedPropertiesProvider } from './hooks/useSavedProperties'
import App from './App'
import { WhiteLabelProvider } from './hooks/useWhiteLabel'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WhiteLabelProvider>
      <SavedPropertiesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SavedPropertiesProvider>
    </WhiteLabelProvider>
  </React.StrictMode>,
)
