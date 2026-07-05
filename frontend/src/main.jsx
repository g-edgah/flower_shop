import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import { ToastContainer, Bounce, Slide, Zoom, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

const contextClass = {
  success: "bg-blue-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter >
        <App />
        <ToastContainer 
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          limit={1}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          toastClassName="custom-toast"
          toastStyle={{
            borderRadius: '12px',
            // fontSize: '14px',
            minHeight: '45px',  
            maxHeight: '45px',
            width: 'fit-content',
            // boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
          transition={Slide}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
