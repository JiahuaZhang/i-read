import { expect } from 'vitest';
import { Tree, trimTrees } from './tree-mind-map';

describe('simple same level cases', () => {
  it('1 size case', () => {
    const data: Tree[] = [{ id: '0', value: '', children: [] }];
    const { items, tabIndex } = trimTrees(data, [0]);
    const answer: Tree[] = [];

    expect(items).toStrictEqual(answer);
    expect(tabIndex).toBe('NOT EXISTED');
  });

  it('first case', () => {
    const data: Tree[] = [
      { id: '0', value: '', children: [] },
      { id: '1', value: '', children: [] },
      { id: '2', value: '', children: [] },
      { id: '3', value: '', children: [] },
      { id: '4', value: '', children: [] },
    ];
    const { items, tabIndex } = trimTrees(data, [0]);
    const [_, ...answer] = data;

    expect(items).toStrictEqual(answer);
    expect(tabIndex).toBe('1');
  });

  it('last case', () => {
    const data: Tree[] = [
      { id: '0', value: '', children: [] },
      { id: '1', value: '', children: [] },
      { id: '2', value: '', children: [] },
      { id: '3', value: '', children: [] },
      { id: '4', value: '', children: [] },
    ];
    const { items, tabIndex } = trimTrees(data, [4]);
    const answer = data.slice(0, 4);

    expect(items).toStrictEqual(answer);
    expect(tabIndex).toBe('3');
  });

  it.only('regular case', () => {
    const data: Tree[] = [
      { id: '0', value: '', children: [] },
      { id: '1', value: '', children: [] },
      { id: '2', value: '', children: [] },
      { id: '3', value: '', children: [] },
      { id: '4', value: '', children: [] },
    ];
    const { items, tabIndex } = trimTrees(data, [2]);
    const answer = [...data.slice(0, 2), ...data.slice(3)];

    expect(items).toStrictEqual(answer);
    expect(tabIndex).toBe('3');
  });
});

describe('nested cases', () => {
  it.only('delete child', () => {
    const data: Tree[] = [
      {
        id: '0', value: '', children: [
          { id: '00', value: '', children: [] }
        ]
      }
    ];
    const { items, tabIndex } = trimTrees(data, [0, 0]);
    const answer: Tree[] = [{ id: '0', value: '', children: [] }];

    expect(items).toStrictEqual(answer);
    expect(tabIndex).toBe('0');
  });
});