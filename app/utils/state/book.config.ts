import { atom } from 'recoil';

type BookConfig = {
  fontSize: number;
  // fieldId: string;
  // currentPage: string;
};

const defaultBookConfig: BookConfig = { fontSize: 28 };

export const bookConfigState = atom({
  key: 'bookConfigState',
  default: defaultBookConfig
});