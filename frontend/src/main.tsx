import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import router from './routes/route.index';
import { RouterProvider } from 'react-router-dom';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: 'rgba(15, 15, 30, 0.95)',
          border: '1px solid rgba(255,255,255,0.12)',
          color: '#fff',
          backdropFilter: 'blur(20px)',
        },
      }}
      richColors
    />
  </StrictMode>,
);