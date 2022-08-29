import rangy from 'rangy';
import { Highlight, Note } from './Note';
import { TextHighlight } from './TextNote';

export interface ImageNote extends Note {
  imageIndex: number;
}

export class ImageHighlight extends Highlight {
  note = {} as ImageNote;

  static create(highlighter: Highlighter, img: Node, container: Element) {
    const range = rangy.createRange();
    range.selectNode(img);
    const { start } = highlighter.converter.rangeToCharacterRange(range, container);

    const imageHighlight = new ImageHighlight();
    imageHighlight.note = { start, created: new Date().getTime(), imageIndex: 0 };
    return imageHighlight;
  }

  compareTo(other: Highlight): number {
    if (this.note.start !== other.note.start) return this.note.start - other.note.start;

    if (other instanceof ImageHighlight) {
      return this.note.created - other.note.created;
    } else if (other instanceof TextHighlight) {
      return this.note.start - other.note.end;
    }

    return 0;
  }
}
