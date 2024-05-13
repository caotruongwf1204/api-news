import { Request, Response, NextFunction } from 'express';

// Định nghĩa một biến global để lưu trữ trạng thái làm mới token
let refreshingToken = false;

// Mảng promises để lưu trữ các request đang chờ làm mới token
const waitingRequests: Array<() => void> = [];

// Hàm middleware để kiểm tra xem có nhiều request đang yêu cầu làm mới token không
export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Nếu có request đang thực hiện làm mới token, thêm request hiện tại vào danh sách chờ đợi
  if (refreshingToken) {
    waitingRequests.push(() => next());
  } else {
    // Nếu không có request nào đang làm mới token, bắt đầu làm mới token và thực hiện request hiện tại
    refreshingToken = true;
    next();
    // Khi request hiện tại hoàn thành, kiểm tra xem còn request nào trong danh sách chờ đợi không
    // Nếu có, thực hiện request tiếp theo từ danh sách chờ đợi
    const nextRequest = waitingRequests.shift();
    if (nextRequest) {
      nextRequest();
    }
    refreshingToken = false;
  }
};
