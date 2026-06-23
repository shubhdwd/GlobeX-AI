import { prisma } from '../../config/database';
import { outreachAgent } from '../agents/OutreachAgent';
import { AppError } from '../../middleware/error.middleware';
import type { GenerateOutreachDto } from './outreach.schema';

export const outreachService = {
  async generate(userId: string, dto: GenerateOutreachDto) {
    // Fetch buyer and user context
    const [buyer, user] = await Promise.all([
      prisma.buyer.findUnique({ where: { id: dto.buyerId } }),
      prisma.user.findUnique({ where: { id: userId }, select: { name: true, companyName: true, industry: true } }),
    ]);

    if (!buyer) throw new AppError('Buyer not found', 404);
    if (!user) throw new AppError('User not found', 404);

    // ── AI Agent Hook: generate personalised outreach ────────────
    const generated = await outreachAgent.generate({
      buyer: {
        companyName: buyer.companyName,
        country: buyer.country,
        industry: buyer.industry,
        email: buyer.email ?? undefined,
      },
      sender: user,
      tone: dto.tone,
      language: dto.language,
      customContext: dto.customContext,
    });

    // Persist the generated outreach
    const outreach = await prisma.outreach.create({
      data: {
        buyer: { connect: { id: dto.buyerId } },
        user: { connect: { id: userId } },
        subject: generated.subject,
        content: generated.content,
        tone: dto.tone,
        language: dto.language,
        aiModel: generated.model,
        promptUsed: generated.prompt,
      },
    });

    return outreach;
  },

  async getHistory(userId: string) {
    return prisma.outreach.findMany({
      where: { userId },
      include: { buyer: { select: { companyName: true, country: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },
};
