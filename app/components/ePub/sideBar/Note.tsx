import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { ImageHighlight } from '~/utils/selection/ImageNote';
import { Highlight } from '~/utils/selection/Note';
import { TextHighlight } from '~/utils/selection/TextNote';
import { highlightState } from '~/utils/state/highlight';

const renderHighlight = (highlight: Highlight, index: number, _: Highlight[]) => {
  if (highlight instanceof TextHighlight) {
    return <li key={index} className={`${highlight.note.className}`}>
      {highlight.elements
        .filter(element => element.innerHTML !== '\n')
        .map((element, i) => <p key={i}> {element.innerHTML} </p>)}
    </li>;
  }

  if (highlight instanceof ImageHighlight) {
    const img = highlight.elements[0];
    return (
      <li key={index}>
        <img src={img.getAttribute('src') ?? ''} alt={img.getAttribute('alt') ?? ''} />
      </li>
    );
  }

  return <li key={index}>Invalid Highlight</li>;
};

enum Order {
  ascend = '▲',
  descend = '▼'
}

export const Note = () => {
  // todo
  // 3, can toggle select, all, none, some
  // 4, one click copy
  const [highlights, setHighlights] = useRecoilState(highlightState);
  const [order, setOrder] = useState(Order.ascend);

  console.log(highlights);

  return <div>
    <div>
      <button
        className='rounded px-2 py-1 bg-blue-400 text-white'
        onClick={() => setOrder(
          prev => prev === Order.ascend ? Order.descend : Order.ascend
        )}>
        Sort {order}
      </button>
    </div>
    <ul>{[...highlights].sort(
      (a, b) => {
        switch (order) {
          case Order.ascend:
            return a.compareTo(b);
          case Order.descend:
            return b.compareTo(a);
          default:
            return 0;
        }
      }
    ).map(renderHighlight)}</ul>;
  </div>;
};