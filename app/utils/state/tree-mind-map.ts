import { uniqueId } from 'lodash';
import { atom } from 'recoil';

export type Tree = {
  id: string;
  value: string;
  children?: Tree[];
};

export const updateTrees = (items: Tree[], paths: number[], value: string) => {
  const [index, ...rest] = paths;
  if (rest.length === 0) {
    items[index].value = value;
  } else {
    updateTrees(items[index].children || [], rest, value);
  }
};

const dummyData: Tree[] = [
  {
    id: uniqueId(),
    value: '   ',
    // value: 'first title',
    children: [
      { id: uniqueId(), value: 'first child', },
      { id: uniqueId(), value: 'second child', },
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
      { id: uniqueId(), value: 'hello again child', },
    ]
  }
];

export const treeMindMapState = atom({
  key: 'treeMindmapState',
  default: dummyData
});

export const treeMindMapTabIndexState = atom({
  key: 'treeMindMapTabIndexState',
  default: '2'
});