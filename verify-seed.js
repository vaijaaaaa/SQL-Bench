const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const problems = await prisma.problem.findMany({
    select: { id: true, title: true, category: true, difficulty: true },
    take: 30,
    orderBy: { createdAt: 'asc' }
  });

  console.log('Sample of seeded problems:');
  console.log('=========================');
  
  const grouped = {};
  problems.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p.title);
  });

  Object.entries(grouped).forEach(([cat, titles]) => {
    console.log(`\n${cat}:`);
    titles.forEach(t => console.log(`  - ${t}`));
  });

  const totalCount = await prisma.problem.count();
  console.log(`\nTotal problems seeded: ${totalCount}`);
}

main().finally(async () => {
  await prisma.$disconnect();
});
