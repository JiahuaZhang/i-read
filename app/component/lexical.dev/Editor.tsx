import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import initJson from './init.json';
import { theme } from './theme';

export const Editor = () => {
  const initialConfig: InitialConfigType = {
    namespace: "Mind Map",
    theme,
    onError: console.error,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    editorState: JSON.stringify(initJson)
  };

  return (
    <LexicalComposer initialConfig={initialConfig} >
      <div className="relative m-4 rounded border-2 border-gray-200 text-xl">
        <RichTextPlugin
          contentEditable={<ContentEditable un-p='2' un-z='10' />}
          placeholder={<div className='absolute top-[25px] left-[58px]' un-pointer-events='none' >Enter some rich text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <TabIndentationPlugin />
        <HistoryPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      </div>
    </LexicalComposer>
  );
};
