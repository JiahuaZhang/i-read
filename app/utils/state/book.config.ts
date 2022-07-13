import { atom } from 'recoil';

type BookConfig = {
  fontSize: number;
  chinseFontFamily: string;
  englishFontFamily: string;
  fontFamily: string;
  // fieldId: string;
  // currentPage: string;
};

const defaultBookConfig: BookConfig = { fontSize: 28, chinseFontFamily: '', englishFontFamily: '', fontFamily: '' };

export const bookConfigState = atom({
  key: 'bookConfigState',
  default: defaultBookConfig
});