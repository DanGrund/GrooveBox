import p5 from './p5-with-sound';

const TRACK_ORDER = ['Kick', 'Clap', 'ClosedHat', 'E40', 'OpenHat'];
const KEY_MIDI = {
  65: 60, 83: 64, 68: 67, 70: 71, 71: 72,
  72: 76, 74: 77, 75: 79, 76: 81, 186: 83, 222: 84,
};

const canvasSize = (p) => ({
  w: Math.min(1000, p.windowWidth * 0.95),
  h: Math.min(700, p.windowHeight * 0.65),
});

const sketch = (p) => {
  const radii = Object.fromEntries(TRACK_ORDER.map((t) => [t, 50]));
  let midiValue = 0;
  let osc, envelope, fft, reverb, delay;
  let audioStarted = false;

  p.setup = () => {
    const { w, h } = canvasSize(p);
    p.createCanvas(w, h);
    p.frameRate(30);
    osc = new p5.SinOsc();
    reverb = new p5.Reverb();
    delay = new p5.Delay();
    // p5.Env was renamed to p5.Envelope in p5.sound 1.x
    envelope = new (p5.Envelope || p5.Env)();
    envelope.setADSR(0.001, 0.5, 0.1, 0.5);
    envelope.setRange(1, 0);
    reverb.process(osc, 2, 2, false);
    delay.process(osc, 0.12, 0.8, 2300);
    osc.start();
    osc.amp(0);
    fft = new p5.FFT();
    p.noStroke();
  };

  p.windowResized = () => {
    const { w, h } = canvasSize(p);
    p.resizeCanvas(w, h);
  };

  const ensureAudio = () => {
    if (!audioStarted && typeof p.userStartAudio === 'function') {
      p.userStartAudio();
      audioStarted = true;
    }
  };

  p.mousePressed = ensureAudio;
  p.touchStarted = ensureAudio;
  p.keyPressed = ensureAudio;

  p.draw = () => {
    const scale = Math.min(1, p.width / 1000);
    const restR = 50 * scale;
    const hitR = 200 * scale;
    const decay = 4 * scale;

    p.clear();
    p.background(0);

    p.fill('rgba(255,43,56, 0.8)');
    TRACK_ORDER.forEach((t, i) => {
      if (radii[t] > restR) radii[t] = Math.max(restR, radii[t] - decay);
      const x = p.width * (i + 0.5) / TRACK_ORDER.length;
      p.ellipse(x, p.height / 2, radii[t]);
    });

    midiValue = 0;
    for (const [keyCode, note] of Object.entries(KEY_MIDI)) {
      if (p.keyIsDown(+keyCode)) midiValue = note;
    }

    osc.freq(p.midiToFreq(midiValue));
    osc.amp(midiValue === 0 ? 0 : 1);
    if (midiValue !== 0) envelope.play(osc, 0, 0.1);

    const spectrum = fft.analyze();
    for (let i = 0; i < spectrum.length; i++) {
      p.fill(spectrum[i], spectrum[i] / 10, 140);
      const x = p.map(i, 0, spectrum.length / 18, 0, p.width);
      const h = p.map(spectrum[i], 0, 255, 0, p.height);
      p.rect(x, p.height / 2, spectrum.length / 100, -h / 2);
      p.rect(x, p.height / 2, -spectrum.length / 100, h / 2);
    }
  };

  p.reDraw = (props) => {
    if (!props) return;
    const scale = Math.min(1, p.width / 1000);
    const hitR = 200 * scale;
    TRACK_ORDER.forEach((t) => {
      if (props.drumRacks[t][props.currentStep] && !props.mute[t]) radii[t] = hitR;
    });
  };
};

export default sketch;
