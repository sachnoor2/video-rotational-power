import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadLora} from '@remotion/google-fonts/Lora';
import {loadFont as loadNotoSans} from '@remotion/google-fonts/NotoSans';
import {loadFont as loadNotoSerif} from '@remotion/google-fonts/NotoSerif';

const inter = loadInter('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin', 'latin-ext'],
});

const lora = loadLora('normal', {
  weights: ['400', '500', '600', '700'],
  subsets: ['latin', 'latin-ext'],
});

// Greek letters (tau, omega, theta, delta) live outside the Latin subsets, so a
// Noto face that carries them sits behind each display face as a fallback.
const notoSans = loadNotoSans('normal', {
  weights: ['400', '600', '700'],
  subsets: ['greek'],
});

const notoSerif = loadNotoSerif('normal', {
  weights: ['400', '600'],
  subsets: ['greek'],
});

export const fontFamily = `${inter.fontFamily}, ${notoSans.fontFamily}, 'DejaVu Sans', sans-serif`;
export const serifFamily = `${lora.fontFamily}, ${notoSerif.fontFamily}, ${notoSans.fontFamily}, 'DejaVu Serif', serif`;

export const palette = {
  paper: '#faf8f3',
  ink: '#1c2430',
  inkSoft: '#3d4756',
  muted: '#7b8494',
  indigo: '#4f46e5',
  indigoSoft: '#e7e5fb',
  amber: '#fde9c8',
  amberDeep: '#b45309',
  rule: '#e3ded3',
  teal: '#0f766e',
};
