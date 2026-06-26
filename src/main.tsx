import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ImageProvider } from './components/ImageContext';
import { UserProvider } from './components/UserContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <ImageProvider>
        <App />
      </ImageProvider>
    </UserProvider>
  </StrictMode>,
);
