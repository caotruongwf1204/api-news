import { AppDataSource } from "@/database/data-source";
// import * as sgMail from '.';
import * as crypto from 'crypto';
import { Email } from "@/database/entities/Email";

export class EmailService {
    static async sendVerificationEmail(email: string, verificationCode: string): Promise<void> {
        try {
            // Kiểm tra xem biến env SENDGRID_API_KEY có tồn tại hay không
            const apiKey = process.env.SENDGRID_API_KEY ?? '';
            // Sử dụng giá trị mặc định là chuỗi rỗng nếu biến không tồn tại

            // Thiết lập API key của SendGrid
            // sgMail.setApiKey(apiKey);
 
            // Tạo nội dung email
            const msg = {
                to: email,
                from: 'your@example.com', // Email người gửi
                subject: 'Xác thực tài khoản',
                text: `Mã xác thực của bạn là: ${verificationCode}`,
            };
            // Gửi email
            // await sgMail.send(msg);
        } catch (error) {
            console.error('Lỗi khi gửi email:', error);
            throw new Error('Lỗi khi gửi email');
        }
    }

    static async saveVerificationCodeToDB(userId: number, verificationCode: string): Promise<void> {
        try {
            const verificationCodeRepository = AppDataSource.getRepository(Email);

            let codeRecord = await verificationCodeRepository.findOne({ where: { userId } });

            // Kiểm tra nếu không tìm thấy mã xác thực cho người dùng
            if (!codeRecord) {
                // Tạo mới một đối tượng VerificationCode
                codeRecord = new Email(verificationCode, userId);
            }
            // Cập nhật mã xác thực mới
            codeRecord.code = verificationCode;

            // Lưu vào cơ sở dữ liệu
            await verificationCodeRepository.save(codeRecord);
        } catch (error) {
            console.error('Lỗi khi lưu mã xác thực vào cơ sở dữ liệu:', error);
            throw new Error('Lỗi khi lưu mã xác thực vào cơ sở dữ liệu');
        }
    }

    static generateVerificationCode(): any {
        // Độ dài của mã xác thực (ví dụ: 6 ký tự)
        const codeLength = 6;

        // Tạo buffer để chứa mã xác thực ngẫu nhiên
        const buffer = crypto.randomBytes(codeLength);

        // Chuyển buffer thành chuỗi hex
        const verificationCode = buffer.toString('hex').slice(0, codeLength);

        return verificationCode;
    }

}
