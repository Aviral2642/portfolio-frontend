// One line-art mark per finding family. Drawn in currentColor / --accent.
const marks = {
  // a request crossing a boundary and landing inside
  execution: <>
    <line x1="60" y1="8" x2="60" y2="112" className="g-dash"/>
    <path d="M10 60h64m-16-16 16 16-16 16" className="g-hot"/>
    <rect x="82" y="40" width="28" height="40" rx="2"/>
    <path d="M90 54l6 6-6 6m10 0h6" className="g-hot"/>
  </>,
  // two issuers, one token going to the wrong one
  identity: <>
    <circle cx="34" cy="38" r="18"/><circle cx="86" cy="82" r="18" className="g-hot"/>
    <path d="M34 38l52 44" className="g-dash"/>
    <circle cx="60" cy="60" r="5" className="g-fill"/>
    <path d="M28 38h12m40 44h12"/>
  </>,
  // nested containment with a gap
  isolation: <>
    <rect x="10" y="10" width="100" height="100" rx="2"/>
    <path d="M30 30h60v60H58m-12 0H30V30" className="g-hot"/>
    <rect x="48" y="48" width="24" height="24" className="g-fill"/>
    <path d="M52 90v22" className="g-dash"/>
  </>,
  // a row of cells, a read that runs past its own
  memory: <>
    {[0, 1, 2, 3, 4].map(i => <rect key={i} x={10 + i * 20} y="44" width="20" height="32" className={i > 2 ? 'g-hot' : ''}/>)}
    <path d="M14 30h84m-10-8 10 8-10 8" className="g-hot"/>
    <line x1="70" y1="20" x2="70" y2="100" className="g-dash"/>
    <rect x="72" y="46" width="16" height="28" className="g-fill"/>
  </>,
  // stacked tables, a query cutting through
  data: <>
    <ellipse cx="60" cy="28" rx="36" ry="12"/>
    <path d="M24 28v64c0 6.6 16 12 36 12s36-5.4 36-12V28M24 60c0 6.6 16 12 36 12s36-5.4 36-12"/>
    <path d="M8 96 112 24" className="g-hot"/>
    <circle cx="60" cy="60" r="5" className="g-fill"/>
  </>,
  // one record on a wire, and a second request hidden inside it
  protocol: <>
    <path d="M6 60h108" className="g-dash"/>
    <rect x="14" y="40" width="92" height="40" rx="2"/>
    <path d="M38 40v40"/>
    <rect x="62" y="48" width="36" height="24" className="g-hot"/>
    <rect x="68" y="54" width="10" height="12" className="g-fill"/>
  </>,
};

export default function Glyph({family, className = ''}) {
  return <svg className={`st-glyph ${className}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">{marks[family] || marks.execution}</svg>;
}
