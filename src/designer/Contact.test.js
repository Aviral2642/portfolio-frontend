import React, {act} from 'react';
import {vi} from 'vitest';
import {createRoot} from 'react-dom/client';
import {Contact} from './DesignerPortfolio';
vi.mock('gsap',()=>({gsap:{registerPlugin:vi.fn()}}));
vi.mock('gsap/ScrollTrigger',()=>({ScrollTrigger:{refresh:vi.fn()}}));
global.IS_REACT_ACT_ENVIRONMENT=true;
let container,root;
beforeEach(()=>{
 container=document.createElement('div');document.body.appendChild(container);
 root=createRoot(container);vi.stubGlobal('fetch',vi.fn());
 act(()=>root.render(<Contact/>));
});
afterEach(()=>{act(()=>root.unmount());container.remove();vi.unstubAllGlobals();});
test('both contact actions link directly to the existing LinkedIn profile',()=>{
 const links=[...container.querySelectorAll('a[href="https://linkedin.com/in/aviralsrivastava23"]')];
 expect(links).toHaveLength(2);
 for(const link of links){expect(link.target).toBe('_blank');expect(link.rel.split(' ')).toContain('noreferrer');}
 expect(container.querySelector('.d-connect-link').textContent).toContain('Connect with me on LinkedIn');
 expect(container.querySelector('.d-contact-cta').getAttribute('aria-label')).toContain('Connect with me on LinkedIn');
});
test('does not collect contact details, expose email, or request the backend',()=>{
 expect(container.querySelector('form,input,textarea,button[type="submit"],a[href^="mailto:"]')).toBeNull();
 expect(container.textContent).not.toContain('@');
 expect(container.querySelector('[href="#contact-form"]')).toBeNull();
 expect(fetch).not.toHaveBeenCalled();
});
test('preserves contact navigation, a semantic heading, and secondary actions',()=>{
 expect(container.querySelector('#contact').getAttribute('aria-labelledby')).toBe('contact-heading');
 expect(container.querySelector('h2#contact-heading')).not.toBeNull();
 for(const href of ['#top','https://github.com/Aviral2642','/resume.pdf']){
  expect(container.querySelector(`a[href="${href}"]`)).not.toBeNull();
 }
});
