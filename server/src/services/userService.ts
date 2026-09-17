import { userRepository } from '../repositories/userRepository.js';
import { NotFoundError, ValidationError } from '../utils/AppError.js';
import type { UpdateProfileDTO } from '../types/index.js';

const DEMO_USER_ID = 1;

export const userService = {
  getProfile() {
    const user = userRepository.findById(DEMO_USER_ID);
    if (!user) throw new NotFoundError('User', DEMO_USER_ID);
    return user;
  },

  updateProfile(data: UpdateProfileDTO) {
    const user = userRepository.findById(DEMO_USER_ID);
    if (!user) throw new NotFoundError('User', DEMO_USER_ID);
    if (data.name !== undefined && !data.name.trim()) throw new ValidationError('Name cannot be empty');
    if (data.email !== undefined && !data.email.trim()) throw new ValidationError('Email cannot be empty');
    return userRepository.update(DEMO_USER_ID, data)!;
  },
};
