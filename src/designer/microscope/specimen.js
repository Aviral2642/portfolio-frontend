// Original, benign WASM teaching specimen. No imports, no execution, no uploads.
const ascii = value => [...value].map(character => character.charCodeAt(0));
const note = 'AVIRAL / LOOK CLOSER. A string is evidence, not proof of behavior.';
const chunks = [
 {id:'header',name:'Preamble',description:'The magic bytes identify WebAssembly; the next four bytes declare version 1.',bytes:[0,97,115,109,1,0,0,0]},
 {id:'type',name:'Type',description:'One function signature: no parameters, one 32-bit integer result.',bytes:[1,5,1,96,0,1,127]},
 {id:'function',name:'Function',description:'One defined function refers to type index 0. This section describes the function; its body lives in Code.',bytes:[3,2,1,0]},
 {id:'export',name:'Export',description:'The name “answer” exposes function index 0. A name tells us what is callable, not what it does.',bytes:[7,10,1,6,...ascii('answer'),0,0]},
 {id:'code',name:'Code',description:'No local variables. Push the integer 42, then end the function. With no imports, this specimen cannot call host APIs.',bytes:[10,6,1,4,0,65,42,11]},
 {id:'custom',name:'Custom',description:'An optional custom section named “notes” contains our teaching text. Custom data does not determine execution.',bytes:[0,7+note.length,5,...ascii('notes'),0,...ascii(note)]},
];
let offset=0;
export const sections=chunks.map(chunk=>{const result={...chunk,start:offset,end:offset+chunk.bytes.length};offset=result.end;return result;});
export const bytes=Uint8Array.from(sections.flatMap(section=>section.bytes));
export const hex=value=>value.toString(16).toUpperCase().padStart(2,'0');
export const address=value=>`0x${value.toString(16).toUpperCase().padStart(4,'0')}`;
export const sectionAt=index=>sections.find(section=>index>=section.start&&index<section.end);
export function extractStrings(input=bytes,minLength=4){
 const strings=[];let start=0,text='';
 for(let index=0;index<=input.length;index++){
  if(input[index]>=32&&input[index]<=126){if(!text)start=index;text+=String.fromCharCode(input[index]);}
  else{if(text.length>=minLength)strings.push({start,text});text='';}
 }
 return strings;
}
export const strings=extractStrings();
export const instructions=[
 {offset:36,encoding:'41 2A',name:'i32.const 42',title:'A constant enters the stack.',detail:'Opcode 0x41 reads the following signed LEB128 integer. Here, 0x2A encodes 42.',stack:'42'},
 {offset:38,encoding:'0B',name:'end',title:'The function completes.',detail:'The stack contains the i32 result required by its type. The caller would receive 42.',stack:'42 → result'},
];
