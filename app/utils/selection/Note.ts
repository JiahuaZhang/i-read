export interface Note {
  start: number;
  created: number;
}

export type HighlighterInfo = {
  highlighter: Highlighter,
  doc: Document,
  container: Node;
};

export class Highlight {
  note = {} as Note;
  elements: Element[] = [];

  constructor(note: Note) { this.note = note; }

  hydrate(_: HighlighterInfo) { return new Highlight(this.note); }

  compareTo(_: Highlight) { return 0; }

  compareByCreated(other: Highlight) { return this.note.created - other.note.created; }

  changeClass(_: string) { return new Highlight({ ...this.note }); }

  serialize() { return ''; }

  highlight(_: Highlighter) { return this; }

  equals(_: Highlight) { return false; }

  contains(_: CharacterRange["characterRange"]) { return false; }

  toggleSelect(_: HighlighterInfo) { return this; }

  toRange(_: HighlighterInfo): Range { return {} as Range; }
}