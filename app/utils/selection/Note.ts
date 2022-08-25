export interface Note {
  start: number;
  created: number;
}

export class Highlight {
  note = {} as Note;

  compareTo(_: Highlight) {
    return 0;
  }

  compareByCreated(other: Highlight) {
    return this.note.created - other.note.created;
  }

  serialize() {
    return '';
  }
}