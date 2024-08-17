import { dict, number, object, optional, string, writableArray } from "@recoiljs/refine";
import { atom } from "recoil";
import { syncEffect } from "recoil-sync";
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
    fontSize: 24,
    chinseFontFamily: "",
    englishFontFamily: ""
  },
  fileId: "",
  track: {
    page: '',
    notes: {}
  }
};

export const storeKey = "recoil-sync-indexedDB";

export const bookConfigState = atom<BookConfig>({
  key: "bookConfigState",
  default: defaultBookConfig,
  effects: [
    syncEffect({
      storeKey: storeKey,
      refine: object({
        config: object({
          fontSize: number(),
          chinseFontFamily: string(),
          englishFontFamily: string()
        }),
        fileId: string(),
        track: object({
          page: string(),
          notes: dict(writableArray(object({
            start: number(),
            created: number(),
            end: optional(number()),
            className: optional(string()),
          })))
        })
      })
    })
  ]
});