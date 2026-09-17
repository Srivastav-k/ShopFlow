import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './hooks/useCart';
import App from './App';
import './index.css';

// NOTE: @tanstack/react-query is installed but intentionally NOT configured.
// No QueryClient, no QueryClientProvider, no useQuery, no useMutation.
// This will be added later as part of caching learning.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
