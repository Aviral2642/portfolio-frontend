import {categoryArtwork} from './ResearchCategoryArt';
test('existing categories have distinct, local editorial artwork',()=>{
  expect(Object.keys(categoryArtwork)).toEqual(['kernel','ai-infra']);
  expect(categoryArtwork.kernel.src).not.toBe(categoryArtwork['ai-infra'].src);
  expect(categoryArtwork.kernel.theme).toBe('memory');
  expect(categoryArtwork['ai-infra'].theme).toBe('execution');
  for(const art of Object.values(categoryArtwork)) expect(art.src).toMatch(/^\/editorial\/.+\.webp$/);
});
