import { Input } from 'antd';
import produce from 'immer';
import { uniqueId } from 'lodash';
import React, { useRef, useState } from 'react';
import { useEscape } from '~/utils/hook/useEscape';

// super challenge
// enable ctrl z & ctrl y

type Tree = {
  id: string;
  value: string;
  children?: Tree[];
};

const dummyData: Tree[] = [
  {
    id: uniqueId(),
    value: '   ',
    // value: 'first title',
    children: [
      { id: uniqueId(), value: 'first child' },
      { id: uniqueId(), value: 'second child' },
    ]
  },
  {
    id: uniqueId(),
    value: 'second title',
  },
  {
    id: uniqueId(),
    value: 'another title',
    children: [
      {
        id: uniqueId(),
        // value: 'hello child'
        value: ''
      },
      { id: uniqueId(), value: 'hello again child' },
    ]
  }
];

const updateTrees = (items: Tree[], paths: number[], value: string) => {
  const [index, ...rest] = paths;
  if (rest.length === 0) {
    items[index].value = value;
  } else {
    updateTrees(items[index].children || [], rest, value);
  }
};

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
  updater: React.Dispatch<React.SetStateAction<Tree[]>>;
};
const renderTree = ({ tree, path, updater }: TreeFn) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [value, setValue] = useState(tree.value);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEscape(inputRef, () => setIsUpdating(false));

  return <li key={tree.id} className={liClass} >
    {isUpdating && <span className={`${tree.children && inputParentClass} `} >
      <Input autoFocus ref={r => {
        if (r?.input) inputRef.current = r.input;
      }}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={event => {
          updater(produce(draft => {
            const keys = path.split('.').map(Number);
            updateTrees(draft, keys, value);
          }));

          if (event.key === 'Enter') setIsUpdating(false);
        }}
      />
    </span>}

    {!isUpdating && <span className={`${tree.children && parentClass}`} onDoubleClick={() => setIsUpdating(true)} >
      {!isUpdating && tree.value.replace(/\s+/, '') ? tree.value : <span className='italic text-gray-400 text-2xl' >double click to edit</span>}
    </span>}

    {tree.children &&
      <ul>
        {tree.children.map((c, i) => renderTree({ tree: c, path: `${path}.${i}`, updater }))}
      </ul>}
  </li>;
};

export const TreeList = () => {
  const [data, setData] = useState(dummyData);

  // todo, make list item toggleable
  // from parent, to kid, to next kid
  // and can back to parent shift tap
  return <ul className='p-2 border-2 border-green-200 text-3xl' >
    {data.map((d, i) => renderTree({ tree: d, path: `${i}`, updater: setData }))}
  </ul>;
};