import { expect, test, vi } from 'vitest';
import { loadLauraSnapshot } from '../../../scripts/lauraSnapshot';

test('captures each page once for the build snapshot', async () => {
  const home = { settings: { email: 'home@example.com' } };
  const about = { settings: { email: 'about@example.com' } };
  const services = { settings: { email: 'services@example.com' } };
  const gallery = { settings: { email: 'gallery@example.com' } };
  const source = {
    loadHome: vi.fn().mockResolvedValue(home),
    loadAbout: vi.fn().mockResolvedValue(about),
    loadServices: vi.fn().mockResolvedValue(services),
    loadGallery: vi.fn().mockResolvedValue(gallery),
  };
  expect(await loadLauraSnapshot(source)).toEqual({
    home,
    about,
    services,
    gallery,
  });
  for (const load of Object.values(source))
    expect(load).toHaveBeenCalledTimes(1);
});

test('fails snapshot generation if required published content cannot be loaded', async () => {
  const source = {
    loadHome: vi
      .fn()
      .mockRejectedValue(new Error('Sanity homePage is missing')),
    loadAbout: vi.fn().mockResolvedValue({}),
    loadServices: vi.fn().mockResolvedValue({}),
    loadGallery: vi.fn().mockResolvedValue({}),
  };
  await expect(loadLauraSnapshot(source)).rejects.toThrow(
    'Sanity homePage is missing',
  );
});
