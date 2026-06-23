import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';

export const complianceService = {
  async getByCountry(country: string) {
    const requirements = await prisma.compliance.findMany({
      where: {
        OR: [
          { countryCode: country.toUpperCase() },
          { country: { contains: country, mode: 'insensitive' } },
        ],
      },
      orderBy: [{ isRequired: 'desc' }, { category: 'asc' }],
    });

    if (requirements.length === 0) {
      throw new AppError(`No compliance data found for: ${country}`, 404);
    }

    // Group by category
    const grouped = requirements.reduce(
      (acc, req) => {
        if (!acc[req.category]) acc[req.category] = [];
        acc[req.category].push(req);
        return acc;
      },
      {} as Record<string, typeof requirements>,
    );

    return {
      country: requirements[0].country,
      countryCode: requirements[0].countryCode,
      totalRequirements: requirements.length,
      requirements,
      grouped,
    };
  },

  async getAllCountries() {
    const countries = await prisma.compliance.findMany({
      distinct: ['countryCode'],
      select: { country: true, countryCode: true },
      orderBy: { country: 'asc' },
    });
    return countries;
  },
};
