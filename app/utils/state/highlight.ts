import { atom } from 'recoil';
import { Highlight } from '../selection/Note';

export const highlightState = atom<Highlight[]>({
  key: 'highlightState',
  default: []
});