export default function IdentityHero({embedded=false}){
 const Tag=embedded?'div':'section';
 return <Tag id={embedded?undefined:'top'} className="identity" aria-label="Introduction">
  <p className="identity-role">Security engineer &amp; researcher</p>
  <h1><span>Aviral</span><span>Srivastava<span className="identity-dot">.</span></span></h1>
  <div className="identity-bottom"><p>I look beneath the surface.<br/><span>Vulnerability research. Binary analysis. Malware analysis.</span></p><div className="identity-links"><a href="#research">View research ↗</a><a href="/resume.pdf" target="_blank" rel="noreferrer">Resume ↗</a></div></div>
 </Tag>;
}
