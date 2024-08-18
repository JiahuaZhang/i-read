import { atom } from 'jotai';
import { Note } from '../selection/note';

export type BookConfig = {
  config: {
    fontSize: number;
    chinseFontFamily: string;
    englishFontFamily: string;
  };
  fileId: string;
  track: {
    page: string,
    notes: {
      [key: string]: Note[];
    };
  };
};

export const defaultBookConfig: BookConfig = {
  config: {
    fontSize: 22,
    chinseFontFamily: "",
    englishFontFamily: ""
  },
  fileId: "",
  track: {
    page: '',
    notes: {}
  }
};

export const bookConfigAtom = atom(defaultBookConfig);