import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseRecipeFromText } from "@/lib/recipes/parser";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recipes = await prisma.recipe.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });

  return NextResponse.json(recipes);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // If raw AI text is provided, parse it into structured format
  if (body.rawContent) {
    const parsed = parseRecipeFromText(body.rawContent as string);
    const recipe = await prisma.recipe.create({
      data: {
        title: parsed.title,
        style: parsed.style,
        application: parsed.application,
        portion: parsed.portion,
        contentJson: parsed.contentJson as object,
        createdById: session.user.id,
      },
    });
    return NextResponse.json(recipe, { status: 201 });
  }

  // Structured recipe creation
  const { title, style, application, portion, contentJson } = body as {
    title: string;
    style?: string;
    application?: string;
    portion?: string;
    contentJson: Record<string, unknown>;
  };

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const recipe = await prisma.recipe.create({
    data: {
      title,
      style,
      application,
      portion,
      contentJson: (contentJson ?? {}) as object,
      createdById: session.user.id,
    },
  });

  return NextResponse.json(recipe, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  await prisma.recipe.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
