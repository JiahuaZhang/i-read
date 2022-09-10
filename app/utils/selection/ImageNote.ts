import rangy from 'rangy';
import { Highlight, HighlighterInfo } from './Note';
import { TextHighlight } from './TextNote';

export class ImageHighlight extends Highlight {
  static create(highlighter: Highlighter, img: Node, container: Element) {
    const range = rangy.createRange();
    range.selectNode(img);
    const { start } = highlighter.converter.rangeToCharacterRange(range, container);

    const imageHighlight = new ImageHighlight({ start, created: new Date().getTime() });
    imageHighlight.elements = [img as Element];
    return imageHighlight;
  }

  hydrate({ highlighter, doc, container }: HighlighterInfo) {
    const imageHighlight = new ImageHighlight(this.note);
    const range = imageHighlight.toRange({ highlighter, doc, container });

    const parseImgNode = (node: Element) => {
      if (node.tagName === 'IMG') {
        imageHighlight.elements = [node];
      } else {
        node.childNodes.forEach(node => parseImgNode(node as Element));
      }
    };

    parseImgNode(range.startContainer.nextSibling as Element);
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

  equals(other: Highlight) {
    if (other instanceof ImageHighlight) {
      return this.note.start === other.note.start;
    }
    return false;
  }

  toRange({ highlighter, doc, container }: HighlighterInfo) {
    const { start } = this.note;
    return highlighter.converter.characterRangeToRange(doc, { start, end: start }, container);
  }

  toElements() {
    return [this.elements[0].outerHTML];
  }
}
