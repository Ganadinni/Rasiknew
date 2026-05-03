import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { callAI } from "@/lib/ai/provider";
import { buildSystemPrompt } from "@/lib/ai/systemPrompt";
import { buildCatalogContext } from "@/lib/ai/catalogContext";
import { MessageRole } from "@prisma/client";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { message, sessionId } = body as { message: string; sessionId?: string };

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Load active prompt rules (highest priority first)
  const rules = await prisma.promptRule.findMany({
    where: { isActive: true },
    orderBy: { priority: "desc" },
    select: { ruleText: true },
  });

  // Build catalog context from user message
  const catalogContext = await buildCatalogContext(message);

  // Build system prompt
  const systemPrompt = buildSystemPrompt(
    catalogContext,
    rules.map((r) => r.ruleText)
  );

  // Get or create chat session
  let chatSession;
  if (sessionId) {
    chatSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
  }
  if (!chatSession) {
    chatSession = await prisma.chatSession.create({
      data: {
        userId: session.user.id,
        title: message.slice(0, 80),
      },
    });
  }

  // Load conversation history (last 10 messages for context)
  const history = await prisma.chatMessage.findMany({
    where: { sessionId: chatSession.id },
    orderBy: { createdAt: "asc" },
    take: 10,
    select: { role: true, content: true },
  });

  // Build messages array for AI
  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...history.map((m) => ({
      role: m.role === MessageRole.USER ? "user" as const : "assistant" as const,
      content: m.content,
    })),
    { role: "user" as const, content: message },
  ];

  // Call AI provider
  const aiResponse = await callAI(messages);

  // Save messages to DB
  await prisma.chatMessage.createMany({
    data: [
      { sessionId: chatSession.id, role: MessageRole.USER, content: message },
      { sessionId: chatSession.id, role: MessageRole.ASSISTANT, content: aiResponse.content },
    ],
  });

  // Update session title if first message
  if (history.length === 0) {
    await prisma.chatSession.update({
      where: { id: chatSession.id },
      data: { title: message.slice(0, 80) },
    });
  }

  return NextResponse.json({
    response: aiResponse.content,
    sessionId: chatSession.id,
    error: aiResponse.error,
  });
}
