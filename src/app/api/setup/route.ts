import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { Role } from "@prisma/client";

// One-time setup endpoint — safe to call multiple times (idempotent)
export async function POST() {
  try {
    // Check if any admin already exists
    const existing = await prisma.user.findFirst({ where: { role: Role.ADMIN } });

    const email = process.env.ADMIN_EMAIL ?? "admin@teaplanet.com";
    const plainPassword = process.env.ADMIN_PASS;
    const preHashed = process.env.ADMIN_PASSWORD_HASH;
    const name = process.env.ADMIN_NAME ?? "Tea Planet Admin";

    if (!plainPassword && !preHashed) {
      return NextResponse.json(
        { error: "ADMIN_PASS or ADMIN_PASSWORD_HASH env var is not set in Vercel." },
        { status: 400 }
      );
    }

    const passwordHash = plainPassword ? await hash(plainPassword, 12) : preHashed!;

    // Upsert admin user
    const admin = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash, name, role: Role.ADMIN },
    });

    // Seed default prompt rules if none exist
    const ruleCount = await prisma.promptRule.count();
    let rulesCreated = 0;

    if (ruleCount === 0) {
      const rules = [
        { id: "sku-priority", title: "SKU Priority", priority: 100, isActive: true, ruleText: "Always include SKU codes from The Tea Planet catalog. If a SKU is available, it must appear in the Ingredient Matrix. Never invent SKU numbers — use 'Catalog import required' if unknown." },
        { id: "recipe-format", title: "Recipe Format Enforcement", priority: 90, isActive: true, ruleText: "Every recipe response MUST follow the 4-section format: (1) Recipe Header, (2) Ingredient Matrix as a table, (3) Numbered Preparation Steps, (4) Selling/Demo Notes with 5 sub-fields." },
        { id: "serving-size", title: "Serving Size Rules", priority: 80, isActive: true, ruleText: "Hot beverages: 100 ml standard serving. Cold/Iced/Frappe drinks: 350 ml standard serving. Silky Mix: Hot = 10–15 g per 100 ml; Cold/Iced/Frappe = 30 g per 350 ml." },
        { id: "cake-rules", title: "Cake Recipe Restrictions", priority: 70, isActive: true, ruleText: "Cake recipes must ONLY use: Sponge Boba Flavours, Boba Frost – Swirls Whip Flavor Topping, Glossy Boba Cheesecake flavours, and suitable toppings (tapioca pearls, nata de coco, popping boba, konjac jelly). Never use beverage boba premixes for cakes." },
        { id: "no-formulation", title: "No Formulation Disclosure", priority: 60, isActive: true, ruleText: "Never reveal product formulations, manufacturing processes, or proprietary blending ratios. Share only generic ingredient categories if explicitly needed." },
        { id: "boba-priority", title: "Boba Innovations Priority", priority: 50, isActive: true, ruleText: "Boba Innovations products get FIRST sales priority. Always check Boba Innovations subcategory first before suggesting other Tea Planet products." },
        { id: "mapping-rules", title: "Competitor / Generic Mapping", priority: 40, isActive: true, ruleText: "When mapping competitor or generic products, align by: Application type (CTC/Orthodox/Instant/Concentrate) and Business model (FOFO/FOCO/Export/Fine Dine/Distributor Demo). Give best-fit mapping without unnecessary clarification." },
        { id: "whatsapp-fallback", title: "WhatsApp Fallback", priority: 30, isActive: true, ruleText: "When no suitable Tea Planet product exists, generate a WhatsApp-ready customer specification message including: product use case, application type, volume requirement, and preferred delivery format." },
      ];

      await prisma.promptRule.createMany({ data: rules, skipDuplicates: true });
      rulesCreated = rules.length;
    }

    // Seed sample products if none exist
    const productCount = await prisma.product.count();
    let productsCreated = 0;

    if (productCount === 0) {
      await prisma.product.createMany({
        data: [
          { sku: "IMPORT-REQUIRED-001", name: "⚠ Catalog Import Required", category: "Placeholder", notes: "Import your Tea Planet product catalog CSV/XLSX via Admin → Products → Import Catalog." },
          { sku: "BI-SILKYMIX-001", name: "Silky Mix – Boba Base (Sample)", category: "Boba Innovations", subcategory: "Premix Bases", applicationType: "FOFO,FOCO,Training", unit: "kg", packSize: "1 kg", notes: "Sample placeholder. Import real catalog for actual SKU, price, and details." },
        ],
        skipDuplicates: true,
      });
      productsCreated = 2;
    }

    return NextResponse.json({
      ok: true,
      admin: { email: admin.email, isNew: !existing },
      rulesCreated,
      productsCreated,
      message: existing
        ? `Admin already exists (${admin.email}). Setup is complete.`
        : `Admin created (${admin.email}). Database ready.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const adminCount = await prisma.user.count({ where: { role: Role.ADMIN } });
    const productCount = await prisma.product.count();
    const ruleCount = await prisma.promptRule.count();

    return NextResponse.json({
      ready: adminCount > 0,
      adminCount,
      productCount,
      ruleCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message, ready: false }, { status: 500 });
  }
}
