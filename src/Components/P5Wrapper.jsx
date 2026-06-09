// SHOUTOUT to https://github.com/NeroCor for the original p5/React component

import React, { useEffect, useRef } from 'react';
import p5 from './p5-with-sound';

const P5Wrapper = ({ sketch, ...props }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  // Create the p5 instance once, tear it down on unmount.
  useEffect(() => {
    canvasRef.current = new p5(sketch, wrapperRef.current);
    return () => {
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
    };
  }, [sketch]);

  // Push new props into the sketch when the drum state actually changes.
  useEffect(() => {
    canvasRef.current?.reDraw?.(props);
  }, [props.currentStep, props.drumRacks, props.mute]);

  return <div ref={wrapperRef}></div>;
};

export default P5Wrapper;
