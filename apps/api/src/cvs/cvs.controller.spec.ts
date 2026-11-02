import { Test, TestingModule } from '@nestjs/testing';
import { CvsController } from './cvs.controller';
import { CvsService } from './cvs.service';

describe('CvsController', () => {
  let controller: CvsController;
  let service: any;

  const mockUser = { id: 'user-1', email: 'test@example.com' };
  const mockCv = {
    id: 'cv-1',
    userId: 'user-1',
    templateId: 'tpl-1',
    title: 'My Resume',
    content: {},
  };

  beforeEach(async () => {
    service = {
      findAll: jest.fn().mockResolvedValue([mockCv]),
      findOne: jest.fn().mockResolvedValue(mockCv),
      create: jest.fn().mockResolvedValue(mockCv),
      update: jest.fn().mockResolvedValue({ ...mockCv, title: 'Updated Resume' }),
      duplicate: jest.fn().mockResolvedValue({ ...mockCv, id: 'cv-2', title: 'My Resume (Copy)' }),
      remove: jest.fn().mockResolvedValue({ message: 'CV document deleted successfully' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CvsController],
      providers: [
        { provide: CvsService, useValue: service },
      ],
    }).compile();

    controller = module.get<CvsController>(CvsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should list all user CVs', async () => {
    const result = await controller.findAll(mockUser);
    expect(result).toEqual({ cvs: [mockCv] });
    expect(service.findAll).toHaveBeenCalledWith('user-1');
  });

  it('should get single CV by ID', async () => {
    const result = await controller.findOne(mockUser, 'cv-1');
    expect(result).toEqual({ cv: mockCv });
    expect(service.findOne).toHaveBeenCalledWith('user-1', 'cv-1');
  });

  it('should create CV', async () => {
    const dto = { title: 'New CV', templateId: 'tpl-1' };
    const result = await controller.create(mockUser, dto);
    expect(result).toEqual({ message: 'CV created successfully', cv: mockCv });
    expect(service.create).toHaveBeenCalledWith('user-1', dto);
  });

  it('should update CV', async () => {
    const dto = { title: 'Updated Resume' };
    const result = await controller.update(mockUser, 'cv-1', dto);
    expect(result.message).toBe('CV updated successfully');
    expect(service.update).toHaveBeenCalledWith('user-1', 'cv-1', dto);
  });

  it('should duplicate CV', async () => {
    const result = await controller.duplicate(mockUser, 'cv-1');
    expect(result.message).toBe('CV duplicated successfully');
    expect(result.cv.id).toBe('cv-2');
    expect(service.duplicate).toHaveBeenCalledWith('user-1', 'cv-1');
  });

  it('should delete CV', async () => {
    const result = await controller.remove(mockUser, 'cv-1');
    expect(result).toEqual({ message: 'CV document deleted successfully' });
    expect(service.remove).toHaveBeenCalledWith('user-1', 'cv-1');
  });
});
