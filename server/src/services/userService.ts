import { userRepository } from '../repositories/userRepository.js';
import { NotFoundError, ValidationError } from '../utils/AppError.js';
import type { UpdateProfileDTO } from '../types/index.js';

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const DEMO_USER_ID = 1;

export const userService = {
  async getProfile() {
    await delay(100);
    const user = userRepository.findById(DEMO_USER_ID);
    if (!user) throw new NotFoundError('User', DEMO_USER_ID);
    return user;
  },

  async updateProfile(data: UpdateProfileDTO) {
    await delay(100);
    const user = userRepository.findById(DEMO_USER_ID);
    if (!user) throw new NotFoundError('User', DEMO_USER_ID);
    if (data.name !== undefined && !data.name.trim()) throw new ValidationError('Name cannot be empty');
    if (data.email !== undefined && !data.email.trim()) throw new ValidationError('Email cannot be empty');
    return userRepository.update(DEMO_USER_ID, data)!;
  },
};
