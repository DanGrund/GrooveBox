import React from 'react';
import { useOutletContext } from 'react-router-dom';
import P5Wrapper from './P5Wrapper';
import sketch from './visualizer-sketch';
import { useDrumKeyHandler } from './hooks';

const Visualizer = ({ onDismiss }) => {
  const props = useOutletContext();
  const handleKey = useDrumKeyHandler(props);

  const showInstructions = () => {
    onDismiss();
    props.openInstructions();
  };

  return (
    <div id="visualizer-container" tabIndex="0" onKeyDown={handleKey}>
      <P5Wrapper
        sketch={sketch}
        drumRacks={props.drumRacks}
        currentStep={props.currentStep}
        mute={props.mute}
      />
      <div id="links-wrapper">
        <button id="drums-link" onClick={onDismiss}>back to the drums</button>
        <button id="instructions-link" onClick={showInstructions}>I need more instruction</button>
      </div>
      <span id="instructions">
        (pro tip!) play a tune with your keyboard's home row, start/stop your loop with space bar,
        and mute individual drum tracks with keys 1–5.
      </span>
    </div>
  );
};

export default Visualizer;
