import {families, findings, findingById} from './findings';
import {findingIndex} from './findingIndex';

describe('findings data', () => {
  it('has unique CVE ids and a known family for each entry', () => {
    const ids = findings.map(f => f.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const f of findings) {
      expect(f.id).toMatch(/^CVE-\d{4}-\d{4,}$/);
      expect(families[f.family]).toBeTruthy();
    }
  });

  it('links every dated claim, article and reference to an https source', () => {
    for (const f of findings) {
      const urls = [
        ...f.timeline.map(e => e.url), ...(f.press || []).map(p => p.url),
        ...f.evidence.map(e => e.url), ...f.badges.filter(b => b.url).map(b => b.url),
      ];
      expect(urls.length).toBeGreaterThan(5);
      for (const url of urls) expect(url, `${f.id} has a missing or non-https link`).toMatch(/^https:\/\//);
      for (const e of f.timeline) expect(e.date).toMatch(/^\d{4}-\d{2}(-\d{2})?$/);
    }
  });

  it('gives each attack path an untrusted start and a boundary crossing', () => {
    for (const f of findings) {
      expect(f.path[0].side).toBe('outside');
      expect(f.path.findIndex(s => s.side === 'inside')).toBeGreaterThan(0);
      expect(f.path.length).toBeLessThanOrEqual(6);
    }
  });

  it('keeps timelines in date order and copy free of em dashes', () => {
    for (const f of findings) {
      const dates = f.timeline.map(e => e.date.padEnd(10, '-00'.slice(0, 3)));
      expect([...dates].sort()).toEqual(dates);
      expect(JSON.stringify(f)).not.toMatch(/—/);
    }
  });

  it('keeps the homepage index identical to the case files', () => {
    const short = findings.map(({id, product, family, score, severity, title, line, flags}) => ({id, product, family, score, severity, title, line, flags}));
    expect(findingIndex).toEqual(short);
  });

  it('finds an entry by id regardless of case', () => {
    expect(findingById('cve-2026-33017').product).toBe('Langflow');
    expect(findingById('nope')).toBeUndefined();
  });
});
