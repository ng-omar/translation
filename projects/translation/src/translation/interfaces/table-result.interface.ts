export interface ITableResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  total: number;
}
