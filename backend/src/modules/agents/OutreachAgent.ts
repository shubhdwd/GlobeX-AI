// ─────────────────────────────────────────────────────────────────────────────
// OutreachAgent
//
// Primary: Calls the Python GlobeX AI microservice (port 8000)
//   POST /api/v1/agents/outreach
//   → Gemini-powered personalised B2B email generation
//
// Fallback: Template-based generation (used when Python service is unavailable)
// ─────────────────────────────────────────────────────────────────────────────

import type { IOutreachAgent, OutreachInput, OutreachOutput } from './AgentService';

const AGENT_SERVICE_URL = process.env.AGENT_SERVICE_URL || 'http://localhost:8000/api/v1';

class OutreachAgentImpl implements IOutreachAgent {
  async generate(input: OutreachInput): Promise<OutreachOutput> {
    try {
      const response = await fetch(`${AGENT_SERVICE_URL}/agents/outreach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer: {
            companyName: input.buyer.companyName,
            country: input.buyer.country,
            industry: input.buyer.industry,
            importVolume: (input.buyer as any).importVolume ?? null,
          },
          sender: {
            name: input.sender.name,
            companyName: input.sender.companyName,
            industry: input.sender.industry,
          },
          tone: input.tone,
          language: input.language,
          custom_context: input.customContext ?? null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Agent service responded with status ${response.status}`);
      }

      const data = (await response.json()) as any;
      return {
        subject: data.subject,
        content: data.content,
        model: data.model ?? 'gemini-ai',
        prompt: data.prompt,
      };
    } catch (error) {
      console.warn('OutreachAgent: Python service unavailable, falling back to template:', error);
      return this.generateTemplate(input);
    }
  }

  // ── Fallback: deterministic template ──────────────────────────────────────

  private generateTemplate(input: OutreachInput): OutreachOutput {
    const greeting =
      input.tone === 'formal' ? 'Dear Sir/Madam' : `Dear ${input.buyer.companyName} Procurement Team`;
    const sign = input.tone === 'friendly' ? 'Warm regards' : 'Best regards';

    const content = `${greeting},

I hope this message finds you well. My name is ${input.sender.name}, and I represent ${input.sender.companyName}, a leading ${input.sender.industry} company based in India.

We have been closely following ${input.buyer.companyName}'s impressive growth in the ${input.buyer.industry} sector in ${input.buyer.country}. Given your company's reputation for quality sourcing, I believe there's a strong potential for a mutually beneficial partnership.

${input.sender.companyName} specialises in producing premium export-grade products that meet international quality standards including ISO, FSSAI, and relevant certifications for your market. We currently export to multiple countries and are expanding our presence in ${input.buyer.country}.

What we offer:
• Competitive pricing with consistent quality
• Flexible MOQ and customisable packaging
• Reliable supply chain with on-time delivery
• Full compliance with ${input.buyer.country} import regulations
• Dedicated export documentation support

I would love the opportunity to share our product catalogue and discuss how we can support ${input.buyer.companyName}'s sourcing needs. Would you be open to a brief call this week or next?

${sign},
${input.sender.name}
${input.sender.companyName}, India
[Phone] | [Email]`;

    const prompt = `You are an expert international trade consultant.
Write a ${input.tone} B2B outreach email in ${input.language === 'en' ? 'English' : input.language} from:
- Sender: ${input.sender.name} at ${input.sender.companyName} (${input.sender.industry} industry, India)
- To: Procurement team at ${input.buyer.companyName} (${input.buyer.industry} in ${input.buyer.country})
${input.customContext ? `Additional context: ${input.customContext}` : ''}`;

    return {
      subject: `Export Partnership Inquiry — ${input.sender.companyName} × ${input.buyer.companyName}`,
      content,
      model: 'template-v1 (fallback)',
      prompt,
    };
  }
}

export const outreachAgent = new OutreachAgentImpl();
