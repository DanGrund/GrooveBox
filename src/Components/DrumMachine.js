import React from 'react';
import DrumRack from './DrumRack'
import { Link } from 'react-router';

const DrumMachine = (props) => {
  const spaceBar = (e) =>{
    if(e.charCode===32){
      props.playPause();
    }
  }

  return(
    <div id='drum-machine-container' tabIndex='0' onKeyPress={(e)=>spaceBar(e)}>

      <div id='play-controls'>
        <h1 id="drum-logo">VaporGrooves</h1>
        <div id='tempo-slider'>
          <input type="range" min="100" max="375" value={props.tempo} onChange={(e)=>props.updateTempo(e)} />
          <p>- tempo +</p>
        </div>
        <button id='play-button' onClick={()=>props.playPause()} >
          play/pause
        </button>
        <Link to={'/visualizer'}>
          <button id='visuals-link'>
            visualizer
          </button>
        </Link>
        <Link to={'/instructions'}>
          <button id='instructions-link'>
            instructions
          </button>
        </Link>
      </div>

      <div id='drum-racks'>
        {Object.keys(props.drumRacks).map((drumRack, i) =>
          <DrumRack key={i}
                    name={drumRack}
                    steps={props.drumRacks[drumRack]}
                    toggleStep={props.toggleStep}
                    currentStep={props.currentStep}
          />
        )}
      </div>

    </div>
  )
}

export default DrumMachine
