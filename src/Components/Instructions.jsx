import React from 'react';

const Instructions = ({ onDismiss }) => (
  <div className="instructions-backdrop" onClick={onDismiss}>
    <div className="instructions-card" onClick={(e) => e.stopPropagation()}>
      <h1>Vapor Grooves</h1>
      <h3>instructions</h3>
      <li>toggle the switches to build a drum loop</li>
      <li>press <strong>space</strong> to play / pause</li>
      <li>head to the visualizer for wavy visuals and a hidden home-row synth</li>
      <li>mute individual tracks with keys <strong>1–5</strong></li>

      <button id="link-to-drums" onClick={onDismiss}>groove</button>
      <p>built with React, p5js, and a little bit of nostalgia</p>
    </div>
  </div>
);

export default Instructions;
