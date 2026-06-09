import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './Components/App';
import DrumMachine from './Components/DrumMachine';
import './reset.css';
import './cleanStyles.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/drummachine" replace />} />
        <Route path="instructions" element={<Navigate to="/drummachine" replace />} />
        <Route path="visualizer" element={<Navigate to="/drummachine" replace />} />
        <Route path="drummachine" element={<DrumMachine />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
