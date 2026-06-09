import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Howl } from 'howler';
import { useLatestRef } from './hooks';

const emptyLoop = () => new Array(16).fill(false);

const defaultRacks = () => ({
  E40: emptyLoop(),
  Kick: [false,false,false,false,true,false,false,false,true,false,false,false,true,false,false,false],
  Clap: [false,false,true,false,false,false,true,false,false,false,true,false,false,false,true,false],
  ClosedHat: [false,true,true,true,true,true,true,true,true,false,true,false,true,false,true,true],
  OpenHat: emptyLoop(),
});

const emptyRacks = () =>
  Object.fromEntries(Object.keys(defaultRacks()).map((k) => [k, emptyLoop()]));

const MUTE_KEYS = { 49: 'E40', 50: 'Kick', 51: 'Clap', 52: 'ClosedHat', 53: 'OpenHat' };

export default function App() {
  const [drumRacks, setDrumRacks] = useState(defaultRacks);
  const [mute, setMute] = useState({
    Kick: false, OpenHat: false, ClosedHat: false, Clap: false, E40: false,
  });
  const [playMusic, setPlayMusic] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tempo, setTempo] = useState(200);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showVisualizer, setShowVisualizer] = useState(false);

  // Refs let the setTimeout loop read the latest values without resubscribing.
  const playMusicRef = useLatestRef(playMusic);
  const drumRacksRef = useLatestRef(drumRacks);
  const muteRef = useLatestRef(mute);
  const tempoRef = useLatestRef(tempo);
  const stepRef = useLatestRef(currentStep);
  const e40ToggleRef = useRef(true);

  // Sounds are created once, not per-step — the original allocated 5+ Howl
  // instances on every tick which leaked audio buffers.
  const soundsRef = useRef(null);
  if (!soundsRef.current) {
    soundsRef.current = {
      E40Yup: new Howl({ src: ['Sounds/E40-Yup.mp3'] }),
      E40Nope: new Howl({ src: ['Sounds/E40-Nope.mp3'] }),
      Kick: new Howl({ src: ['Sounds/Kick.mp3'] }),
      OpenHat: new Howl({ src: ['Sounds/OpenHat.mp3'] }),
      ClosedHat: new Howl({ src: ['Sounds/ClosedHat.mp3'] }),
      Clap: new Howl({ src: ['Sounds/Clap.mp3'] }),
    };
  }

  // One self-rescheduling timer, mounted once.
  useEffect(() => {
    let timeoutId;
    const tick = () => {
      if (playMusicRef.current) {
        const racks = drumRacksRef.current;
        const mutes = muteRef.current;
        const step = stepRef.current;
        const sounds = soundsRef.current;

        Object.keys(racks).forEach((key) => {
          if (!racks[key][step] || mutes[key]) return;
          if (key === 'E40') {
            const sample = e40ToggleRef.current ? sounds.E40Nope : sounds.E40Yup;
            sample.play();
            e40ToggleRef.current = !e40ToggleRef.current;
          } else {
            sounds[key].play();
          }
        });
        setCurrentStep((s) => (s + 1) % 16);
      }
      timeoutId = setTimeout(tick, tempoRef.current);
    };
    timeoutId = setTimeout(tick, tempoRef.current);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStep = useCallback((key, index) => {
    setDrumRacks((prev) => ({
      ...prev,
      [key]: prev[key].map((v, i) => (i === index ? !v : v)),
    }));
  }, []);

  const toggleMute = useCallback((keyCode) => {
    const name = MUTE_KEYS[keyCode];
    if (!name) return;
    setMute((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  const playPause = useCallback(() => setPlayMusic((v) => !v), []);
  const resetLoops = useCallback(() => setDrumRacks(emptyRacks()), []);
  const updateTempo = useCallback((e) => setTempo(+e.target.value), []);
  const openInstructions = useCallback(() => setShowInstructions(true), []);
  const closeInstructions = useCallback(() => setShowInstructions(false), []);
  const openVisualizer = useCallback(() => setShowVisualizer(true), []);
  const closeVisualizer = useCallback(() => setShowVisualizer(false), []);

  return (
    <div className="App">
      <Outlet context={{
        toggleStep, playPause, updateTempo, toggleMute,
        resetLoops, openInstructions, closeInstructions, openVisualizer, closeVisualizer,
        currentStep, drumRacks, tempo, mute, showInstructions, showVisualizer,
      }} />
    </div>
  );
}
