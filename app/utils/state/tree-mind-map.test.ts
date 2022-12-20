import { expect } from 'vitest';
import { getAdjacentId, Tree } from './tree-mind-map';

describe('extreme cases', () => {
  it('1 data only should return itself', () => {
    const testData: Tree[] = [{ id: '1', value: 'value', }];

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
                          { id: '11111', value: '', }
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
      { id: '2', value: '' }
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
      { id: '1', value: 'value' },
      { id: '2', value: 'value' },
    ];

    let result = getAdjacentId(testData, [0], 'down');
    expect(result).toBe('2');

    result = getAdjacentId(testData, [1], 'up');
    expect(result).toBe('1');
  });

  it('3 same level data should return adajcent id', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value' },
      { id: '2', value: 'value' },
      { id: '3', value: 'value' },
    ];

    let result = getAdjacentId(testData, [0], 'down');
    expect(result).toBe('2');

    result = getAdjacentId(testData, [2], 'up');
    expect(result).toBe('2');
  });

  it('5 same level data should work for middle case', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value' },
      { id: '2', value: 'value' },
      { id: '3', value: 'value' },
      { id: '4', value: 'value' },
      { id: '5', value: 'value' },
    ];
    let result = '';
    result = getAdjacentId(testData, [2], 'down');
    expect(result).toBe('4');

    result = getAdjacentId(testData, [2], 'up');
    expect(result).toBe('2');
  });

  it('5 same level data should work for next to end case', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value' },
      { id: '2', value: 'value' },
      { id: '3', value: 'value' },
      { id: '4', value: 'value' },
      { id: '5', value: 'value' },
    ];

    let result = getAdjacentId(testData, [3], 'down');
    expect(result).toBe('5');

    result = getAdjacentId(testData, [1], 'up');
    expect(result).toBe('1');
  });

  it('5 same level data should work for extreme last case', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value' },
      { id: '2', value: 'value' },
      { id: '3', value: 'value' },
      { id: '4', value: 'value' },
      { id: '5', value: 'value' },
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
      { id: '1', value: 'value', children: [{ id: '11', value: 'value' }] }
    ];

    let result = getAdjacentId(testData, [0], 'down');
    expect(result).toBe('11');

    result = getAdjacentId(testData, [0, 0], 'up');
    expect(result).toBe('1');
  });

  it('simple child case, when there are grand child present', () => {
    const testData: Tree[] = [
      { id: '1', value: 'value', children: [{ id: '11', value: 'value', children: [{ id: '111', value: 'value' }] }] }
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
          { id: '11', value: 'value' },
          { id: '12', value: 'value' },
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
          { id: '11', value: 'value', children: [{ id: '111', value: '' }] },
          { id: '12', value: 'value', children: [{ id: '121', value: '' }] },
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
          { id: '11', value: 'value', children: [{ id: '111', value: '' }] },
          { id: '12', value: 'value', children: [{ id: '121', value: '' }] },
          { id: '13', value: 'value', children: [{ id: '131', value: '' }] },
        ]
      },
      {
        id: '2', value: 'value', children: [
          {
            id: '21', value: 'value', children: [
              {
                id: '211', value: '', children: [
                  { id: '2111', value: '' },
                  { id: '2112', value: '' },
                  { id: '2113', value: '' },
                  { id: '2114', value: '' },
                ]
              },
              {
                id: '212', value: '', children: [
                  { id: '2121', value: '' },
                  { id: '2122', value: '' },
                  { id: '2123', value: '' },
                  { id: '2124', value: '' },
                ]
              },
              {
                id: '213', value: '', children: [
                  { id: '2131', value: '' },
                  { id: '2132', value: '' },
                  { id: '2133', value: '' },
                  { id: '2134', value: '' },
                ]
              },
            ]
          },
          {
            id: '22', value: 'value', children: [
              {
                id: '221', value: '', children: [
                  { id: '2211', value: '' },
                  { id: '2212', value: '' },
                  { id: '2213', value: '' },
                  { id: '2214', value: '' },
                ]
              },
              {
                id: '222', value: '', children: [
                  { id: '2221', value: '' },
                  { id: '2222', value: '' },
                  { id: '2223', value: '' },
                  { id: '2224', value: '' },
                ]
              },
              {
                id: '223', value: '', children: [
                  { id: '2231', value: '' },
                  { id: '2232', value: '' },
                  { id: '2233', value: '' },
                  { id: '2234', value: '' },
                ]
              },
            ]
          },
          {
            id: '23', value: 'value', children: [
              {
                id: '231', value: '', children: [
                  { id: '2311', value: '' },
                  { id: '2312', value: '' },
                  { id: '2313', value: '' },
                  { id: '2314', value: '' },
                ]
              },
              {
                id: '232', value: '', children: [
                  { id: '2321', value: '' },
                  { id: '2322', value: '' },
                  { id: '2323', value: '' },
                  { id: '2324', value: '' },
                ]
              },
              {
                id: '233', value: '', children: [
                  { id: '2331', value: '' },
                  { id: '2332', value: '' },
                  { id: '2333', value: '' },
                  { id: '2334', value: '' },
                ]
              },
            ]
          },
        ]
      },
      {
        id: '3', value: 'value', children: [
          { id: '31', value: 'value', children: [{ id: '311', value: '' }] },
          { id: '32', value: 'value', children: [{ id: '321', value: '' }] },
          { id: '33', value: 'value', children: [{ id: '331', value: '' }] },
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