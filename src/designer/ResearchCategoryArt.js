import React, {useRef} from 'react';
import {ArchiveArtwork} from './ExploitsPreview';

// Presentation metadata only. Research records and their category assignments stay untouched.
export const categoryArtwork = {
  kernel: {
    src: '/editorial/exploits-silicon.webp',
    theme: 'memory',
    words: ['MEMORY', 'LIFETIMES', 'BOUNDARIES'],
  },
  'ai-infra': {
    src: '/editorial/exploits-ai-layers.webp',
    theme: 'execution',
    words: ['MODELS', 'TOOLS', 'RUNTIMES'],
  },
};

export default function ResearchCategoryArt({category, title, note, count}) {
  const root = useRef(null);
  const art = categoryArtwork[category];
  return <header className={`x-category-art x-category-${art.theme}`} ref={root}>
    <ArchiveArtwork target={root} src={art.src}/>
    <div className="x-category-content">
      <div className="x-category-heading">
        <h2 id={`category-${category}`}>{title}</h2>
        <span className="x-category-count">{count} entries</span>
      </div>
      <p>{note}</p>
      <div className="x-category-terms" aria-hidden="true">{art.words.map(word=><span key={word}>{word}</span>)}</div>
    </div>
    <span className="x-art-caption">Editorial artwork</span>
  </header>;
}
