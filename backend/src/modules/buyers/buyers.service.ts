import { buyersRepository } from './buyers.repository';
import { AppError } from '../../middleware/error.middleware';
import type { BuyerSearchDto } from './buyers.schema';

export const buyersService = {
  async search(dto: BuyerSearchDto) {
    const { page, limit, sortBy, sortDir, q, country, industry, minLeadScore } = dto;
    const skip = (page - 1) * limit;

    const { buyers, total } = await buyersRepository.search({
      q, country, industry, minLeadScore,
      skip, take: limit,
      orderBy: { [sortBy]: sortDir },
    });

    return { buyers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  },

  async getById(id: string) {
    const buyer = await buyersRepository.findById(id);
    if (!buyer) throw new AppError('Buyer not found', 404);
    return buyer;
  },
};
