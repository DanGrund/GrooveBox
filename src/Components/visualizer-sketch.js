import p5 from './p5-with-sound';

const sketch = (p) => {
  let kickRadius = 50;
  let clapRadius = 50;
  let closedRadius = 50;
  let openRadius = 50;
  let bassRadius = 50;
  let midiValue = 0;
  let osc, envelope, fft, reverb, delay;
  let audioStarted = false;

  p.setup = () => {
    p.createCanvas(1000, 0.7 * p.displayHeight);
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

  const ensureAudio = () => {
    if (!audioStarted && typeof p.userStartAudio === 'function') {
      p.userStartAudio();
      audioStarted = true;
    }
  };

  p.mousePressed = ensureAudio;
  p.keyPressed = ensureAudio;

  p.draw = () => {
    p.clear();
    p.background(0);
    if (kickRadius > 50) kickRadius -= 4;
    if (clapRadius > 50) clapRadius -= 4;
    if (closedRadius > 50) closedRadius -= 4;
    if (openRadius > 50) openRadius -= 4;
    if (bassRadius > 50) bassRadius -= 4;

    p.fill('rgba(255,43,56, 0.8)');
    p.ellipse(166, p.height / 2, kickRadius);
    p.ellipse(332, p.height / 2, clapRadius);
    p.ellipse(500, p.height / 2, closedRadius);
    p.ellipse(666, p.height / 2, bassRadius);
    p.ellipse(830, p.height / 2, openRadius);

    // map home row to midi values
    if (p.keyIsDown(65)) { midiValue = 60; } else { midiValue = 0; }
    if (p.keyIsDown(83)) midiValue = 64;
    if (p.keyIsDown(68)) midiValue = 67;
    if (p.keyIsDown(70)) midiValue = 71;
    if (p.keyIsDown(71)) midiValue = 72;
    if (p.keyIsDown(72)) midiValue = 76;
    if (p.keyIsDown(74)) midiValue = 77;
    if (p.keyIsDown(75)) midiValue = 79;
    if (p.keyIsDown(76)) midiValue = 81;
    if (p.keyIsDown(186)) midiValue = 83;
    if (p.keyIsDown(222)) midiValue = 84;

    const freqValue = p.midiToFreq(midiValue);
    osc.freq(freqValue);
    osc.amp(midiValue === 0 ? 0 : 1);
    if (midiValue !== 0) envelope.play(osc, 0, 0.1);

    const spectrum = fft.analyze();
    for (let i = 0; i < spectrum.length * 4; i++) {
      p.fill(spectrum[i], spectrum[i] / 10, 140);
      const x = p.map(i, 0, spectrum.length / 18, 0, p.width);
      const h = p.map(spectrum[i], 0, 255, 0, p.height);
      p.rect(x, p.height / 2, spectrum.length / 100, -h / 2);
      p.rect(x, p.height / 2, -spectrum.length / 100, h / 2);
    }
  };

  p.reDraw = (props) => {
    if (!props) return;
    if (props.drumRacks.Kick[props.currentStep] && !props.mute.Kick) kickRadius = 200;
    if (props.drumRacks.Clap[props.currentStep] && !props.mute.Clap) clapRadius = 200;
    if (props.drumRacks.ClosedHat[props.currentStep] && !props.mute.ClosedHat) closedRadius = 200;
    if (props.drumRacks.OpenHat[props.currentStep] && !props.mute.OpenHat) openRadius = 200;
    if (props.drumRacks.E40[props.currentStep] && !props.mute.E40) bassRadius = 200;
    if (props.mute.Canvas) p.remove();
  };
};

export default sketch;
