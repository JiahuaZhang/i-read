import { expect } from 'vitest';
import { getAdjacentId, Tree } from './tree-mind-map';

describe('extreme cases', () => {
  it('1 data only should return itself', () => {
    const testData: Tree[] = [{ id: '1', value: 'value', children: [] }];

    let result = getAdjacentId(testData, [0], 'down');
    expect(result).toBe('1');

    result = getAdjacentId(testData, [0], 'up');
    expect(result).toBe('1');
  });

  it('final data itself should return itself, extreme prev case should get the final leave of prev', () => {
    const testData: Tree[] = [
      {
        id: '1', value: 'value',
        children: [
          {
            id: '11', value: '', children: [
              {
                id: '111', value: '', children: [
                  {
                    id: '1111', value: '', children: [
                      {
                        id: '1111', value: '', children: [
                          { id: '11111', value: '', children: [] }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      { id: '2', value: '', children: [] }
    ];

    let result = '';
    result = getAdjacentId(testData, [0, 0, 0, 0, 0], 'down');
    expect(result).toBe('11111');

    result = getAdjacentId(testData, [0], 'up');
    expect(result).toBe('1');

    result = getAdjacentId(testData, [1], 'up');
    expect(result).toBe('11111');
  });
});

describe('same level simple cases', () => {
  it('2 same level data should return adajcent id', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value', children: [] },
      { id: '2', value: 'value', children: [] },
    ];

    let result = getAdjacentId(testData, [0], 'down');
    expect(result).toBe('2');

    result = getAdjacentId(testData, [1], 'up');
    expect(result).toBe('1');
  });

  it('3 same level data should return adajcent id', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value', children: [] },
      { id: '2', value: 'value', children: [] },
      { id: '3', value: 'value', children: [] },
    ];

    let result = getAdjacentId(testData, [0], 'down');
    expect(result).toBe('2');

    result = getAdjacentId(testData, [2], 'up');
    expect(result).toBe('2');
  });

  it('5 same level data should work for middle case', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value', children: [] },
      { id: '2', value: 'value', children: [] },
      { id: '3', value: 'value', children: [] },
      { id: '4', value: 'value', children: [] },
      { id: '5', value: 'value', children: [] },
    ];
    let result = '';
    result = getAdjacentId(testData, [2], 'down');
    expect(result).toBe('4');

    result = getAdjacentId(testData, [2], 'up');
    expect(result).toBe('2');
  });

  it('5 same level data should work for next to end case', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value', children: [] },
      { id: '2', value: 'value', children: [] },
      { id: '3', value: 'value', children: [] },
      { id: '4', value: 'value', children: [] },
      { id: '5', value: 'value', children: [] },
    ];

    let result = getAdjacentId(testData, [3], 'down');
    expect(result).toBe('5');

    result = getAdjacentId(testData, [1], 'up');
    expect(result).toBe('1');
  });

  it('5 same level data should work for extreme last case', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value', children: [] },
      { id: '2', value: 'value', children: [] },
      { id: '3', value: 'value', children: [] },
      { id: '4', value: 'value', children: [] },
      { id: '5', value: 'value', children: [] },
    ];

    let result = getAdjacentId(testData, [4], 'down');
    expect(result).toBe('5');

    result = getAdjacentId(testData, [0], 'up');
    expect(result).toBe('1');
  });
});

describe('multiple level for next case', () => {
  it('simple child case', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value', children: [{ id: '11', value: 'value', children: [] }] }
    ];

    let result = getAdjacentId(testData, [0], 'down');
    expect(result).toBe('11');

    result = getAdjacentId(testData, [0, 0], 'up');
    expect(result).toBe('1');
  });

  it('simple child case, when there are grand child present', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value', children: [{ id: '11', value: 'value', children: [{ id: '111', value: 'value', children: [] }] }] }
    ];

    let result = getAdjacentId(testData, [0], 'down');
    expect(result).toBe('11');

    result = getAdjacentId(testData, [0, 0, 0], 'up');
    expect(result).toBe('11');
  });

  it('simple child case, when there are multiple children', () => {
    const testData: Tree[] = [
      {
        id: '1', value: 'value', children: [
          { id: '11', value: 'value', children: [] },
          { id: '12', value: 'value', children: [] },
        ]
      }
    ];

    let result = getAdjacentId(testData, [0], 'down');
    expect(result).toBe('11');

    result = getAdjacentId(testData, [0, 0], 'up');
    expect(result).toBe('1');

    result = getAdjacentId(testData, [0, 1], 'up');
    expect(result).toBe('11');
  });

  it('simple child case, when there are multiple children & grand childs', () => {
    const testData: Tree[] = [
      {
        id: '1', value: 'value', children: [
          { id: '11', value: 'value', children: [{ id: '111', value: '', children: [] }] },
          { id: '12', value: 'value', children: [{ id: '121', value: '', children: [] }] },
        ]
      }
    ];

    let result = '';
    result = getAdjacentId(testData, [0], 'down');
    expect(result).toBe('11');

    result = getAdjacentId(testData, [0, 0], 'down');
    expect(result).toBe('111');

    result = getAdjacentId(testData, [0, 0, 0], 'down');
    expect(result).toBe('12');

    result = getAdjacentId(testData, [0, 0, 0], 'up');
    expect(result).toBe('11');

    result = getAdjacentId(testData, [0, 1, 0], 'up');
    expect(result).toBe('12');

    result = getAdjacentId(testData, [0, 1], 'up');
    expect(result).toBe('111');
  });

  it('complicate child case, when there are multiple children & grand childs', () => {
    const testData: Tree[] = [
      {
        id: '1', value: 'value', children: [
          { id: '11', value: 'value', children: [{ id: '111', value: '', children: [] }] },
          { id: '12', value: 'value', children: [{ id: '121', value: '', children: [] }] },
          { id: '13', value: 'value', children: [{ id: '131', value: '', children: [] }] },
        ]
      },
      {
        id: '2', value: 'value', children: [
          {
            id: '21', value: 'value', children: [
              {
                id: '211', value: '', children: [
                  { id: '2111', value: '', children: [] },
                  { id: '2112', value: '', children: [] },
                  { id: '2113', value: '', children: [] },
                  { id: '2114', value: '', children: [] },
                ]
              },
              {
                id: '212', value: '', children: [
                  { id: '2121', value: '', children: [] },
                  { id: '2122', value: '', children: [] },
                  { id: '2123', value: '', children: [] },
                  { id: '2124', value: '', children: [] },
                ]
              },
              {
                id: '213', value: '', children: [
                  { id: '2131', value: '', children: [] },
                  { id: '2132', value: '', children: [] },
                  { id: '2133', value: '', children: [] },
                  { id: '2134', value: '', children: [] },
                ]
              },
            ]
          },
          {
            id: '22', value: 'value', children: [
              {
                id: '221', value: '', children: [
                  { id: '2211', value: '', children: [] },
                  { id: '2212', value: '', children: [] },
                  { id: '2213', value: '', children: [] },
                  { id: '2214', value: '', children: [] },
                ]
              },
              {
                id: '222', value: '', children: [
                  { id: '2221', value: '', children: [] },
                  { id: '2222', value: '', children: [] },
                  { id: '2223', value: '', children: [] },
                  { id: '2224', value: '', children: [] },
                ]
              },
              {
                id: '223', value: '', children: [
                  { id: '2231', value: '', children: [] },
                  { id: '2232', value: '', children: [] },
                  { id: '2233', value: '', children: [] },
                  { id: '2234', value: '', children: [] },
                ]
              },
            ]
          },
          {
            id: '23', value: 'value', children: [
              {
                id: '231', value: '', children: [
                  { id: '2311', value: '', children: [] },
                  { id: '2312', value: '', children: [] },
                  { id: '2313', value: '', children: [] },
                  { id: '2314', value: '', children: [] },
                ]
              },
              {
                id: '232', value: '', children: [
                  { id: '2321', value: '', children: [] },
                  { id: '2322', value: '', children: [] },
                  { id: '2323', value: '', children: [] },
                  { id: '2324', value: '', children: [] },
                ]
              },
              {
                id: '233', value: '', children: [
                  { id: '2331', value: '', children: [] },
                  { id: '2332', value: '', children: [] },
                  { id: '2333', value: '', children: [] },
                  { id: '2334', value: '', children: [] },
                ]
              },
            ]
          },
        ]
      },
      {
        id: '3', value: 'value', children: [
          { id: '31', value: 'value', children: [{ id: '311', value: '', children: [] }] },
          { id: '32', value: 'value', children: [{ id: '321', value: '', children: [] }] },
          { id: '33', value: 'value', children: [{ id: '331', value: '', children: [] }] },
        ]
      },
    ];

    // let result = '';
    let result = getAdjacentId(testData, [1, 1, 1, 1], 'down');
    expect(result).toBe('2223');

    result = getAdjacentId(testData, [1, 1, 1, 3], 'down');
    expect(result).toBe('223');

    result = getAdjacentId(testData, [1, 1, 1, 1], 'up');
    expect(result).toBe('2221');
  });
});