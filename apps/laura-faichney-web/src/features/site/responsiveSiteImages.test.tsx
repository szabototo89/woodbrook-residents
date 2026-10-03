import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, test, vi } from 'vitest';
import { HomePage } from './HomePage';
import { AboutPage } from './AboutPage';
import { ServicesPage } from './ServicesPage';
import { GalleryPage } from './GalleryPage';
import { loadLauraSnapshot } from '../../../scripts/lauraSnapshot';
import { fixtureResponse } from '../../../tests/fixtures/site-fixtures';

afterEach(() => vi.unstubAllGlobals());

test('site heroes, services, mural and biography offer the bundled responsive variants', async () => {
  vi.stubGlobal('fetch', fixtureResponse);
  const snapshot = await loadLauraSnapshot();
  const responsive = {
    url: '/site-images/large.webp',
    srcSet: '/site-images/small.webp 320w, /site-images/large.webp 1448w',
    alt: 'Responsive artwork',
    avifSrcSet: '/site-images/small.avif 320w, /site-images/large.avif 1448w',
  };
  snapshot.home.hero.image = responsive;
  snapshot.home.mural.image = responsive;
  snapshot.home.about.image = responsive;
  snapshot.home.services = snapshot.home.services.map((service) => ({
    ...service,
    image: responsive,
  }));
  snapshot.about.hero.image = responsive;
  snapshot.about.storyImage = responsive;
  snapshot.services.hero.image = responsive;
  snapshot.services.services = snapshot.services.services.map((service) => ({
    ...service,
    image: responsive,
  }));
  snapshot.gallery.hero.image = responsive;
  for (const component of [
    <HomePage data={snapshot.home} />,
    <AboutPage data={snapshot.about} />,
    <ServicesPage data={snapshot.services} />,
    <GalleryPage data={snapshot.gallery} />,
  ]) {
    const html = renderToStaticMarkup(component);
    const images = html.match(/<img[^>]+alt="Responsive artwork"[^>]*>/g) ?? [];
    expect(images.length).toBeGreaterThan(0);
    expect(html).toContain('type="image/avif"');
    expect(html).toContain(
      'srcSet="/site-images/small.avif 320w, /site-images/large.avif 1448w"',
    );
    for (const image of images) {
      expect(image).toContain(
        'srcSet="/site-images/small.webp 320w, /site-images/large.webp 1448w"',
      );
      expect(image).toContain('sizes="');
    }
  }
});
