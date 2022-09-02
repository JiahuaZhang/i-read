import rangy from 'rangy';
import { ImageHighlight } from './ImageNote';
import { Highlight, Note } from './Note';

export interface TextNote extends Note {
  end: number;
  className: string;
}

export class TextHighlight extends Highlight {
  note = {} as TextNote;

  static create(highlighter: Highlighter, element: Element, className: string) {
    const range = highlighter.converter.serializeSelection(rangy.getSelection(), element)[0];
    const { characterRange: { start, end } } = range;

    const textHighlight = new TextHighlight();
    textHighlight.note = { className, start, end, created: new Date().getTime() };
    return textHighlight;
  }

  changeClass(className: string) {
    this.note.className = className;
    return this;
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

  toggleSelect(highlighter: Highlighter, doc: Document, node: Node) {
    const { start, end } = this.note;
    const range = highlighter.converter.characterRangeToRange(doc, { start, end }, node);
    const selection = rangy.getSelection();
    selection.addRange(range);
    return this;
  }
}