import { Test, TestingModule } from '@nestjs/testing';
import { PortfoliosService } from './portfolios.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

describe('PortfoliosService', () => {
  let service: PortfoliosService;
  let prisma: {
    portfolioTemplate: { findFirst: jest.Mock };
    portfolio: { findMany: jest.Mock; findFirst: jest.Mock; findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock };
    portfolioProject: { count: jest.Mock; create: jest.Mock; findFirst: jest.Mock; update: jest.Mock; delete: jest.Mock };
  };
  let usersService: { getProfile: jest.Mock };

  beforeEach(async () => {
    prisma = {
      portfolioTemplate: { findFirst: jest.fn() },
      portfolio: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      portfolioProject: {
        count: jest.fn(),
        create: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    usersService = {
      getProfile: jest.fn().mockResolvedValue({ bio: 'Alex bio', headline: 'Engineer' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfoliosService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<PortfoliosService>(PortfoliosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should reject reserved slugs', async () => {
      await expect(
        service.create('user-1', {
          title: 'My Site',
          slug: 'admin',
          templateId: 'minimal-developer',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject duplicate slugs', async () => {
      prisma.portfolio.findUnique.mockResolvedValue({ id: 'p1', slug: 'john-doe' });

      await expect(
        service.create('user-1', {
          title: 'My Site',
          slug: 'john-doe',
          templateId: 'minimal-developer',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should create portfolio successfully when valid', async () => {
      prisma.portfolio.findUnique.mockResolvedValue(null);
      prisma.portfolioTemplate.findFirst.mockResolvedValue({ id: 't1', slug: 'minimal-developer' });
      prisma.portfolio.create.mockResolvedValue({
        id: 'port-1',
        title: 'Alex Dev',
        slug: 'alex-dev',
        isPublished: false,
      });

      const res = await service.create('user-1', {
        title: 'Alex Dev',
        slug: 'alex-dev',
        templateId: 'minimal-developer',
      });

      expect(res.id).toBe('port-1');
      expect(prisma.portfolio.create).toHaveBeenCalled();
    });
  });

  describe('findBySlugPublic', () => {
    it('should throw NotFoundException if portfolio does not exist or is unpublished', async () => {
      prisma.portfolio.findUnique.mockResolvedValue({
        id: 'p1',
        slug: 'private-site',
        isPublished: false,
      });

      await expect(service.findBySlugPublic('private-site')).rejects.toThrow(NotFoundException);
    });

    it('should return safe portfolio data when published', async () => {
      prisma.portfolio.findUnique.mockResolvedValue({
        id: 'p1',
        title: 'Public Site',
        slug: 'public-site',
        isPublished: true,
        user: {
          profile: { firstName: 'Alex', lastName: 'Morgan' },
        },
        template: { slug: 'minimal-developer' },
        projects: [],
      });

      const res = await service.findBySlugPublic('public-site');
      expect(res.title).toBe('Public Site');
      expect(res.owner).toHaveProperty('firstName', 'Alex');
    });
  });

  describe('publish and unpublish', () => {
    it('should set isPublished = true on publish', async () => {
      prisma.portfolio.findFirst.mockResolvedValue({ id: 'p1', userId: 'user-1' });
      prisma.portfolio.update.mockResolvedValue({ id: 'p1', isPublished: true });

      const res = await service.publish('user-1', 'p1');
      expect(res.isPublished).toBe(true);
      expect(prisma.portfolio.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'p1' },
          data: expect.objectContaining({ isPublished: true }),
        }),
      );
    });

    it('should set isPublished = false on unpublish', async () => {
      prisma.portfolio.findFirst.mockResolvedValue({ id: 'p1', userId: 'user-1' });
      prisma.portfolio.update.mockResolvedValue({ id: 'p1', isPublished: false });

      const res = await service.unpublish('user-1', 'p1');
      expect(res.isPublished).toBe(false);
      expect(prisma.portfolio.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'p1' },
          data: expect.objectContaining({ isPublished: false }),
        }),
      );
    });
  });
});
