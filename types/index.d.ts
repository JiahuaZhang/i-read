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

interface CharacterRange {
  backward: boolean;
  characterRange: {
    start: number;
    end: number;
  };
}

interface RangyConverter {
  serializeSelection(selection: RangySelection, containerNode: Document | Window | HTMLIFrameElement | Element): CharacterRange[];
  rangeToCharacterRange(selection: RangyRange, containerNode: Document | Window | HTMLIFrameElement | Element): CharacterRange.characterRange;
  characterRangeToRange(doc: Document | Window | HTMLIFrameElement, characterRange: CharacterRange.characterRange, containerNode: Element | Node): Range;
}

interface ClassApplier {
  applyToSelection(windows?: Window): void;
}

interface RangyHighlight {
  unapply(): void;
}

interface Highlighter {
  converter: RangyConverter;
  addClassApplier(applier: ClassApplier): void;
  highlightSelection(className: string, options?: HighlighterOptoin): void;
  deserialize(serialized: string): void;
  highlights: RangyHighlight[];
}

interface RangyStatic {
  createHighlighter(doc?: Document | Window | HTMLIFrameElement, type?: string): Highlighter;
  createClassApplier(className: string, options?: ApplierOption, tagNames?: string[]): ClassApplier;
}

declare module 'rangy' {
  export = rangy;
}

declare let rangy: RangyStatic;
