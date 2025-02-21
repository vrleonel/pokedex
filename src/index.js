import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa o ReactDOM a partir de 'react-dom/client'
import App from './App';
import './App.scss'; // Importa o arquivo de estilos SASS

// Cria uma raiz para o aplicativo
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza o aplicativo
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);