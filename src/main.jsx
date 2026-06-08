import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './Components/App';
import Instructions from './Components/Instructions';
import DrumMachine from './Components/DrumMachine';
import Visualizer from './Components/Visualizer';
import './reset.css';
import './cleanStyles.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/instructions" replace />} />
        <Route path="instructions" element={<Instructions />} />
        <Route path="drummachine" element={<DrumMachine />} />
        <Route path="drummachine/*" element={<DrumMachine />} />
        <Route path="visualizer" element={<Visualizer />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
