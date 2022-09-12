import { array, dict, number, object, string, optional } from "@recoiljs/refine";
import { atom } from "recoil";
import { syncEffect } from "recoil-sync";
import { Note } from '../selection/Note';

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
    fontSize: 28,
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

export const bookConfigState = atom({
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
          notes: dict(array(object({
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
