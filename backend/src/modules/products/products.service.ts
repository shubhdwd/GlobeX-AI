import { productsRepository } from './products.repository';
import { AppError } from '../../middleware/error.middleware';
import type { CreateProductDto } from './products.schema';

export const productsService = {
  async create(userId: string, dto: CreateProductDto) {
    return productsRepository.create({ ...dto, user: { connect: { id: userId } } });
  },

  async getAll(userId: string) {
    return productsRepository.findByUser(userId);
  },

  async getById(id: string, userId: string) {
    const product = await productsRepository.findById(id, userId);
    if (!product) throw new AppError('Product not found', 404);
    return product;
  },

  async delete(id: string, userId: string) {
    const product = await productsRepository.findById(id, userId);
    if (!product) throw new AppError('Product not found', 404);
    await productsRepository.softDelete(id);
  },
};
