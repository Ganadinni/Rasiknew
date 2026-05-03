export type AIMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type AIResponse = {
  content: string;
  error?: string;
};

async function callOpenAI(messages: AIMessage[]): Promise<AIResponse> {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.AI_MODEL || "gpt-4o";

  const res = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 2500,
  });

  return { content: res.choices[0]?.message?.content ?? "" };
}

async function callAnthropic(messages: AIMessage[]): Promise<AIResponse> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = process.env.AI_MODEL || "claude-sonnet-4-6";

  const systemMsg = messages.find((m) => m.role === "system")?.content ?? "";
  const convo = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  const res = await client.messages.create({
    model,
    max_tokens: 2500,
    system: systemMsg,
    messages: convo,
  });

  const block = res.content[0];
  return { content: block.type === "text" ? block.text : "" };
}

function mockResponse(userMessage: string): AIResponse {
  return {
    content: `**Rasik is ready — AI provider not yet configured.**

To activate Rasik's AI capabilities:
1. Add \`AI_PROVIDER=openai\` or \`AI_PROVIDER=anthropic\` to your Vercel environment variables
2. Add \`OPENAI_API_KEY\` or \`ANTHROPIC_API_KEY\` accordingly
3. Optionally set \`AI_MODEL\` (defaults: \`gpt-4o\` / \`claude-sonnet-4-6\`)

---
**Your message:** "${userMessage}"

Once configured, Rasik will generate full Tea Planet recipes, SKU mappings, demo menus, SOPs, and more.`,
  };
}

export async function callAI(messages: AIMessage[]): Promise<AIResponse> {
  const provider = (process.env.AI_PROVIDER ?? "").toLowerCase();

  try {
    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      return await callOpenAI(messages);
    }
    if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
      return await callAnthropic(messages);
    }
    const userMsg = messages.findLast((m) => m.role === "user")?.content ?? "";
    return mockResponse(userMsg);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { content: `Sorry, I encountered an error: ${msg}`, error: msg };
  }
}
