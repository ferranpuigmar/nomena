import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/query-client'
import { AuthBootstrap } from './features/auth/providers/auth-bootstrap.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap />
      <App />
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </QueryClientProvider>
  </StrictMode>,
)
