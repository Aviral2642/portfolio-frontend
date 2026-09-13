import {INTRO,introTime} from './introTiming';
test('starts immediately, clamps, and holds the last frame for the name',()=>{
 expect(introTime(-1,10)).toBe(0);expect(introTime(0,10)).toBe(0);expect(introTime(.001,10)).toBeGreaterThan(0);
 expect(introTime(INTRO.filmEnd,10)).toBeCloseTo(599/60,3);expect(introTime(1,10)).toBe(introTime(INTRO.filmEnd,10));
 expect(INTRO.nameStart).toBeGreaterThan(INTRO.filmEnd);
 expect(introTime(1,9.933333)).toBeCloseTo(595/60,3);
});
test('reverse and fast jumps produce deterministic frame states',()=>{
 const positions=[.2,.78,.1,1,.5,0];expect(positions.map(p=>introTime(p,10))).toEqual([...positions].reverse().map(p=>introTime(p,10)).reverse());
});
