import { SlugService } from '../services/slug.service';

describe('SlugService', () => {
  let service: SlugService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        findUnique: jest.fn(),
      },
    };
    service = new SlugService(mockPrisma);
  });

  it('slugify handles diacritics correctly', () => {
    expect(service.slugify('Caffè in Tunisia')).toBe('caffe-in-tunisia');
  });

  it('slugify provides fallback for non-ASCII or empty strings', () => {
    const slug = service.slugify('???');
    expect(slug).toMatch(/^article-\d+/);
  });

  it('uniqueSlug excludes current publication ID when checking uniqueness', async () => {
    mockPrisma.publication.findUnique.mockImplementation(({ where }: any) => {
      if (where.slug === 'my-title') {
        return Promise.resolve({ id: 'existing-id', slug: 'my-title' });
      }
      return Promise.resolve(null);
    });

    const slug = await service.uniqueSlug('My Title', 'existing-id');
    expect(slug).toBe('my-title');
  });
});
