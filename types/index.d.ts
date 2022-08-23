interface ApplierOption {
  elementTagName?: string;
  // elementProperties: any;
  // elementAttributes: any;
  ignoreWhiteSpace?: boolean;
  applyToEditableOnly?: boolean;
  tagNames?: string[];
  normalize?: boolean;
  onElementCreate?: () => void;
  useExistingElements?: boolean;
}

interface HighlighterOptoin {
  selection?: RangySelection;
  exclusive?: boolean;
  containerElementId?: string;
}

interface ClassApplier {
  applyToSelection(windows?: Window): void;
}

interface RangyStatic {
  createHighlighter(doc?: Document | Window | HTMLIFrameElement, type?: string): Highlighter;
  createClassApplier(className: string, options?: ApplierOption, tagNames?: string[]): ClassApplier;
}

interface Highlighter {
  addClassApplier(applier: ClassApplier): void;
  highlightSelection(className: string, options?: HighlighterOptoin): void;
}

declare module 'rangy' {
  export = rangy;
}

declare let rangy: RangyStatic;
