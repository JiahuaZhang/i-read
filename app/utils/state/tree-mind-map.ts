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

type TreeMeta = Tree & {
  path: number;
};

// future? option, right? left?
// paths -> should be at least size of 1
export const getAdjacentId = (items: Tree[], paths: number[], option: 'up' | 'down') => {
  const meta = paths.reduce((aggregator, path) => {
    if (aggregator.length === 0) return [{ ...items[path], path }];

    const parent: TreeMeta = aggregator[0];
    return [{ ...parent.children![path], path }, ...aggregator];
  }, [] as TreeMeta[]);

  if (option === 'up') {
    for (let index = 1; index < meta.length; index++) {
      if (meta[index - 1].path === 0) return meta[index].id;

      let ref: Tree = meta[index].children![meta[index - 1].path - 1];
      while (ref.children?.length) {
        ref = ref.children[ref.children.length - 1];
      }
      return ref.id;
    }

    if (paths[0] > 0) {
      let ref: Tree = items[paths[0] - 1];
      while (ref.children?.length) {
        ref = ref.children[ref.children.length - 1];
      }
      return ref.id;
    }
  } else if (option === 'down') {
    if (meta[0].children?.length) return meta[0].children[0].id;

    for (let index = 1; index < meta.length; index++) {
      if (meta[index].children!.length - 1 > meta[index - 1].path) {
        return meta[index].children![meta[index - 1].path + 1].id;
      }
    }

    if (items.length > paths[0] + 1) return items[paths[0] + 1].id;
  }

  return meta[0].id;
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