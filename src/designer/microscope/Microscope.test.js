import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {vi} from 'vitest';
import Microscope from './Microscope';
vi.mock('../useMotionPreference',()=>({default:()=>true}));
let container,root;
beforeEach(()=>{vi.stubGlobal('ResizeObserver',class{observe(){}disconnect(){}});container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);act(()=>root.render(<Microscope/>));});
afterEach(()=>{act(()=>root.unmount());container.remove();vi.unstubAllGlobals();});
test('offers every inspection view without adding execution or upload controls',()=>{
 const modes=[...container.querySelectorAll('.mi-view-select button')];
 expect(modes).toHaveLength(4);
 modes.forEach((button,index)=>{act(()=>button.click());expect(container.querySelector('.mi-stage').dataset.view).toBe(String(index));expect(button.getAttribute('aria-pressed')).toBe('true');});
 expect(container.querySelector('input[type="file"]')).toBeNull();
 expect(container.textContent).toContain('never instantiates or executes');
});
test('section and instruction selection update the readable explanation',()=>{
 const modes=container.querySelectorAll('.mi-view-select button');
 act(()=>modes[1].click());act(()=>container.querySelector('.mi-stack button').click());
 expect(container.querySelector('.mi-explanation h2').textContent).toBe('Preamble');
 act(()=>modes[3].click());act(()=>container.querySelectorAll('.mi-instructions button')[1].click());
 expect(container.querySelector('.mi-explanation h2').textContent).toBe('The function completes.');
});
test('hidden lens is removed from keyboard order and the preview is not indexed',()=>{
 expect(container.querySelector('.mi-byte-view svg').getAttribute('tabindex')).toBe('0');
 act(()=>container.querySelectorAll('.mi-view-select button')[2].click());
 expect(container.querySelector('.mi-byte-view svg').getAttribute('tabindex')).toBe('-1');
 expect(document.querySelector('meta[name="robots"]').content).toBe('noindex,nofollow');
});
