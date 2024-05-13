import { MigrationInterface, QueryRunner } from "typeorm";
import { Roles } from "../../../constants/Role";
import { AppDataSource } from "../../data-source";
import { User } from "../User";
import { Role } from "../Role";

export class SeedAdminUser1674889592746 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const repo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role); // Get repository for the Role model
    const adminRole = await roleRepo.findOne({ where: { name: 'admin' } }); // Assuming 'admin' is the role name for admin

    if (!adminRole) {
      console.error("Admin role not found");
      return;
    }

    const userData = new User();
    userData.email = "admin@bookie.local";
    userData.username = "Admin user";
    userData.roles = [adminRole]; // Assign as an array

    userData.password = "password123";

    const user = repo.create(userData);
    await repo.save(user);
    console.info("Admin user seeded successfully");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOneBy({
      email: "admin@bookie.local",
    });
    if (user) {
      await repo.remove(user);
    }
  }
}