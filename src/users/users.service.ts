import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  getAll(): User[] {
    return this.users;
  }

  getOne(id: string): User {
    const user = this.users.find((user) => user.id === +id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} is not found.`);
    }
    return user;
  }

  deleteOne(id: string): string {
    this.getOne(id); // in case of not found
    this.users = this.users.filter((user) => user.id !== +id);
    return 'deleted';
  }

  create(userData) {
    this.users.push({
      id: this.users.length + 1,
      ...userData,
    });
  }
}
