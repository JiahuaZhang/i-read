import rangy from 'rangy';
import { default_highlight_colors } from '~/routes/ePub/$fileId/$id';
import { ImageHighlight } from './ImageNote';
import { Highlight, HighlighterInfo, Note } from './Note';

export interface TextNote extends Note {
  end: number;
  className: typeof default_highlight_colors[number];
}

export const isTextNote = (note: Note): note is TextNote => typeof (note as TextNote).end === 'number'
  && typeof (note as TextNote).className === 'string';

const colors: { [key in typeof default_highlight_colors[number]]: string } = {
  'bg-amber-400': '#fbbf24',
  'bg-blue-500': '',
  'bg-green-400': '#4ade80',
  'bg-pink-400': '',
  'bg-purple-400': '',
  'bg-red-600': '#dc2626'
};

export class TextHighlight extends Highlight {
  note = {} as TextNote;

  constructor(note: TextNote) { super(note); this.note = note; }

  static create(highlighter: Highlighter, container: Element, className: typeof default_highlight_colors[number]) {
    const range = highlighter.converter.serializeSelection(rangy.getSelection(), container)[0];
    const { characterRange: { start, end } } = range;

    const textHighlight = new TextHighlight({ className, start, end, created: new Date().getTime() });
    textHighlight.highlight(highlighter);
    return textHighlight.hydrate({ highlighter, doc: document, container });
  }

  hydrate({ highlighter, doc, container }: HighlighterInfo) {
    this.highlight(highlighter);
    const textHighlight = new TextHighlight(this.note);
    const range = textHighlight.toRange({ highlighter, doc, container });
    textHighlight.elements = range.getNodes([], node => (node as Element)?.className?.includes(textHighlight.note.className));

    return textHighlight;
  }

  changeClass(className: typeof default_highlight_colors[number]) {
    const textHighlight = new TextHighlight({ ...this.note, created: new Date().getTime(), className });
    textHighlight.elements = this.elements;
    return textHighlight;
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

  toElements() {
    return this.elements.filter(e => e.innerHTML !== '\n')
      .map(e => {
        const p = document.createElement('p');
        p.innerHTML = e.innerHTML;
        p.style.backgroundColor = colors[this.note.className];
        return p.outerHTML;
      });
  }
}