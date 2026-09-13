import {bytes,sections,strings,sectionAt,instructions} from './specimen';
test('the prepared sample is a valid WebAssembly module without executing it',()=>{
 expect(WebAssembly.validate(bytes)).toBe(true);
 expect([...bytes.slice(0,8)]).toEqual([0,97,115,109,1,0,0,0]);
});
test('all section ranges are contiguous and account for every byte',()=>{
 let end=0;for(const section of sections){expect(section.start).toBe(end);end=section.end;expect(sectionAt(section.start)).toBe(section);}
 expect(end).toBe(bytes.length);expect(sectionAt(end)).toBeUndefined();
});
test('displayed strings are extracted from the actual byte array',()=>{
 expect(strings.some(value=>value.text==='answer')).toBe(true);
 for(const value of strings)expect(String.fromCharCode(...bytes.slice(value.start,value.start+value.text.length))).toBe(value.text);
});
test('annotated instructions match the code bytes and no import section exists',()=>{
 expect([...bytes.slice(instructions[0].offset,instructions[0].offset+2)]).toEqual([65,42]);
 expect(bytes[instructions[1].offset]).toBe(11);
 expect(sections.map(section=>section.id)).not.toContain('import');
});
