import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import {vi} from 'vitest';
import useMotionPreference from './useMotionPreference';

test('responds to preference changes in both directions and cleans up', () => {
  const listeners = new Set();
  const media = {matches: false, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn)};
  const mock = vi.spyOn(window, 'matchMedia').mockReturnValue(media);
  const el = document.createElement('div'), root = createRoot(el);
  function Probe() {return React.createElement('output', null, String(useMotionPreference()));}
  try {
    act(() => root.render(React.createElement(Probe)));
    expect(el.textContent).toBe('false');
    act(() => {media.matches = true; listeners.forEach(fn => fn());});
    expect(el.textContent).toBe('true');
    act(() => {media.matches = false; listeners.forEach(fn => fn());});
    expect(el.textContent).toBe('false');
  } finally {act(() => root.unmount());mock.mockRestore();}
  expect(listeners.size).toBe(0);
});
