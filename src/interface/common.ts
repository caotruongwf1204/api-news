export interface IError {
    message: string;
    code?: number;
}
export interface AuthenticatedRequest extends Request {
    params: any;
    user: { id: number };
}
export  interface AuthenticatedRequest extends Request {
    user: { id: number };
  }
