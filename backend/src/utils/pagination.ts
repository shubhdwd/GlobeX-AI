import { Request } from 'express';

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export const getPaginationOptions = (req: Request): PaginationOptions => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export const getSortOptions = (
  req: Request,
  allowedFields: string[],
  defaultField = 'createdAt',
): SortOptions => {
  const sortBy = (req.query.sortBy as string) || defaultField;
  const sortDir = (req.query.sortDir as string)?.toLowerCase() === 'asc' ? 'asc' : 'desc';
  const field = allowedFields.includes(sortBy) ? sortBy : defaultField;
  return { field, direction: sortDir };
};
