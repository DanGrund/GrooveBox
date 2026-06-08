## Vapor Grooves

A 16-step drum sequencer and p5.js visualizer with a hidden home-row synth. Originally built in 2017, modernized to Vite + React 18 + react-router 6.

## Project Status

Functional 16-step sequencer with five tracks (E40 / Kick / Clap / ClosedHat / OpenHat), tempo control, share-by-URL (AES-encrypted state), and a p5.js audio visualizer. The visualizer also hosts a hidden synth playable from the keyboard's home row (A–;).

## Stack

- React 18 + react-router-dom 6
- Vite for dev server / build
- howler.js for sample playback
- p5.js + p5.sound for the visualizer & synth
- crypto-js for shareable-URL state

## Setup

Requires `node` 18+ and `npm` (or yarn).

```sh
npm install
```

Run dev server (opens at http://localhost:3000):

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

Deploy to GitHub Pages (uses `dist/` from the build):

```sh
npm run deploy
```

## Controls

- Click cells to toggle steps
- `space` — play / pause
- `1`–`5` — mute the corresponding rack
- `9` — kill the canvas (frees the visualizer if it starts dragging)
- `A S D F G H J K L ; '` — play the hidden synth (in the visualizer)

## Notes on the 2026 modernization

The original was React 15 + react-scripts 0.9.2 + react-router 3 + node-sass + enzyme. None of that installs on modern Node. Notable changes:

- Toolchain swapped to Vite; JSX-bearing files renamed `.jsx`.
- Class components converted to function components with hooks.
- `cloneElement` props-passing replaced with `<Outlet context>`.
- `browserHistory` replaced with `useNavigate`.
- The `Howl` instances are now created once and reused — the original allocated five `Howl` objects on every tick of the step loop, which was almost certainly the "memory leak" the previous README mentioned.
- `P5Wrapper` now calls `canvas.remove()` on unmount, so navigating away from the visualizer actually frees the p5 instance.
- `p5.sound` requires a global `window.p5` to attach to; under ES modules this needs a small top-level-await shim (`src/Components/p5-with-sound.js`).
- `p5.Env` was renamed to `p5.Envelope` in p5.sound 1.x.
- Enzyme tests were removed (they couldn't survive the React 18 jump and were mostly `.skip` anyway).
