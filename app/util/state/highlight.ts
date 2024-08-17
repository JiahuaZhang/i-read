import { atom } from 'recoil';
import { Highlight } from '../selection/note';

export const highlightState = atom<Highlight[]>({
  key: 'highlightState',
  default: []
});

export const mainKeyState = atom<number>({
  key: 'mainKeyState',
  default: 0
});