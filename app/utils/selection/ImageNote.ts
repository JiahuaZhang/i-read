import { Highlight, Note } from './Note';
import { TextHighlight } from './TextNote';

export interface ImageNote extends Note {
  imageIndex: number;
}

export class ImageHighlight extends Highlight {
  note = {} as ImageNote;

  compareTo(other: Highlight) {
    if (this.note.start !== other.note.start) return this.note.start - other.note.start;

    if (other instanceof ImageHighlight) {
      return this.note.created - other.note.created;
    } else if (other instanceof TextHighlight) {
      return this.note.start - other.note.end;
    }

    return 0;
  }
}
