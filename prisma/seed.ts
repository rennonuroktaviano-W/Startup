import { PrismaClient, FAQCategory } from "@prisma/client";
import { hash } from "argon2";
import { siteConfig } from "../src/lib/site";
import { servicesList, homeFaqs } from "../src/lib/content";

const prisma = new PrismaClient();

const CATEGORY_MAP: Record<string, FAQCategory> = {
  General: "GENERAL",
  Service: "SERVICE",
  Process: "PROCESS",
  Pricing: "PRICING",
};

async function seedAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("SKIP admin: INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD belum diset.");
    return;
  }
  const passwordHash = await hash(password);
  const admin = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { status: "ACTIVE" as const },
    create: {
      name: "Admin KotakIde",
      email: email.toLowerCase(),
      passwordHash,
      role: "SUPER_ADMIN" as const,
      status: "ACTIVE" as const,
    },
  });
  console.log(`Admin siap: ${admin.email} (${admin.role})`);
}

async function seedSettings() {
  const settings: Array<{ key: string; group: string; valueJson: unknown; isPublic?: boolean }> = [
    { key: "app.name", group: "brand", valueJson: siteConfig.name, isPublic: true },
    { key: "app.tagline", group: "brand", valueJson: siteConfig.tagline, isPublic: true },
    { key: "app.description", group: "brand", valueJson: siteConfig.description, isPublic: true },
    { key: "contact.email", group: "contact", valueJson: siteConfig.email, isPublic: true },
    { key: "contact.whatsapp", group: "contact", valueJson: siteConfig.whatsapp, isPublic: true },
    { key: "contact.whatsapp_display", group: "contact", valueJson: siteConfig.whatsappDisplay, isPublic: true },
    { key: "contact.response_time", group: "contact", valueJson: siteConfig.responseTime, isPublic: true },
    {
      key: "form.budget_ranges",
      group: "contact",
      valueJson: siteConfig.budgets,
      isPublic: true,
    },
    {
      key: "social.links",
      group: "contact",
      valueJson: [{ platforms: [], note: "Isi melalui CMS Settings > Contact" }],
      isPublic: false,
    },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { valueJson: s.valueJson as never, group: s.group, isPublic: s.isPublic ?? false },
      create: {
        key: s.key,
        valueJson: s.valueJson as never,
        group: s.group,
        isPublic: s.isPublic ?? false,
      },
    });
  }
  console.log(`Settings tersedia: ${settings.length} entri.`);
}

async function seedServices() {
  for (let i = 0; i < servicesList.length; i++) {
    const s = servicesList[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        shortDescription: s.shortDescription,
        bodyJson: s.longDescription as never,
        targetClient: s.targetClient,
        problemsSolved: s.problemsSolved as never,
        priceMode: s.priceMode === "PRICED" ? "PRICED" : "BY_SCOPE",
        timelineText: s.timelineText,
        isFeatured: i < 3,
        sortOrder: i,
      },
      create: {
        slug: s.slug,
        name: s.name,
        shortDescription: s.shortDescription,
        bodyJson: s.longDescription as never,
        targetClient: s.targetClient,
        problemsSolved: s.problemsSolved as never,
        priceMode: s.priceMode === "PRICED" ? "PRICED" : "BY_SCOPE",
        timelineText: s.timelineText,
        status: "PUBLISHED",
        isFeatured: i < 3,
        sortOrder: i,
        metaTitle: s.name,
        metaDescription: s.shortDescription,
      },
    });

    const service = await prisma.service.findUniqueOrThrow({ where: { slug: s.slug } });
    for (let d = 0; d < s.deliverables.length; d++) {
      const dl = s.deliverables[d];
      await prisma.serviceDeliverable.upsert({
        where: { id: `${service.id}-${d}` },
        update: { title: dl.title, description: dl.description, sortOrder: d },
        create: {
          id: `${service.id}-${d}`,
          serviceId: service.id,
          title: dl.title,
          description: dl.description,
          sortOrder: d,
        },
      });
    }
  }
  console.log(`Services tersedia: ${servicesList.length}.`);
}

async function seedFaqs() {
  for (let i = 0; i < homeFaqs.length; i++) {
    const f = homeFaqs[i];
    await prisma.fAQ.upsert({
      where: { id: `faq-seed-${i}` },
      update: {
        question: f.question,
        answerJson: f.answer as never,
        category: CATEGORY_MAP[f.category] ?? "GENERAL",
        sortOrder: i,
      },
      create: {
        id: `faq-seed-${i}`,
        question: f.question,
        answerJson: f.answer as never,
        category: CATEGORY_MAP[f.category] ?? "GENERAL",
        status: "PUBLISHED",
        sortOrder: i,
      },
    });
  }
  console.log(`FAQ tersedia: ${homeFaqs.length}.`);
}

async function seedNavigation() {
  const nav = [
    { label: "Home", href: "/", iconKey: "home", isCta: false, desktop: 1, mobile: 1 },
    { label: "Services", href: "/services", iconKey: "grid", isCta: false, desktop: 2, mobile: 2 },
    { label: "Work", href: "/work", iconKey: "briefcase", isCta: false, desktop: 3, mobile: 3 },
    { label: "About", href: "/about", iconKey: "users", isCta: false, desktop: 4, mobile: 5 },
    { label: "Process", href: "/process", iconKey: "route", isCta: false, desktop: 5, mobile: 6 },
    { label: "Insight", href: "/insights", iconKey: "book", isCta: false, desktop: 6, mobile: 7 },
    { label: "Contact", href: "/contact", iconKey: "message", isCta: true, desktop: 7, mobile: 4 },
  ];
  for (const n of nav) {
    await prisma.navigationItem.upsert({
      where: { id: `nav-${n.href.replace(/\//g, "") || "home"}` },
      update: {
        label: n.label,
        href: n.href,
        iconKey: n.iconKey,
        isCta: n.isCta,
        isVisible: true,
        desktopOrder: n.desktop,
        mobileOrder: n.mobile,
      },
      create: {
        id: `nav-${n.href.replace(/\//g, "") || "home"}`,
        label: n.label,
        href: n.href,
        type: "INTERNAL",
        iconKey: n.iconKey,
        isCta: n.isCta,
        isVisible: true,
        desktopOrder: n.desktop,
        mobileOrder: n.mobile,
      },
    });
  }
  console.log(`Navigation tersedia: ${nav.length} item.`);
}

async function main() {
  await seedAdmin();
  await seedSettings();
  await seedServices();
  await seedFaqs();
  await seedNavigation();
  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());