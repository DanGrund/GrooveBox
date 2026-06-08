import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import P5Wrapper from './P5Wrapper';
import sketch from './visualizer-sketch';

const Visualizer = () => {
  const props = useOutletContext();

  const handleKey = (e) => {
    props.toggleMute(e.keyCode);
    if (e.keyCode === 32) {
      e.preventDefault();
      props.playPause();
    }
  };

  return (
    <div id="visualizer-container" tabIndex="0" onKeyDown={handleKey}>
      <P5Wrapper
        sketch={sketch}
        drumRacks={props.drumRacks}
        currentStep={props.currentStep}
        mute={props.mute}
        toggleCanvas={props.toggleCanvas}
      />
      <div id="links-wrapper">
        <Link to="/drummachine">
          <button id="drums-link">back to the drums</button>
        </Link>
        <Link to="/instructions">
          <button id="instructions-link">I need more instruction</button>
        </Link>
      </div>
      <span id="instructions">
        (pro tip!) you can play a tune with your keyboard's home row, start/stop your loop with space bar,
        and mute individual drum tracks with keys 1-5. if you experience performance issues, kill the canvas
        with the '9' key before you leave the visualizer
      </span>
    </div>
  );
};

export default Visualizer;
