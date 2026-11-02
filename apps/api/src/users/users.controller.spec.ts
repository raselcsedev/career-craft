import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: { getProfile: jest.Mock; updateProfile: jest.Mock };

  beforeEach(async () => {
    usersService = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get profile for current user', async () => {
    const mockProfile = { id: 'p1', userId: 'u1', firstName: 'Alex' };
    usersService.getProfile.mockResolvedValue(mockProfile);

    const res = await controller.getProfile({ id: 'u1' });
    expect(res).toEqual({ profile: mockProfile });
    expect(usersService.getProfile).toHaveBeenCalledWith('u1');
  });

  it('should update profile for current user', async () => {
    const mockProfile = { id: 'p1', userId: 'u1', firstName: 'Alexander' };
    usersService.updateProfile.mockResolvedValue(mockProfile);

    const res = await controller.updateProfile({ id: 'u1' }, { firstName: 'Alexander' });
    expect(res).toEqual({
      message: 'Profile updated successfully',
      profile: mockProfile,
    });
    expect(usersService.updateProfile).toHaveBeenCalledWith('u1', { firstName: 'Alexander' });
  });
});
