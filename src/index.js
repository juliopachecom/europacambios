import React from 'react';
import ReactDOM from 'react-dom/client';
import './Assets/Scss/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DataContextProvider } from './Context/dataContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DataContextProvider>
      <App />
    </DataContextProvider>
  </React.StrictMode>
);