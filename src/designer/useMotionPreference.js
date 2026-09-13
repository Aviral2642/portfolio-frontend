import {useSyncExternalStore} from 'react';

const query = '(prefers-reduced-motion: reduce)';
const read = () => window.matchMedia(query).matches;
function subscribe(notify) {
  const media = window.matchMedia(query);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
}
// Motion 10 retains its initial hook value. This store responds to live OS changes.
export default function useMotionPreference() {
  return useSyncExternalStore(subscribe, read, () => true);
}
