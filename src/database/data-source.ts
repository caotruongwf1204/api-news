import { BlogPost } from "./entities/BlogPost"
import * as dotenv from "dotenv"
import { DataSource } from "typeorm"
import { User } from "./entities/User"
import { Category } from "./entities/Category"
import { Comment } from "./entities/Comment"
import { Permission } from "./entities/Permission"
import { Role } from "./entities/Role"
import { Tag } from "./entities/Tag"
import { Page } from "./entities/Page"
import { Section } from "./entities/Section"
import { Content } from "./entities/Content"
import { SocialAccount } from "./entities/SocialAccount"
import { File } from "./entities/File"
import { Menu } from "./entities/Menu"
import { Email } from "./entities/Email"; // Import Email entity từ tệp tương ứng
import { Folder } from "./entities/Folder"
import { Notification } from "./entities/Notification"


dotenv.config()

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "12345678",
  database: process.env.DB_DATABASE || "test",
  logging: ["query"],
  synchronize: true,
  entities: [
    Category,
    Comment,
    Permission,
    User,
    Role,
    Tag,
    Page,
    BlogPost,
    Section,
    Content,
    SocialAccount,
    File,
    Menu,
    Email,
    Folder,
    Notification
  ],
  subscribers: [],
  migrations: ["src/database/migrations/*.ts"],
  cache: true
});