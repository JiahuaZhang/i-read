import { useRecoilValue } from 'recoil';
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

export const Note = () => {
  // todo
  // one click copy all
  // one click navigate
  const highlights = useRecoilValue(highlightState);
  return <div>
    <div>
    </div>
    <ul>{highlights.map(renderHighlight)}</ul>;
  </div>;
};