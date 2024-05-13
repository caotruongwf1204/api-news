import { AppDataSource } from '../data-source';
import { createUser } from './users';
import createDefaultPermission from './permissions';
import { createMultipleUser, createRandomUser } from './test';
import { createPost } from './post';
// ts-node src/database/seeds/seeds.ts
// Chạy hàm createRandomUser
export const runSeed = async () => {
    await createDefaultPermission();
    // Seed admin user
    await createUser('admin');
    // Seed editor user
    await createUser('editor');
    
    await createUser('user');
    await createPost();

}
AppDataSource.initialize()
  .then(async () => {
    console.log("Database connection success")
  })
  .then (()=> runSeed())
  .catch((err) => console.error(err));