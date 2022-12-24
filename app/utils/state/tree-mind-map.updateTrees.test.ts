import { cloneDeep } from 'lodash';
import { expect } from 'vitest';
import { Tree, updateTrees } from './tree-mind-map';

describe('no children case', () => {
  it('update one size case', () => {
    const data: Tree[] = [
      { id: '0', value: '', children: [] }
    ];
    updateTrees(data, [0], 'test');
    const desired: Tree[] = [
      { id: '0', value: 'test', children: [] }
    ];
    expect(data).toStrictEqual(desired);
  });

  it('consequently update multiple cases', () => {
    const data: Tree[] = [
      { id: '0', value: '', children: [] },
      { id: '1', value: '', children: [] },
      { id: '2', value: '', children: [] },
      { id: '3', value: '', children: [] },
      { id: '4', value: '', children: [] },
      { id: '5', value: '', children: [] },
    ];
    const desired: Tree[] = cloneDeep(data);

    updateTrees(data, [5], 'test');
    desired[5].value = 'test';
    expect(data).toStrictEqual(desired);

    updateTrees(data, [3], 'test');
    desired[3].value = 'test';
    expect(data).toStrictEqual(desired);

    updateTrees(data, [0], 'test');
    desired[0].value = 'test';
    expect(data).toStrictEqual(desired);
  });
});

describe('nested children cases', () => {
  it('consequently update nested children', () => {
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
    const desired = cloneDeep(data);

    updateTrees(data, [0, 0, 0, 0, 0], 'test');
    desired[0].children[0].children[0].children[0].children[0].value = 'test';
    expect(data).toStrictEqual(desired);

    updateTrees(data, [0, 0, 0], 'test');
    desired[0].children[0].children[0].value = 'test';
    expect(data).toStrictEqual(desired);

    updateTrees(data, [0, 0], 'test');
    desired[0].children[0].value = 'test';
    expect(data).toStrictEqual(desired);
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
    const desired = cloneDeep(data);

    updateTrees(data, [0, 1], 'test');
    desired[0].children[1].value = 'test';
    expect(data).toStrictEqual(desired);

    updateTrees(data, [1, 1, 2], 'test');
    desired[1].children[1].children[2].value = 'test';
    expect(data).toStrictEqual(desired);

    updateTrees(data, [2, 2, 2], 'test');
    desired[2].children[2].children[2].value = 'test';
    expect(data).toStrictEqual(desired);

    updateTrees(data, [1], 'test');
    desired[1].value = 'test';
    expect(data).toStrictEqual(desired);
  });
});