import { InitialConfigType } from '@lexical/react/LexicalComposer';

export const theme: InitialConfigType["theme"] = {
  list: {
    checklist: 'pl-0',
    listitem: 'm-0',
    listitemChecked: 'line-through relative list-none pl-6 outline-none [&:before]:[content:""] [&:before]:absolute [&:before]:w-4 [&:before]:h-4 [&:before]:bg-blue-4 [&:before]:border-rounded-0.5 [&:before]:left-0 [&:before]:top-1 [&:before]:cursor-pointer	[&:after]:[content:""] [&:after]:absolute [&:after]:w-1.75 [&:after]:h-3.5 [&:after]:border-white [&:after]:border-r-2 [&:after]:border-b-2 [&:after]:rotate-45 [&:after]:left-1 [&:after]:top-1 [&:after]:cursor-pointer',
    listitemUnchecked: 'relative list-none pl-6 outline-none [&:before]:[content:""] [&:before]:absolute [&:before]:w-4 [&:before]:h-4 [&:before]:border-1 [&:before]:border-black [&:before]:border-rounded-0.5 [&:before]:left-0 [&:before]:top-1 [&:before]:cursor-pointer',
    nested: {
      listitem: 'list-none'
    },
    ul: 'font-方正楷体 list-disc pl-4 text-xl',
    ol: 'list-decimal pl-4',
    olDepth: [],
  },
};