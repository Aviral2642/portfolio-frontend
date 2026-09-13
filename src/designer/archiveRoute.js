// Keep the archive out of the initial homepage bundle. Hover/focus can warm it.
let pending;
export function preloadArchive() {
  if (!pending) pending = import('../pages/Exploits').catch(error => {
    pending = undefined;
    throw error;
  });
  return pending;
}
