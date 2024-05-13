import { Like, SelectQueryBuilder } from 'typeorm';
interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export class Paginator {
  static async paginate(queryBuilder: SelectQueryBuilder<any>, req: any): Promise<{ records: any[]; paginationInfo: PaginationInfo }> {
    let page = Number(req.pageNumber) || 1;
    let pageSize = Number(req.pageSize) || 10;
    const offset = (page - 1) * pageSize;
    const records = await queryBuilder.skip(offset).take(pageSize).getMany();
    const totalItems = await queryBuilder.getCount();
    const pages = Math.ceil(totalItems / pageSize);
    const currentPage = page;
    const hasNext = currentPage < pages;
    const hasPrevious = currentPage > 1;

    const paginationInfo: PaginationInfo = {
      currentPage: page,
      pageSize: pageSize,
      totalItems,
      pages,
      hasNext,
      hasPrevious,
    };
    return { records, paginationInfo };
  }
}
