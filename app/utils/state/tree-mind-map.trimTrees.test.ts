import { cloneDeep } from 'lodash';
import { expect } from 'vitest';
import { toNumberPath, Tree, trimTrees } from './tree-mind-map';

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

  it('regular case', () => {
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
  it('delete child', () => {
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

  it('delete grand grand child', () => {
    const data: Tree[] = [
      {
        id: '0', value: '', children: [
          {
            id: '00', value: '', children: [
              {
                id: '000', value: '', children: [
                  {
                    id: '0000', value: '', children: [
                      { id: '00000', value: '', children: [] }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    const answer = cloneDeep(data);
    answer[0].children[0].children[0].children[0].children = [];
    const { items, tabIndex } = trimTrees(data, toNumberPath('0.0.0.0.0'));
    expect(items).toStrictEqual(answer);
    expect(tabIndex).toBe('0000');
  });

  it('complicated cases', () => {
    const data: Tree[] = [
      {
        id: '0', value: '', children: [
          {
            id: '00', value: '', children: [
              { id: '000', value: '', children: [] },
              { id: '001', value: '', children: [] },
              { id: '002', value: '', children: [] },
            ]
          },
          {
            id: '01', value: '', children: [
              { id: '010', value: '', children: [] },
              { id: '011', value: '', children: [] },
              { id: '012', value: '', children: [] },
            ]
          },
          {
            id: '02', value: '', children: [
              { id: '020', value: '', children: [] },
              { id: '021', value: '', children: [] },
              { id: '022', value: '', children: [] },
            ]
          },
        ]
      },
      {
        id: '1', value: '', children: [
          {
            id: '10', value: '', children: [
              { id: '100', value: '', children: [] },
              { id: '101', value: '', children: [] },
              { id: '102', value: '', children: [] },
            ]
          },
          {
            id: '11', value: '', children: [
              { id: '110', value: '', children: [] },
              { id: '111', value: '', children: [] },
              { id: '112', value: '', children: [] },
            ]
          },
          {
            id: '12', value: '', children: [
              { id: '120', value: '', children: [] },
              { id: '121', value: '', children: [] },
              { id: '122', value: '', children: [] },
            ]
          },
        ]
      },
      {
        id: '2', value: '', children: [
          {
            id: '20', value: '', children: [
              { id: '200', value: '', children: [] },
              { id: '201', value: '', children: [] },
              { id: '202', value: '', children: [] },
            ]
          },
          {
            id: '21', value: '', children: [
              { id: '210', value: '', children: [] },
              { id: '211', value: '', children: [] },
              { id: '212', value: '', children: [] },
            ]
          },
          {
            id: '22', value: '', children: [
              { id: '220', value: '', children: [] },
              { id: '221', value: '', children: [] },
              { id: '222', value: '', children: [] },
            ]
          },
        ]
      },
    ];

    const answer = cloneDeep(data);
    answer.pop();
    const { items, tabIndex } = trimTrees(data, [2]);
    expect(items).toStrictEqual(answer);
    expect(tabIndex).toBe('1');

    const { items: items2, tabIndex: tabIndex2 } = trimTrees(items, [1, 1]);
    answer[1].children = answer[1].children.filter((_, i) => i !== 1);
    expect(items2).toStrictEqual(answer);
    expect(tabIndex2).toBe('12');

    const { items: items3, tabIndex: tabIndex3 } = trimTrees(items2, [0, 0, 0]);
    answer[0].children[0].children = answer[0].children[0].children.filter((_, i) => i !== 0);
    expect(items3).toStrictEqual(answer);
    expect(tabIndex3).toBe('001');
  });
});