import { atom } from 'jotai';
import { Highlight } from '../selection/note';

export const highlightAtom = atom<Highlight[]>([]);
export const mainKeyAtom = atom(0);