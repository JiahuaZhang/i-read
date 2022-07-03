import { throttle } from 'lodash';
import { useMemo, useState } from 'react';

const defaultResize = (e: MouseEvent) => e.clientX;

export const useResize = ({ initWidth, throttleTime, resize } = { initWidth: 300, throttleTime: 50, resize: defaultResize }) => {
  const [width, setWidth] = useState(initWidth);

  const handler = useMemo(() => throttle((e: MouseEvent) => setWidth(resize(e)), throttleTime), [resize, throttleTime]);

  const mount = () => document.addEventListener('mousemove', handler);

  const unmount = () => document.removeEventListener('mousemove', handler);

  return { width, mount, unmount };
};