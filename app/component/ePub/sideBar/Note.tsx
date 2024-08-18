import { CopyFilled, DeleteFilled } from '@ant-design/icons';
import { notification } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import { useRef, useState } from 'react';
import { useEscape } from '~/util/hook/useEscape';
import { ImageHighlight } from '~/util/selection/ImageNote';
import { Highlight } from '~/util/selection/note';
import { TextHighlight } from '~/util/selection/textNote';
import { highlightAtom, mainKeyAtom } from '~/util/state/highlight';

const renderHighlight = (highlight: Highlight, index: number, _: Highlight[]) => {
  if (highlight instanceof TextHighlight) {
    return <li key={index} className={`${highlight.note.className}`}>
      {highlight.elements
        .filter(element => element.innerHTML !== '\n')
        .map((element, i) =>
          <p onDoubleClick={() => element.scrollIntoView()} key={i}> {element.innerHTML} </p>)}
    </li>;
  }

  if (highlight instanceof ImageHighlight) {
    const img = highlight.elements[0];
    return (
      <li key={index}>
        <img onDoubleClick={() => img.scrollIntoView()}
          src={img.getAttribute('src') ?? ''}
          alt={img.getAttribute('alt') ?? ''} />
      </li>
    );
  }

  return <li key={index}>Invalid Highlight</li>;
};

export const Note = () => {
  const [highlights, setHighlights] = useAtom(highlightAtom);
  const setMainKey = useSetAtom(mainKeyAtom);
  const [confirmDelte, setConfirmDelte] = useState(false);
  const ref = useRef(null);
  useEscape(ref, () => setConfirmDelte(false));

  return (
    <div>
      <div className='text-3xl inline-grid grid-flow-col justify-between w-full p-2 sticky top-0 bg-white'>
        <CopyFilled
          onClick={async () => {
            const contents = highlights.map(h => h.toElements()).flat();
            const type = 'text/html';
            navigator.clipboard.write([
              new ClipboardItem({ [type]: new Blob(contents, { type }) })
            ]);
            notification.success({ message: 'copied!', duration: 1.5 });
          }}
          className='text-blue-400 cursor-pointer hover:text-blue-800' />

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
    </div>);
};