import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <App />
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      style: {
                        fontFamily: '"DM Sans", sans-serif',
                        background: '#1C1C1C',
                        color: '#FAF9F6',
                        borderRadius: '2px',
                        padding: '12px 16px'
                      },
                      success: { iconTheme: { primary: '#C9A84C', secondary: '#FAF9F6' } },
                      error: { iconTheme: { primary: '#EF4444', secondary: '#FAF9F6' } }
                    }}
                  />
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
