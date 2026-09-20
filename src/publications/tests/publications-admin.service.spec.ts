import { Role } from '@prisma/client';
import { PublicationsAdminService } from '../services/publications-admin.service';

describe('PublicationsAdminService', () => {
  let service: PublicationsAdminService;
  let mockPrisma: any;
  let mockSlugService: any;
  let mockSanitizer: any;

  beforeEach(() => {
    mockPrisma = {
      publication: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
      pendingUpload: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
    };
    mockSlugService = {
      uniqueSlug: jest
        .fn()
        .mockImplementation(async (title: string) => `slug-${title}`),
    };
    mockSanitizer = {
      sanitize: jest.fn().mockImplementation((val: string) => val.trim()),
    };

    service = new PublicationsAdminService(
      mockPrisma,
      mockSlugService,
      mockSanitizer,
    );
  });

  describe('update', () => {
    it('recalculates and sets slug using uniqueSlug(title, id) when title is updated', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue({
        id: 'pub-1',
        authorId: 'user-1',
      });
      mockPrisma.publication.update.mockResolvedValue({ id: 'pub-1' });
      mockSlugService.uniqueSlug.mockResolvedValue('nuovo-titolo-articolo');

      await service.update(
        'pub-1',
        { title: 'Nuovo Titolo Articolo' },
        'user-1',
        Role.EDITOR,
      );

      expect(mockSlugService.uniqueSlug).toHaveBeenCalledWith(
        'Nuovo Titolo Articolo',
        'pub-1',
      );
      expect(mockPrisma.publication.update).toHaveBeenCalledWith({
        where: { id: 'pub-1' },
        data: expect.objectContaining({
          title: 'Nuovo Titolo Articolo',
          slug: 'nuovo-titolo-articolo',
        }),
      });
    });

    it('does not recalculate slug when title is not provided in update', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue({
        id: 'pub-1',
        authorId: 'user-1',
      });
      mockPrisma.publication.update.mockResolvedValue({ id: 'pub-1' });

      await service.update(
        'pub-1',
        { body: 'Aggiornato corpo articolo' },
        'user-1',
        Role.EDITOR,
      );

      expect(mockSlugService.uniqueSlug).not.toHaveBeenCalled();
      expect(mockPrisma.publication.update).toHaveBeenCalledWith({
        where: { id: 'pub-1' },
        data: expect.not.objectContaining({
          slug: expect.anything(),
        }),
      });
    });

    it('does not recalculate slug when title is empty or whitespace', async () => {
      mockPrisma.publication.findUnique.mockResolvedValue({
        id: 'pub-1',
        authorId: 'user-1',
      });
      mockPrisma.publication.update.mockResolvedValue({ id: 'pub-1' });

      await service.update('pub-1', { title: '   ' }, 'user-1', Role.EDITOR);

      expect(mockSlugService.uniqueSlug).not.toHaveBeenCalled();
    });
  });
});
