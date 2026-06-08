// SHOUTOUT to https://github.com/NeroCor for the original p5/React component

import React, { useEffect, useRef } from 'react';
import p5 from './p5-with-sound';

const P5Wrapper = ({ sketch, toggleCanvas, ...props }) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const propsRef = useRef(props);
  propsRef.current = props;

  // Mount/unmount: create one p5 instance, tear it down properly on leave.
  useEffect(() => {
    if (toggleCanvas) toggleCanvas();
    canvasRef.current = new p5(sketch, wrapperRef.current);
    if (canvasRef.current.reDraw) canvasRef.current.reDraw(propsRef.current);

    return () => {
      if (toggleCanvas) toggleCanvas();
      if (canvasRef.current) {
        canvasRef.current.remove();
        canvasRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sketch]);

  // Push new props into the sketch as they arrive.
  useEffect(() => {
    if (canvasRef.current && canvasRef.current.reDraw) {
      canvasRef.current.reDraw(props);
    }
  });

  return <div ref={wrapperRef}></div>;
};

export default P5Wrapper;
