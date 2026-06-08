import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import DrumRack from './DrumRack';

const DrumMachine = () => {
  const props = useOutletContext();

  const handleKey = (e) => {
    props.toggleMute(e.keyCode);
    if (e.keyCode === 32) {
      e.preventDefault();
      props.playPause();
    }
  };

  return (
    <div id="drum-machine-container" tabIndex="0" onKeyDown={handleKey}>

      <div id="play-controls">
        <h1 id="drum-logo">VaporGrooves</h1>
        <div id="tempo-slider">
          <input type="range" min="100" max="375" value={props.tempo} onChange={props.updateTempo} />
          <p>- tempo +</p>
        </div>
        <button id="play-button" onClick={props.playPause}>
          play/pause
        </button>
        <button id="share-button" onClick={props.resetLoops}>
          reset
        </button>
        <Link to="/visualizer">
          <button id="visuals-link">
            visualizer
          </button>
        </Link>
        <Link to="/instructions">
          <button id="instructions-link">
            instructions
          </button>
        </Link>
        <button id="share-button" onClick={props.encrypt}>
          share
        </button>
      </div>

      <div id="drum-racks">
        {Object.keys(props.drumRacks).map((drumRack, i) => (
          <DrumRack
            key={i}
            name={drumRack}
            mute={props.mute}
            steps={props.drumRacks[drumRack]}
            toggleStep={props.toggleStep}
            currentStep={props.currentStep}
          />
        ))}
      </div>

    </div>
  );
};

export default DrumMachine;
