import { Input } from 'antd';
import produce from 'immer';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useEscape } from '~/utils/hook/useEscape';
import { getAdjacentId, Tree, treeMindMapState, treeMindMapTabIndexState, updateTrees } from '~/utils/state/tree-mind-map';

// super challenge
// enable ctrl z & ctrl y

// https://react-spectrum.adobe.com/react-aria/useDrag.html
// https://github.com/immerjs/immer
const listItemDot = 'relative before:absolute before:top-[calc(1rem)] before:left-[-6px] before:w-[4px] before:bg-blue-400 before:h-[4px] before:rounded-full before:z-20';
const listVerticalLine = 'after:absolute after:top-[calc(1rem)] after:bottom-[calc(-1rem-4px)] after:bg-blue-200 after:left-[-6px] after:w-[4px] after:rounded-full last:after:hidden [&>ul]:ml-2';
const cornerVerticalLine = 'relative before:absolute before:bg-blue-200 before:w-[4px] before:left-[-6px] before:top-[calc(1rem+2px)] before:bottom-[calc(-1rem-2px)] before:rounded-full';
const cornerHorizontalLine = 'after:absolute after:bg-blue-200 after:h-[4px] after:top-[calc(100%+1rem-2px)] after:left-[-6px] after:right-[calc(100%-0.5rem+2px)] after:rounded-full';
const inputCornerVerticalLine = 'relative before:absolute before:bg-blue-200 before:w-[4px] before:left-[-6px] before:top-[calc(1rem+2px)] before:bottom-[calc(-1rem-7px)] before:rounded-full';
const inputCornerHorizontalLine = 'after:absolute after:bg-blue-200 after:h-[4px] after:top-[calc(100%+1rem+3px)] after:left-[-6px] after:right-[calc(100%-0.5rem+2px)] after:rounded-full';
const liClass = `${listItemDot} ${listVerticalLine}`;
const parentClass = `${cornerVerticalLine} ${cornerHorizontalLine}`;
const inputParentClass = `${inputCornerVerticalLine} ${inputCornerHorizontalLine}`;

type TreeFn = {
  tree: Tree,
  path: string,
};
const renderTree = ({ tree, path }: TreeFn) => {
  const treeMindMaps = useRecoilValue(treeMindMapState);
  const updater = useSetRecoilState(treeMindMapState);
  const [tabIndex, setTabIndex] = useRecoilState(treeMindMapTabIndexState);
  const [isUpdating, setIsUpdating] = useState(false);
  const [value, setValue] = useState(tree.value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  useEscape(inputRef, () => setIsUpdating(false));

  const keys = path.split('.').map(Number);

  useEffect(() => {
    if (tabIndex === tree.id) {
      spanRef.current?.focus();
    }
  }, [tabIndex, tree.id, spanRef]);

  return <li key={tree.id} className={liClass} >
    {isUpdating && <span className={`${tree.children && inputParentClass} `} >
      <Input autoFocus ref={r => {
        if (r?.input) inputRef.current = r.input;
      }}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={event => {
          updater(produce(draft => {
            updateTrees(draft, keys, value);
          }));

          if (event.key === 'Enter') {
            setIsUpdating(false);
            setTimeout(() => spanRef.current?.focus(), 0);
          }
        }}
      />
    </span>}

    {/* todo, click to change to toggle */}

    {!isUpdating && <span
      ref={spanRef}
      className={`${tree.children && parentClass} focus-visible:outline-2 focus-visible:outline-blue-200 focus:border-2 focus:border-blue-200`}
      tabIndex={tabIndex === tree.id ? 1 : 0}
      onClick={() => setTabIndex(tree.id)}
      onDoubleClick={() => setIsUpdating(true)}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          return setIsUpdating(true);
        }

        if (e.key === 'ArrowDown') {
          return setTabIndex(
            getAdjacentId(treeMindMaps, keys, 'down')
          );
        }

        if (e.key === 'ArrowUp') {
          return setTabIndex(
            getAdjacentId(treeMindMaps, keys, 'up')
          );
        }

        // todo, left, right arrows
      }}
    >
      {!isUpdating && tree.value.replace(/\s+/, '') ? tree.value : <span className='italic text-gray-400 text-2xl' >double click to edit</span>}
    </span>}

    {tree.children &&
      <ul>
        {tree.children.map((c, i) => renderTree({ tree: c, path: `${path}.${i}` }))}
      </ul>}
  </li>;
};

export const TreeList = () => {
  const data = useRecoilValue(treeMindMapState);

  // todo, make list item toggleable
  // from parent, to kid, to next kid
  // and can back to parent shift tap
  return <ul className='p-2 border-2 border-green-200 text-3xl' >
    {data.map((d, i) => renderTree({ tree: d, path: `${i}` }))}
  </ul>;
};