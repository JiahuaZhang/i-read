export interface Note {
  start: number;
  created: number;
}

export class Highlight {
  note = {} as Note;

  compareTo(_: Highlight) { return 0; }

  compareByCreated(other: Highlight) { return this.note.created - other.note.created; }

  changeClass(_: string) { return this; }

  serialize() { return ''; }

  highlight(_: Highlighter) { return this; }

  equals(_: Highlight) { return false; }

  contains(_: CharacterRange["characterRange"]) { return false; }

  toggleSelect(_highlighter: Highlighter, _doc: Document, _node: Node) { return this; }
}