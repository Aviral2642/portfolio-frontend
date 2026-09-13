import {isPlainNavigation, waitForArchive} from './archiveTransition';
import {vi} from 'vitest';
vi.mock('./archiveRoute',()=>({preloadArchive:vi.fn()}));

test('preserves modified clicks and already-handled events',()=>{
  const event={button:0,defaultPrevented:false};
  expect(isPlainNavigation(event)).toBe(true);
  for(const key of ['metaKey','ctrlKey','shiftKey','altKey','defaultPrevented']) {
    expect(isPlainNavigation({...event,[key]:true})).toBe(false);
  }
  expect(isPlainNavigation({...event,button:1})).toBe(false);
});

test('snapshot preparation waits for actual archive content',async()=>{
  const promise=waitForArchive(100);
  const header=document.createElement('header');
  header.className='x-masthead';
  header.appendChild(document.createElement('h1'));
  document.body.appendChild(header);
  await promise;
  await waitForArchive(100);
  header.remove();
});

test('missing destination cannot leave an unbounded snapshot wait',async()=>{
  await expect(waitForArchive(5)).rejects.toThrow('Archive did not mount');
});
