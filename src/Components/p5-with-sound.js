// The p5.sound addon attaches itself to the global `p5` and assumes it's
// already defined. Under ES modules, all `import` statements are hoisted
// and evaluated before any module-body code runs, so a plain
// `window.p5 = p5; import 'p5/lib/addons/p5.sound'` ends up evaluating the
// addon BEFORE the global assignment. Top-level await lets us force the
// addon to load after the global is in place.
import p5 from 'p5';

if (typeof window !== 'undefined') {
  window.p5 = p5;
}

await import('p5/lib/addons/p5.sound.js');

export default p5;
