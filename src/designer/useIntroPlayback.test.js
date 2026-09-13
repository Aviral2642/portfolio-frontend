import React,{act,useRef} from 'react';
import {createRoot} from 'react-dom/client';
import {useMotionValue} from 'framer-motion';
import {vi} from 'vitest';
import {useIntroDecoder} from './useIntroPlayback';

let container,root,play,pause,score,readyState;
const fail=()=>{};
function Harness(){
 const video=useRef(null),region=useRef(null);
 score=useMotionValue(.4);
 const {status,activate}=useIntroDecoder(video,region,score,false,fail);
 return <section ref={region}><video ref={video}/><button onClick={activate}>{status}</button></section>;
}
beforeEach(()=>{
 readyState=1;
 vi.useFakeTimers();
 vi.stubGlobal('IntersectionObserver',class{observe(){}disconnect(){}});
 vi.stubGlobal('requestAnimationFrame',cb=>setTimeout(cb,16));
 vi.stubGlobal('cancelAnimationFrame',clearTimeout);
 play=vi.spyOn(HTMLMediaElement.prototype,'play').mockResolvedValue();
 pause=vi.spyOn(HTMLMediaElement.prototype,'pause').mockImplementation(()=>{});
 vi.spyOn(HTMLMediaElement.prototype,'readyState','get').mockImplementation(()=>readyState);
 vi.spyOn(HTMLMediaElement.prototype,'duration','get').mockReturnValue(10);
 container=document.createElement('div');document.body.append(container);root=createRoot(container);
});
afterEach(()=>{act(()=>root.unmount());container.remove();vi.restoreAllMocks();vi.unstubAllGlobals();vi.useRealTimers();});
test('initializes muted inline playback and seeks from metadata without waiting for loadeddata',async()=>{
 await act(async()=>root.render(<Harness/>));
 expect(play).toHaveBeenCalledTimes(1);expect(pause).toHaveBeenCalled();
 const video=container.querySelector('video');expect(video.muted).toBe(true);expect(video.playsInline).toBe(true);
 await act(async()=>vi.advanceTimersByTime(20));expect(video.currentTime).toBeGreaterThan(4);
 await act(async()=>{score.set(.1);vi.advanceTimersByTime(20);});expect(video.currentTime).toBeLessThan(2);
});
test('blocked playback offers a gesture retry and then hands control back to scroll',async()=>{
 play.mockRejectedValueOnce(new DOMException('Blocked','NotAllowedError'));
 await act(async()=>root.render(<Harness/>));expect(container.textContent).toBe('blocked');
 await act(async()=>container.querySelector('button').click());
 expect(play).toHaveBeenCalledTimes(2);expect(container.textContent).toBe('ready');
});
test('does not restart playback on touches after initialization or after unmount',async()=>{
 await act(async()=>root.render(<Harness/>));
 await act(async()=>window.dispatchEvent(new Event('touchstart')));expect(play).toHaveBeenCalledTimes(1);
 act(()=>root.unmount());root=createRoot(container);
 window.dispatchEvent(new Event('touchstart'));expect(play).toHaveBeenCalledTimes(1);
});
