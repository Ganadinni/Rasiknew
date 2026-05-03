import { PrismaClient, Role, MessageRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ─── Admin user ────────────────────────────────────────────────────────────
  const email = process.env.ADMIN_EMAIL ?? "admin@teaplanet.com";
  const plainPassword = process.env.ADMIN_PASS;
  const preHashedPassword = process.env.ADMIN_PASSWORD_HASH;
  const name = process.env.ADMIN_NAME ?? "Tea Planet Admin";

  let passwordHash: string;
  if (plainPassword) {
    passwordHash = await hash(plainPassword, 12);
  } else if (preHashedPassword) {
    passwordHash = preHashedPassword;
  } else {
    throw new Error("Set ADMIN_PASS or ADMIN_PASSWORD_HASH in .env before seeding.");
  }

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash, name, role: Role.ADMIN },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ─── Prompt rules ──────────────────────────────────────────────────────────
  const rules = [
    {
      title: "SKU Priority",
      ruleText:
        "Always include SKU codes from The Tea Planet catalog. If a SKU is available, it must appear in the Ingredient Matrix. Never invent SKU numbers — use 'Catalog import required' if unknown.",
      priority: 100,
      isActive: true,
    },
    {
      title: "Recipe Format Enforcement",
      ruleText:
        "Every recipe response MUST follow the 4-section format: (1) Recipe Header, (2) Ingredient Matrix as a table, (3) Numbered Preparation Steps, (4) Selling/Demo Notes with 5 sub-fields.",
      priority: 90,
      isActive: true,
    },
    {
      title: "Serving Size Rules",
      ruleText:
        "Hot beverages: 100 ml standard serving. Cold/Iced/Frappe drinks: 350 ml standard serving. Silky Mix: Hot = 10–15 g per 100 ml; Cold/Iced/Frappe = 30 g per 350 ml.",
      priority: 80,
      isActive: true,
    },
    {
      title: "Cake Recipe Restrictions",
      ruleText:
        "Cake recipes must ONLY use: Sponge Boba Flavours, Boba Frost – Swirls Whip Flavor Topping, Glossy Boba Cheesecake flavours, and suitable toppings (tapioca pearls, nata de coco, popping boba, konjac jelly). Never use beverage boba premixes for cakes.",
      priority: 70,
      isActive: true,
    },
    {
      title: "No Formulation Disclosure",
      ruleText:
        "Never reveal product formulations, manufacturing processes, or proprietary blending ratios. Share only generic ingredient categories if explicitly needed.",
      priority: 60,
      isActive: true,
    },
    {
      title: "Boba Innovations Priority",
      ruleText:
        "Boba Innovations products get first sales priority in all recipe suggestions. Always check Boba Innovations subcategory first before suggesting other Tea Planet products.",
      priority: 50,
      isActive: true,
    },
    {
      title: "Competitor / Generic Mapping",
      ruleText:
        "When mapping competitor or generic products, align by: Application type (CTC/Orthodox/Instant/Concentrate) and Business model (FOFO/FOCO/Export/Fine Dine/Distributor Demo). Give best-fit mapping without unnecessary clarification. If no match exists, generate a WhatsApp-ready customer specification request.",
      priority: 40,
      isActive: true,
    },
    {
      title: "WhatsApp Fallback",
      ruleText:
        "When no suitable Tea Planet product exists for a request, generate a professional WhatsApp-ready message asking for a customer specification. Include: product use case, application type, volume requirement, and preferred delivery format.",
      priority: 30,
      isActive: true,
    },
  ];

  for (const rule of rules) {
    await prisma.promptRule.upsert({
      where: { id: rule.title },
      update: rule,
      create: { ...rule, id: rule.title.replace(/\s+/g, "-").toLowerCase() },
    });
  }
  console.log(`✅ ${rules.length} prompt rules seeded`);

  // ─── Sample placeholder products ───────────────────────────────────────────
  const sampleProducts = [
    {
      sku: "IMPORT-REQUIRED-001",
      name: "⚠ Catalog Import Required",
      category: "Placeholder",
      notes: "Import your Tea Planet product catalog CSV/XLSX via Admin → Products → Import Catalog.",
    },
    {
      sku: "BI-SILKYMIX-001",
      name: "Silky Mix – Boba Base (Sample)",
      category: "Boba Innovations",
      subcategory: "Premix Bases",
      applicationType: "FOFO,FOCO,Training",
      unit: "kg",
      packSize: "1 kg",
      notes: "Sample placeholder. Import real catalog for actual SKU, price, and details.",
    },
    {
      sku: "BI-SPONGE-001",
      name: "Sponge Boba Flavour – Assorted (Sample)",
      category: "Boba Innovations",
      subcategory: "Sponge Boba",
      applicationType: "FOFO,FOCO,Fine Dine",
      unit: "kg",
      packSize: "1 kg",
      notes: "Sample placeholder. Import real catalog for actual SKU, price, and details.",
    },
  ];

  for (const p of sampleProducts) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    });
  }
  console.log(`✅ ${sampleProducts.length} sample products seeded`);
  console.log("\n⚠  Import your real catalog at: Admin → Products → Import Catalog\n");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
