import { CopyFilled, DeleteFilled } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useEscape } from '~/utils/hook/useEscape';
import { ImageHighlight } from '~/utils/selection/ImageNote';
import { Highlight } from '~/utils/selection/Note';
import { TextHighlight } from '~/utils/selection/TextNote';
import { highlightState, mainKeyState } from '~/utils/state/highlight';

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
  const [highlights, setHighlights] = useRecoilState(highlightState);
  const setMainKey = useSetRecoilState(mainKeyState);
  const [confirmDelte, setConfirmDelte] = useState(false);
  const ref = useRef(null);
  useEscape(ref, () => setConfirmDelte(false));

  return <div>
    <div className='text-3xl inline-grid grid-flow-col justify-between w-full p-2'>
      <CopyFilled className='text-blue-400 cursor-pointer hover:text-blue-800' />

      {!confirmDelte
        && <DeleteFilled
          onClick={(event) => { event.nativeEvent.stopImmediatePropagation(); setConfirmDelte(true); }}
          className='text-orange-400 cursor-pointer hover:text-orange-800' />}

      {confirmDelte
        && <span className='inline-grid items-center grid-flow-col'>
          <span className='text-base text-rose-800' >Confirm Delete</span>
          <DeleteFilled
            ref={ref}
            onClick={() => { setHighlights([]); setMainKey(k => k + 1); setConfirmDelte(false); }}
            className='text-rose-400 cursor-pointer hover:text-rose-800' />
        </span>}
    </div>
    <ul>{highlights.map(renderHighlight)}</ul>
  </div>;
};