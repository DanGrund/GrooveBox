import { useEffect, useRef } from 'react';

export function useLatestRef(value) {
  const ref = useRef(value);
  useEffect(() => { ref.current = value; }, [value]);
  return ref;
}

export function useDrumKeyHandler({ toggleMute, playPause }) {
  return (e) => {
    toggleMute(e.keyCode);
    if (e.keyCode === 32) {
      e.preventDefault();
      playPause();
    }
  };
}
