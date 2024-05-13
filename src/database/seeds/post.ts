import { Comment } from '../entities/Comment';
import { AppDataSource } from '../data-source';
import { User } from '../entities/User';
import { Tag } from '../entities/Tag';
import { File } from '../entities/File';
import { Category } from '../entities/Category';
import { BlogPost } from '../entities/BlogPost';
import { faker } from '@faker-js/faker';

export async function createPost() {
    const tagRepository = AppDataSource.getRepository(Tag);
    const categoryRepository = AppDataSource.getRepository(Category);
    const fileRepository = AppDataSource.getRepository(File);
    const userRepository = AppDataSource.getRepository(User);
    const postRepository = AppDataSource.getRepository(BlogPost);
    const commentRepository = AppDataSource.getRepository(Comment);

    const desiredCategories = ['Technology', 'Science','Learnning','IT','Blogger','Shopify','Facebook'];
    for (let i = 0; i < 100; i++){
        // Tìm user từ cơ sở dữ liệu
        const user1 = await userRepository.findOne({where: { username: 'admin' }});
        // Kiểm tra xem user có tồn tại không
        if (!user1) {
            console.log('User not found');
            return;
        }
    
        // Tạo category
        // Tìm hoặc tạo mới category
        const randomCategoryIndex = Math.floor(Math.random() * desiredCategories.length);
        const randomCategoryName = desiredCategories[randomCategoryIndex];
        let category = await categoryRepository.findOne({where: { name: randomCategoryName }});
        if(!category) {
            // Nếu category không tồn tại, tạo mới
            category = new Category();
            category.name = randomCategoryName;
            await categoryRepository.save(category);
        }
        // Tìm hoặc tạo mới tag
        let tag1 = await tagRepository.findOne({where:{ name: 'TypeORM' }});
    
        if (!tag1) {
            // Nếu tag không tồn tại, tạo mới
            tag1 = new Tag();
            tag1.name = faker.lorem.word();
            await tagRepository.save(tag1);
        }
        let tag2 = await tagRepository.findOne({where:{ name: faker.lorem.word() }});
    
        if (!tag2) {
            // Nếu tag không tồn tại, tạo mới
            tag2 = new Tag();
            tag2.name = faker.lorem.word();
            await tagRepository.save(tag2);
        }
        // Tạo đường dẫn URL hình ảnh ngẫu nhiên
        const imageUrl = faker.image.imageUrl();

        // Tạo đối tượng File cho featuredImage
        const featuredImage = new File();
        featuredImage.filename = 'featured_image.jpg'; // Tên tệp hình ảnh
        featuredImage.filepath = imageUrl; // Đường dẫn URL hình ảnh
        // Lưu featuredImage vào cơ sở dữ liệu
        await fileRepository.save(featuredImage);
        
    
        const post = new BlogPost();
        post.title = faker.lorem.sentence();
        post.content = faker.lorem.paragraphs();
        post.viewCount = String(faker.datatype.number())
        post.status = 'published';
        post.category = category;
        post.user = user1;
        post.tags = [tag1,tag2];
        post.featuredImage = featuredImage;
        await postRepository.save(post);
    }
}

