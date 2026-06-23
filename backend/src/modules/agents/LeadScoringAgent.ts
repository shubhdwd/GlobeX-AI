// ─────────────────────────────────────────────────────────────────────────────
// LeadScoringAgent
//
// Current state: Deterministic scoring based on buyer data
// Plug in: Fine-tuned classifier, OpenAI function calling, or LangGraph workflow
//
// Real implementation would:
//   1. Fetch buyer details (industry match, import volume, verified status)
//   2. Fetch user's product fit with buyer's typical imports
//   3. Run ML model or LLM scoring chain
//   4. Return weighted score with factor breakdown
// ─────────────────────────────────────────────────────────────────────────────

import { prisma } from '../../config/database';
import type { ILeadScoringAgent, LeadScoringInput, LeadScoringOutput } from './AgentService';

const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL || 'http://localhost:8000/api/v1';

class LeadScoringAgentImpl implements ILeadScoringAgent {
  async score(input: LeadScoringInput): Promise<number> {
    const result = await this.scoreWithDetails(input);
    return result.score;
  }

  async scoreWithDetails(input: LeadScoringInput): Promise<LeadScoringOutput> {
    const buyer = await prisma.buyer.findUnique({ where: { id: input.buyerId } });
    if (!buyer) return { score: 50, confidence: 0.3, factors: [], reasoning: 'Buyer not found, using default score.' };

    let product = null;
    if (input.productId) {
      product = await prisma.product.findUnique({ where: { id: input.productId } });
    }

    try {
      const response = await fetch(`${AGENT_SERVICE_URL}/agents/lead-scoring`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: {
            companyName: buyer.companyName,
            country: buyer.country,
            industry: buyer.industry,
            importVolume: buyer.importVolume || null,
            isVerified: buyer.isVerified,
            annualRevenue: buyer.annualRevenue || null,
            employeeCount: buyer.employeeCount || null,
            email: buyer.email || null,
            website: buyer.website || null,
          },
          product: product ? {
            productName: product.productName,
            category: product.category,
            description: product.description,
            hsCode: product.hsCode || null,
          } : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Agent service responded with status ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        score: data.score,
        confidence: data.confidence,
        factors: data.factors,
        reasoning: data.reasoning,
      };
    } catch (error) {
      console.warn('LeadScoringAgent failed, falling back to mock scoring:', error);
      
      const factors: LeadScoringOutput['factors'] = [];
      let score = 40; // base

      // Import volume
      if (buyer.importVolume === 'Very High') { score += 20; factors.push({ factor: 'Import Volume: Very High', impact: 'positive', weight: 20 }); }
      else if (buyer.importVolume === 'High') { score += 15; factors.push({ factor: 'Import Volume: High', impact: 'positive', weight: 15 }); }
      else if (buyer.importVolume === 'Medium') { score += 8; factors.push({ factor: 'Import Volume: Medium', impact: 'positive', weight: 8 }); }

      // Verified status
      if (buyer.isVerified) { score += 10; factors.push({ factor: 'Buyer Verified', impact: 'positive', weight: 10 }); }
      else { factors.push({ factor: 'Buyer Unverified', impact: 'negative', weight: -5 }); score -= 5; }

      // Has contact info
      if (buyer.email) { score += 10; factors.push({ factor: 'Email Available', impact: 'positive', weight: 10 }); }
      if (buyer.website) { score += 5; factors.push({ factor: 'Website Available', impact: 'positive', weight: 5 }); }

      // Existing lead score from database (AI-assigned previously)
      if (buyer.leadScore > 0) score = Math.round((score + buyer.leadScore) / 2);

      const finalScore = Math.min(100, Math.max(0, score));

      return {
        score: finalScore,
        confidence: 0.75,
        factors,
        reasoning: `Score of ${finalScore} based on import volume (${buyer.importVolume ?? 'Unknown'}), verification status, and contact availability (Deterministic Fallback).`,
      };
    }
  }
}

export const leadScoringAgent = new LeadScoringAgentImpl();
