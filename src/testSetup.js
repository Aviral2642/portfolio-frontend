import {vi} from 'vitest';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
Object.defineProperty(window, 'matchMedia', {writable: true, value: vi.fn(query => ({
  matches: false, media: query, addListener() {}, removeListener() {},
  addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
}))});
