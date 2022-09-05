import rangy from 'rangy';
import { ImageHighlight } from './ImageNote';
import { Highlight, HighlighterInfo, Note } from './Note';

export interface TextNote extends Note {
  end: number;
  className: string;
}

export class TextHighlight extends Highlight {
  note = {} as TextNote;

  constructor(note: TextNote) { super(note); this.note = note; }

  static create(highlighter: Highlighter, container: Element, className: string) {
    const range = highlighter.converter.serializeSelection(rangy.getSelection(), container)[0];
    const { characterRange: { start, end } } = range;

    const textHighlight = new TextHighlight({ className, start, end, created: new Date().getTime() });
    return textHighlight.hydrate({ highlighter, doc: document, container });
  }

  hydrate({ highlighter, doc, container }: HighlighterInfo) {
    const textHighlight = new TextHighlight(this.note);
    const range = textHighlight.toRange({ highlighter, doc, container });

    const addElement = (node: Element) => {
      if (range.intersectsNode(node)) {
        if (node.tagName !== 'SPAN') {
          node.childNodes.forEach(node => addElement(node as Element));
        } else {
          textHighlight.elements.push(node);
        }
      }
    };

    range.commonAncestorContainer.childNodes.forEach(node => addElement(node as Element));
    return textHighlight;
  }

  changeClass(className: string) {
    return new TextHighlight({ ...this.note, created: new Date().getTime(), className });
  }

  serialize() {
    const { start, end, className } = this.note;
    return `type:textContent|${start}$${end}$$${className}$book`;
  }

  highlight(highlight: Highlighter) {
    highlight.deserialize(this.serialize());
    return this;
  }

  compareTo(other: Highlight): number {
    if (this.note.start !== other.note.start) return this.note.start - other.note.start;

    if (other instanceof TextHighlight) {
      if (this.note.end !== this.note.end) return this.note.end - other.note.end;

      return this.note.created - other.note.created;
    } else if (other instanceof ImageHighlight) {
      return this.note.end - other.note.start;
    }

    return 0;
  }

  contains(range: { start: number; end: number; }): boolean {
    const { start, end } = range;
    return this.note.start <= start && this.note.end >= end;
  }

  toggleSelect({ highlighter, doc, container }: HighlighterInfo) {
    const { start, end } = this.note;
    const range = highlighter.converter.characterRangeToRange(doc, { start, end }, container);
    const selection = rangy.getSelection();
    selection.addRange(range);
    return this;
  }

  toRange({ highlighter, doc, container }: HighlighterInfo) {
    const { start, end } = this.note;
    return highlighter.converter.characterRangeToRange(doc, { start, end }, container);
  }
}