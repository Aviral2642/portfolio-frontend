export const INTRO={fps:60,filmEnd:.8,nameStart:.845,nameEnd:.94};
export const clampIntro=p=>Math.max(0,Math.min(1,p));
export function introTime(p,duration){
 const last=Math.max(0,Math.round(duration*INTRO.fps)-1);
 const frame=Math.round(clampIntro(p/INTRO.filmEnd)*last);
 return frame ? frame/INTRO.fps+.0001 : 0;
}
