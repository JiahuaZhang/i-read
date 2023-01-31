import { InitialConfigType } from '@lexical/react/LexicalComposer';

const listItemDot = 'relative [&:not(:has(ul:only-child))]:before:absolute before:top-[calc(1.25rem-2px)] before:left-[-6px] before:w-[4px] before:bg-blue-400 before:h-[4px] before:rounded-full before:z-10';
const listVerticalLine = 'after:absolute after:top-[calc(1.25rem-2px)] after:bottom-[-1.25rem] after:left-[-6px] after:w-[4px] after:bg-blue-200 after:rounded-full last:after:hidden';
const cornerHorizontalLine = '[&>ul]:before:absolute [&>ul]:before:bg-blue-200 [&>ul]:before:top-[calc(1.25rem+6px)] [&>ul]:before:left-[calc(-0.5rem+2px)] [&>ul]:before:w-[calc(0.5rem+4px)] [&>ul]:before:h-[4px] [&>ul]:before:rounded-full';
const cornerVerticalLine = '[&>ul]:after:absolute [&>ul]:after:bg-blue-200 [&>ul]:after:left-[calc(-0.5rem+2px)] [&>ul]:after:top-[calc(1.25rem-2px)] [&>ul]:after:w-[4px] [&>ul]:after:h-[calc(0.5rem+4px)] [&>ul]:after:rounded-full';

export const theme: InitialConfigType["theme"] = {
  list: {
    ul: "p-2 text-[1.75rem] leading-10 font-方正楷体",
    listitem: `${listItemDot} ${listVerticalLine} ${cornerHorizontalLine} ${cornerVerticalLine}`,
  },
};