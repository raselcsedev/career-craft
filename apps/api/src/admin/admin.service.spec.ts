import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AdminService', () => {
  let service: AdminService;
  let prisma: {
    user: { count: jest.Mock };
    cv: { count: jest.Mock };
    portfolio: { count: jest.Mock };
    cvTemplate: { count: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    portfolioTemplate: { count: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      user: { count: jest.fn().mockResolvedValue(10) },
      cv: { count: jest.fn().mockResolvedValue(25) },
      portfolio: { count: jest.fn().mockResolvedValue(8) },
      cvTemplate: {
        count: jest.fn().mockResolvedValue(6),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      portfolioTemplate: {
        count: jest.fn().mockResolvedValue(6),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return aggregated system stats', async () => {
    const stats = await service.getSystemStats();
    expect(stats).toEqual({
      users: 10,
      cvs: 25,
      portfolios: 8,
      cvTemplates: 6,
      portfolioTemplates: 6,
    });
  });

  it('should throw NotFoundException if updating non-existent CV template', async () => {
    prisma.cvTemplate.findUnique.mockResolvedValue(null);
    await expect(service.updateCvTemplateStatus('missing-id', false)).rejects.toThrow(NotFoundException);
  });

  it('should update CV template active status', async () => {
    prisma.cvTemplate.findUnique.mockResolvedValue({ id: 'tmpl-1', isActive: true });
    prisma.cvTemplate.update.mockResolvedValue({ id: 'tmpl-1', isActive: false });

    const res = await service.updateCvTemplateStatus('tmpl-1', false);
    expect(res.isActive).toBe(false);
    expect(prisma.cvTemplate.update).toHaveBeenCalledWith({
      where: { id: 'tmpl-1' },
      data: { isActive: false },
    });
  });
});
