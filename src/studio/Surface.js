import {useEffect, useRef} from 'react';

// "Beneath the surface": a dark liquid sheet over a lit circuit layer.
// The pointer leaves a decaying trail that parts the liquid and shows what is
// underneath. Raw WebGL2, two passes (trail buffer, composite), no libraries.
// Decorative only: content, links and reading never depend on it.

const VERT = `#version 300 es
precision highp float;
out vec2 uv;
void main(){
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  uv = p;
  gl_Position = vec4(p * 2. - 1., 0., 1.);
}`;

const NOISE = `
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p){
  float a = .5, s = 0.;
  mat2 r = mat2(.8, -.6, .6, .8);
  for (int i = 0; i < 4; i++) { s += a * noise(p); p = r * p * 2.03; a *= .5; }
  return s;
}`;

// Trail: previous frame drifts along a slow noise field, fades, and receives
// a soft capsule between the last two pointer positions.
const TRAIL = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D prev;
uniform vec2 a, b;       // pointer segment, uv space
uniform float aspect, radius, power, time;
${NOISE}
void main(){
  vec2 flow = vec2(noise(uv * 5. + time * .12) - .5, noise(uv * 5. + 7.3 - time * .1) - .5);
  float v = texture(prev, uv - flow * .0022).r;
  v = max(0., v * .982 - .0016);
  vec2 p = uv, pa = p - a, ba = b - a;
  pa.x *= aspect; ba.x *= aspect;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0., 1.);
  float d = length(pa - ba * h);
  v += smoothstep(radius, 0., d) * power;
  o = vec4(min(v, 1.), 0., 0., 1.);
}`;

const COMPOSITE = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D trail;
uniform vec2 res;
uniform float time, seed, fade;
uniform int mode;
uniform vec3 accent;
${NOISE}

float height(vec2 p, float m){
  float t = time * .045;
  vec2 w = vec2(fbm(p * 1.1 + vec2(t, -t * .7) + seed), fbm(p * 1.1 + vec2(5.2 - t * .8, 1.3 + t) + seed));
  return fbm(p * 1.5 + w * 1.9) - m * .55;
}

// Routed traces: quarter-arc Truchet tiles with travelling pulses and pads.
vec3 circuit(vec2 p){
  vec2 g = p * 7.;
  vec2 id = floor(g), f = fract(g);
  float r = hash(id + seed);
  if (r > .5) f.x = 1. - f.x;
  float d1 = abs(length(f) - .5), d2 = abs(length(f - 1.) - .5);
  float d = min(d1, d2);
  vec2 c = d1 < d2 ? f : f - 1.;
  float ang = atan(c.y, c.x) * .6366;
  float line = smoothstep(.055, .0, d);
  float glow = smoothstep(.34, .0, d) * .22;
  float pulse = smoothstep(.82, 1., fract(ang * .5 + time * .22 + r * 7.)) * line;
  float pad = step(.86, hash(id + 3.1 + seed)) * smoothstep(.2, .11, length(fract(g) - .5));
  // finer second layer, offset, for depth
  vec2 g2 = p * 19. + 3.7;
  vec2 f2 = fract(g2); float r2 = hash(floor(g2) + seed * 2.);
  if (r2 > .5) f2.x = 1. - f2.x;
  float e = min(abs(length(f2) - .5), abs(length(f2 - 1.) - .5));
  float fine = smoothstep(.05, .0, e) * .2;
  vec3 col = accent * (line * .6 + glow + fine) + vec3(1.) * (pulse * .95 + pad * .5);
  return col + accent * pad * .8;
}

// Case-page fields. Each is a different structure that the pointer trail lights up.
vec3 field(vec2 p, float m){
  vec3 base = vec3(.018, .015, .026) + accent * .028;
  float t = time;
  if (mode == 1) { // interference rings: two issuers, overlapping claims
    vec2 c1 = vec2(-.55 + .1 * sin(seed), .12), c2 = vec2(.6, -.18 + .1 * cos(seed));
    float v = sin(46. * length(p - c1) - t * .9) + sin(38. * length(p - c2) + t * .7);
    float line = smoothstep(.16, 0., abs(v));
    float core = smoothstep(.09, 0., length(p - c1)) + smoothstep(.09, 0., length(p - c2));
    return base + accent * (line * (.16 + m * 1.3) + core * .5);
  }
  if (mode == 2) { // nested containment cells, one of them never closing
    vec2 q = p * 2.6 + seed; vec2 id = floor(q), f = fract(q) - .5;
    float r = hash(id);
    float d = max(abs(f.x), abs(f.y));
    float rings = smoothstep(.035, 0., abs(fract(d * 5. - t * .12 * (r + .2)) - .5));
    float gap = step(.72, r) * step(abs(f.y), .09) * step(0., f.x);
    return base + accent * (rings * (1. - gap) * (.1 + r * .22 + m * 1.2));
  }
  if (mode == 3) { // memory cells with a sweep that stops short
    vec2 g = p * vec2(30., 30.) + seed; vec2 id = floor(g), f = fract(g);
    float cell = step(.14, f.x) * step(.14, f.y);
    float v = hash(id + floor(t * .5 + hash(id) * 9.));
    float sweep = smoothstep(.1, 0., abs(fract(t * .1) * 2.4 - 1.2 - p.x)) * step(p.x, .25);
    return base + accent * cell * (v * v * .26 + sweep * .7 + m * 1.2 * (.3 + v));
  }
  if (mode == 4) { // rows of records streaming past each other
    float row = floor(p.y * 24. + seed); float fy = fract(p.y * 24. + seed);
    float dir = hash(vec2(row, 3.)) > .5 ? 1. : -1.;
    float x = p.x * 7. + t * (hash(vec2(row, 1.)) * .5 + .12) * dir;
    float seg = step(.5, hash(vec2(floor(x), row))) * smoothstep(0., .08, fract(x)) * smoothstep(1., .9, fract(x));
    float bar = smoothstep(.5, .28, abs(fy - .5));
    return base + accent * seg * bar * (.18 + m * 1.2);
  }
  // 5: fracture lines, a surface that has already been broken into
  vec2 q = p * 3.2 + seed; vec2 id = floor(q), f = fract(q);
  float f1 = 9., f2 = 9.; float shade = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j));
    vec2 h = vec2(hash(id + o), hash(id + o + 7.3));
    vec2 c = o + .5 + .42 * sin(t * .22 + 6.28 * h);
    float d = length(c - f);
    if (d < f1) { f2 = f1; f1 = d; shade = h.x; } else if (d < f2) f2 = d;
  }
  float edge = smoothstep(.07, 0., f2 - f1);
  return base + accent * (edge * (.42 + m * 1.5) + shade * .07 * (1. + m * 3.));
}

void main(){
  vec2 p = (uv - .5) * vec2(res.x / res.y, 1.);
  float m = texture(trail, uv).r;
  m = smoothstep(.02, .85, m);

  if (mode > 0) {
    vec3 c = field(p, m) + accent * m * .1;
    float vg = smoothstep(1.3, .2, length(p * vec2(.75, 1.05)));
    c *= mix(.3, 1., vg);
    c = mix(vec3(.022, .02, .032), c, smoothstep(0., .4, uv.y) * fade);
    c += (hash(uv * res + time) - .5) * .026;
    o = vec4(c, 1.);
    return;
  }

  // liquid sheet: normal from height differences
  float e = .012;
  float h0 = height(p, m);
  float hx = height(p + vec2(e, 0.), m), hy = height(p + vec2(0., e), m);
  vec3 n = normalize(vec3((h0 - hx) / e * .34, (h0 - hy) / e * .34, 1.));
  vec3 v = vec3(0., 0., 1.);
  vec3 l1 = normalize(vec3(-.55, .65, .55)), l2 = normalize(vec3(.7, -.3, .45));
  float s1 = pow(max(dot(reflect(-l1, n), v), 0.), 26.);
  float s2 = pow(max(dot(reflect(-l2, n), v), 0.), 60.);
  float fres = pow(1. - n.z, 1.6);
  vec3 liquid = vec3(.016, .012, .03)
    + accent * (fres * .85 + s1 * .5)
    + vec3(.95, .9, 1.) * (s2 * .9 + s1 * .18);
  liquid += accent * .05 * h0;

  // what is underneath, refracted by the sheet near the opening
  vec2 q = p + n.xy * .09 * (1. - m);
  vec3 under = vec3(.035, .02, .075) + circuit(q + vec2(time * .006, 0.));
  under *= .55 + .65 * smoothstep(0., .9, m);

  float open = smoothstep(.22, .62, m);
  vec3 col = mix(liquid, under, open);
  float rim = smoothstep(.1, .34, m) * (1. - smoothstep(.34, .7, m));
  col += (accent * 1.1 + .25) * rim * .55;

  // frame: vignette, floor fade into the page, fine grain
  float vig = smoothstep(1.25, .25, length(p * vec2(.8, 1.05)));
  col *= mix(.35, 1., vig);
  col = mix(vec3(.027, .024, .043), col, smoothstep(0., .34, uv.y) * fade);
  col += (hash(uv * res + time) - .5) * .028;
  o = vec4(col, 1.);
}`;

function build(gl, vs, fsSource, names) {
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsSource); gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(fs));
  const program = gl.createProgram();
  gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
  return {program, fs, u: Object.fromEntries(names.map(n => [n, gl.getUniformLocation(program, n)]))};
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
}

function start(canvas, {accent, seed, mode}) {
  const gl = canvas.getContext('webgl2', {antialias: false, depth: false, alpha: false, powerPreference: 'high-performance'});
  if (!gl) return null;
  let vs, trailP, compP;
  try {
    vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, VERT); gl.compileShader(vs);
    trailP = build(gl, vs, TRAIL, ['prev', 'a', 'b', 'aspect', 'radius', 'power', 'time']);
    compP = build(gl, vs, COMPOSITE, ['trail', 'res', 'time', 'seed', 'fade', 'accent', 'mode']);
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[surface]', error);
    return null;
  }
  const TW = 320, TH = 200;
  const target = () => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, TW, TH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return {tex, fbo};
  };
  let read = target(), write = target();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rgb = hexToRgb(accent);
  const state = {frame: 0, visible: true, disposed: false, last: null, point: null, lastInput: -1e9, t0: performance.now(), fade: 0};

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * (canvas.clientWidth > 900 ? .8 : 1);
    const w = Math.max(2, Math.round(canvas.clientWidth * dpr)), h = Math.max(2, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }

  function draw(now) {
    state.frame = 0;
    if (state.disposed) return;
    const time = (now - state.t0) / 1000;
    resize();
    // With no recent input, a slow figure keeps the surface opening on its own.
    let p = state.point;
    const idle = now - state.lastInput > 2600;
    if (idle) {
      p = [.5 + .3 * Math.sin(time * .33) + .08 * Math.sin(time * .9), .52 + .2 * Math.sin(time * .47 + 1.3)];
    }
    const from = state.last || p, to = p || [.5, .5];
    const speed = Math.hypot(to[0] - from[0], to[1] - from[1]);
    gl.useProgram(trailP.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, write.fbo);
    gl.viewport(0, 0, TW, TH);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, read.tex);
    gl.uniform1i(trailP.u.prev, 0);
    gl.uniform2f(trailP.u.a, from[0], from[1]);
    gl.uniform2f(trailP.u.b, to[0], to[1]);
    gl.uniform1f(trailP.u.aspect, canvas.width / canvas.height);
    gl.uniform1f(trailP.u.radius, idle ? .13 : Math.min(.2, .085 + speed * 1.6));
    gl.uniform1f(trailP.u.power, p ? (idle ? .05 : .2) : 0);
    gl.uniform1f(trailP.u.time, time);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    [read, write] = [write, read];
    state.last = to;

    state.fade = Math.min(1, state.fade + .02);
    gl.useProgram(compP.program);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindTexture(gl.TEXTURE_2D, read.tex);
    gl.uniform1i(compP.u.trail, 0);
    gl.uniform2f(compP.u.res, canvas.width, canvas.height);
    gl.uniform1f(compP.u.time, time);
    gl.uniform1f(compP.u.seed, seed);
    gl.uniform1i(compP.u.mode, mode);
    gl.uniform1f(compP.u.fade, reduced ? 1 : state.fade);
    gl.uniform3f(compP.u.accent, rgb[0], rgb[1], rgb[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.dataset.ready = 'true';
    if (!reduced && state.visible && !document.hidden) state.frame = requestAnimationFrame(draw);
  }
  const kick = () => { if (!state.frame && !state.disposed) state.frame = requestAnimationFrame(draw); };

  function pointer(e) {
    const r = canvas.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) return;
    state.point = [(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height];
    state.lastInput = performance.now();
    if (reduced) kick();
  }
  const observer = new IntersectionObserver(([entry]) => { state.visible = entry.isIntersecting; if (state.visible) kick(); });
  observer.observe(canvas);
  const visibility = () => { if (!document.hidden) kick(); };
  const lost = e => { e.preventDefault(); state.disposed = true; canvas.dataset.ready = 'false'; };
  window.addEventListener('pointermove', pointer, {passive: true});
  window.addEventListener('resize', kick, {passive: true});
  document.addEventListener('visibilitychange', visibility);
  canvas.addEventListener('webglcontextlost', lost);
  if (reduced) {
    // One composed still frame: a fixed opening, no animation loop.
    state.point = [.68, .56]; state.lastInput = performance.now();
    for (let i = 0; i < 14; i++) draw(state.t0 + 40000);
  } else kick();

  return () => {
    state.disposed = true;
    cancelAnimationFrame(state.frame);
    observer.disconnect();
    window.removeEventListener('pointermove', pointer);
    window.removeEventListener('resize', kick);
    document.removeEventListener('visibilitychange', visibility);
    canvas.removeEventListener('webglcontextlost', lost);
    for (const t of [read, write]) { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo); }
    for (const p of [trailP, compP]) { gl.deleteProgram(p.program); gl.deleteShader(p.fs); }
    gl.deleteShader(vs);
  };
}

export default function Surface({accent = '#a077ff', seed = 0, mode = 0, className = ''}) {
  const canvas = useRef(null);
  useEffect(() => start(canvas.current, {accent, seed, mode}) || undefined, [accent, seed, mode]);
  return <canvas ref={canvas} className={`st-surface ${className}`} aria-hidden="true"/>;
}
