import { number, object, string } from '@recoiljs/refine';
import { atom } from 'recoil';
import { syncEffect } from 'recoil-sync';

type BookConfig = {
  fontSize: number;
  chinseFontFamily: string;
  englishFontFamily: string;
  fontFamily: string;
  fieldId: string;
  // currentPage: string;
};

const defaultBookConfig: BookConfig = { fontSize: 28, chinseFontFamily: '', englishFontFamily: '', fontFamily: '', fieldId: '' };

export const bookConfigState = atom({
  key: 'bookConfigState',
  default: defaultBookConfig,
  effects: [
    syncEffect({
      refine: object({
        fontSize: number(),
        chinseFontFamily: string(),
        englishFontFamily: string(),
        fontFamily: string(),
        fieldId: string()
      })
    })
  ]
});