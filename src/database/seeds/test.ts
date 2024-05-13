// src/database/seeds/users.ts

import { faker } from '@faker-js/faker';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

export async function createRandomUser() {
    let userData ={
        email:faker.internet?.email(),
        userName: faker.internet?.userName(),
        password:'123456'
    };
    // console.log(userData.User)
    const userRepository = AppDataSource.getRepository(User)
    
    // // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10)
    const encode_password = await bcrypt.hash(userData.password, salt);
    const dto = {
        email:userData.email,
        username: userData.userName,
        password:encode_password
    }

    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await userRepository.findOne({ where: { email: dto.email } })
    if (existingUser) {
        console.info("User existed");
    }
    const repo = AppDataSource.getRepository(User)
    const user = repo.create(dto)
    await repo.save(user);
}

export const createMultipleUser = async () => faker.helpers.multiple(createRandomUser, {
    count: 1,
  });