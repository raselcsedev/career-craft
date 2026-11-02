import { Test, TestingModule } from '@nestjs/testing';
import { CvTemplatesController } from './cv-templates.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('CvTemplatesController', () => {
  let controller: CvTemplatesController;
  let prismaService: any;

  beforeEach(async () => {
    prismaService = {
      cvTemplate: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'tpl-1', slug: 'classic-professional', name: 'Classic Professional', isActive: true },
          { id: 'tpl-2', slug: 'modern-corporate', name: 'Modern Corporate', isActive: true },
        ]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvTemplatesController],
      providers: [
        { provide: PrismaService, useValue: prismaService },
      ],
    }).compile();

    controller = module.get<CvTemplatesController>(CvTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all active templates', async () => {
    const result = await controller.findAll();
    expect(result).toHaveProperty('templates');
    expect(result.templates.length).toBe(2);
    expect(prismaService.cvTemplate.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  });
});
