// Case pages are a separate chunk. Hover, idle time and the page curtain warm it.
let pending;
export function preloadCase() {
  if (!pending) pending = import('./CvePage').catch(error => { pending = undefined; throw error; });
  return pending;
}
