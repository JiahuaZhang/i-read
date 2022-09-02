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

  equals(_: Highlight) {
    return false;
  }

  contains(_: CharacterRange["characterRange"]) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleSelect(_highlighter: Highlighter, _doc: Document, _node: Node) {}
}