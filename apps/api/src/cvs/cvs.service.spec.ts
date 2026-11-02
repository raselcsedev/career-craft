import { Test, TestingModule } from '@nestjs/testing';
import { CvsService } from './cvs.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CvsService', () => {
  let service: CvsService;
  let prisma: {
    cvTemplate: { findFirst: jest.Mock };
    cv: { findMany: jest.Mock; findFirst: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock };
  };
  let usersService: { getProfile: jest.Mock; findById: jest.Mock };

  beforeEach(async () => {
    prisma = {
      cvTemplate: { findFirst: jest.fn() },
      cv: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    usersService = {
      getProfile: jest.fn().mockResolvedValue({ firstName: 'Alex', lastName: 'Morgan' }),
      findById: jest.fn().mockResolvedValue({ email: 'alex@example.com' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CvsService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    service = module.get<CvsService>(CvsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all CVs for the authenticated user', async () => {
      const mockCvs = [{ id: 'cv-1', title: 'Resume 1', userId: 'user-1' }];
      prisma.cv.findMany.mockResolvedValue(mockCvs);

      const result = await service.findAll('user-1');
      expect(result).toEqual(mockCvs);
      expect(prisma.cv.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: expect.any(Object),
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if CV does not belong to the user', async () => {
      prisma.cv.findFirst.mockResolvedValue(null);

      await expect(service.findOne('user-1', 'cv-99')).rejects.toThrow(NotFoundException);
    });

    it('should return CV if user is the owner', async () => {
      const mockCv = { id: 'cv-1', userId: 'user-1', title: 'Tech Resume' };
      prisma.cv.findFirst.mockResolvedValue(mockCv);

      const result = await service.findOne('user-1', 'cv-1');
      expect(result).toEqual(mockCv);
    });
  });

  describe('create', () => {
    it('should throw BadRequestException if template does not exist', async () => {
      prisma.cvTemplate.findFirst.mockResolvedValue(null);

      await expect(
        service.create('user-1', { title: 'Test CV', templateId: 'invalid-template' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create CV with pre-populated profile data', async () => {
      prisma.cvTemplate.findFirst.mockResolvedValue({ id: 'tmpl-1', slug: 'classic-professional' });
      prisma.cv.create.mockResolvedValue({ id: 'cv-new', title: 'Software Engineer', templateId: 'tmpl-1' });

      const result = await service.create('user-1', {
        title: 'Software Engineer',
        templateId: 'classic-professional',
      });

      expect(result.id).toBe('cv-new');
      expect(prisma.cv.create).toHaveBeenCalled();
    });
  });

  describe('duplicate', () => {
    it('should duplicate an existing CV with (Copy) appended to title', async () => {
      const original = { id: 'cv-1', userId: 'user-1', templateId: 't1', title: 'My Resume', content: {}, styling: {} };
      prisma.cv.findFirst.mockResolvedValue(original);
      prisma.cv.create.mockResolvedValue({ id: 'cv-copy', title: 'My Resume (Copy)' });

      const result = await service.duplicate('user-1', 'cv-1');
      expect(result.title).toBe('My Resume (Copy)');
      expect(prisma.cv.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'My Resume (Copy)',
          }),
        }),
      );
    });
  });

  describe('remove', () => {
    it('should delete CV when owned by user', async () => {
      prisma.cv.findFirst.mockResolvedValue({ id: 'cv-1', userId: 'user-1' });
      prisma.cv.delete.mockResolvedValue({ id: 'cv-1' });

      const result = await service.remove('user-1', 'cv-1');
      expect(result.message).toContain('deleted');
      expect(prisma.cv.delete).toHaveBeenCalledWith({ where: { id: 'cv-1' } });
    });
  });
});
