import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Howl } from 'howler';
import CryptoJS from 'crypto-js';

const SECRET = 'secretkey123';

const emptyLoop = () => new Array(16).fill(false);

const defaultRacks = () => ({
  E40: emptyLoop(),
  Kick: [false,false,false,false,true,false,false,false,true,false,false,false,true,false,false,false],
  Clap: [false,false,true,false,false,false,true,false,false,false,true,false,false,false,true,false],
  ClosedHat: [false,true,true,true,true,true,true,true,true,false,true,false,true,false,true,true],
  OpenHat: emptyLoop(),
});

const emptyRacks = () => ({
  E40: emptyLoop(), Kick: emptyLoop(), Clap: emptyLoop(),
  ClosedHat: emptyLoop(), OpenHat: emptyLoop(),
});

export default function App() {
  const [drumRacks, setDrumRacks] = useState(defaultRacks);
  const [mute, setMute] = useState({
    Kick: false, OpenHat: false, ClosedHat: false, Clap: false, E40: false, Canvas: false,
  });
  const [playMusic, setPlayMusic] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tempo, setTempo] = useState(200);

  const navigate = useNavigate();
  const location = useLocation();

  // Refs let the setTimeout loop read the latest values without resubscribing.
  const playMusicRef = useRef(playMusic);
  const drumRacksRef = useRef(drumRacks);
  const muteRef = useRef(mute);
  const tempoRef = useRef(tempo);
  const stepRef = useRef(currentStep);
  const e40ToggleRef = useRef(true);
  useEffect(() => { playMusicRef.current = playMusic; }, [playMusic]);
  useEffect(() => { drumRacksRef.current = drumRacks; }, [drumRacks]);
  useEffect(() => { muteRef.current = mute; }, [mute]);
  useEffect(() => { tempoRef.current = tempo; }, [tempo]);
  useEffect(() => { stepRef.current = currentStep; }, [currentStep]);

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

  // Decrypt shared-loop URLs (/drummachine/<ciphertext>).
  useEffect(() => {
    if (!location.pathname.startsWith('/drummachine/')) return;
    const raw = location.pathname.slice('/drummachine/'.length);
    if (!raw) return;
    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(raw), SECRET);
      const data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setDrumRacks(data);
      navigate('/drummachine', { replace: true });
    } catch (err) {
      console.warn('Failed to decrypt shared loop', err);
      navigate('/drummachine', { replace: true });
    }
  }, [location.pathname, navigate]);

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
  }, []);

  const toggleStep = useCallback((key, index) => {
    setDrumRacks((prev) => ({
      ...prev,
      [key]: prev[key].map((v, i) => (i === index ? !v : v)),
    }));
  }, []);

  const toggleMute = useCallback((keyCode) => {
    setMute((prev) => {
      const next = { ...prev };
      switch (keyCode) {
        case 49: next.E40 = !next.E40; break;
        case 50: next.Kick = !next.Kick; break;
        case 51: next.Clap = !next.Clap; break;
        case 52: next.ClosedHat = !next.ClosedHat; break;
        case 53: next.OpenHat = !next.OpenHat; break;
        case 57: next.Canvas = !next.Canvas; break;
        default: return prev;
      }
      return next;
    });
  }, []);

  const playPause = useCallback(() => setPlayMusic((v) => !v), []);
  const resetLoops = useCallback(() => setDrumRacks(emptyRacks()), []);
  const updateTempo = useCallback((e) => setTempo(+e.target.value), []);
  const toggleCanvas = useCallback(() => {
    setMute((prev) => ({ ...prev, Canvas: false }));
  }, []);

  const encrypt = useCallback(() => {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(drumRacks), SECRET).toString();
    navigate(`/drummachine/${encodeURIComponent(ciphertext)}`);
  }, [drumRacks, navigate]);

  return (
    <div className="App">
      <Outlet context={{
        toggleStep, playPause, updateTempo, toggleMute, toggleCanvas,
        resetLoops, encrypt,
        currentStep, drumRacks, tempo, mute,
      }} />
    </div>
  );
}
