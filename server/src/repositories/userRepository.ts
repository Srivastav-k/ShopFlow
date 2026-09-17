import { users } from '../db/database.js';
import type { User, UpdateProfileDTO } from '../types/index.js';

export const userRepository = {
  findById(id: number): User | undefined {
    return users.find((u) => u.id === id);
  },

  update(id: number, data: UpdateProfileDTO): User | undefined {
    const user = users.find((u) => u.id === id);
    if (!user) return undefined;

    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.address) {
      if (data.address.street !== undefined) user.address.street = data.address.street;
      if (data.address.city !== undefined) user.address.city = data.address.city;
      if (data.address.state !== undefined) user.address.state = data.address.state;
      if (data.address.postalCode !== undefined) user.address.postalCode = data.address.postalCode;
      if (data.address.country !== undefined) user.address.country = data.address.country;
    }

    return user;
  },
};
