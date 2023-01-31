import { throttle } from 'lodash';
import { useCallback, useState } from 'react';

const defaultResize = (e: MouseEvent) => e.clientX;

type Prop = {
  initWidth?: number;
  throttleTime?: number;
  resize?: (event: MouseEvent) => number;
};

export const useResize = (prop?: Prop) => {
  const { initWidth, throttleTime, resize } = { initWidth: 300, throttleTime: 50, resize: defaultResize, ...prop };
  const [width, setWidth] = useState(initWidth);

  const handler = useCallback(throttle((e: MouseEvent) => setWidth(resize(e)), throttleTime), [resize, throttleTime]);

  const mount = useCallback(() => document.addEventListener('mousemove', handler), [handler]);

  const unmount = useCallback(() => document.removeEventListener('mousemove', handler), [handler]);

  return { width, mount, unmount };
};