import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DrumRack from './DrumRack';
import Instructions from './Instructions';
import Visualizer from './Visualizer';
import { useDrumKeyHandler } from './hooks';

const DrumMachine = () => {
  const props = useOutletContext();
  const handleKey = useDrumKeyHandler(props);

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
        <button id="visuals-link" onClick={props.openVisualizer}>
          visualizer
        </button>
        <button id="instructions-link" onClick={props.openInstructions}>
          instructions
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

      {props.showVisualizer && <Visualizer onDismiss={props.closeVisualizer} />}
      {props.showInstructions && <Instructions onDismiss={props.closeInstructions} />}
    </div>
  );
};

export default DrumMachine;
