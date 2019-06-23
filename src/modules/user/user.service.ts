import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto, UpdatePasswordDto } from './user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async store(data: UserDto) {
        const { name } = data;
        const user = await this.userRepository.findOne({ name });

        if (user) {
            throw new BadRequestException('User alreadt exist.')
        }

        const entity = await this.userRepository.create(data);
        await this.userRepository.save(entity);
        return entity;
    }

    async show(id: string) {
        const entity = await this.userRepository.findOne(id);

        if(!entity) {
            throw new NotFoundException('No such user.');
        }

        return entity;
    }

    async updatePassword(id: string, data: UpdatePasswordDto) {
        const {password, newPassword} = data;
        const entity = await this.userRepository.findOne(id);

        if(!entity) {
            throw new NotFoundException('No such user.');
        }

        const pass = await entity.comparePassword(password);

        if(!pass) {
            throw new BadRequestException('Password is incorrect. Please retry.')
        }

        entity.password = newPassword;
        return await this.userRepository.save(entity);
    }
}
