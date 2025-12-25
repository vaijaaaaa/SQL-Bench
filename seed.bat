@echo off
echo 🌱 Seeding database with SQL problems...
npx ts-node prisma/seed.ts
echo ✅ Done!
pause
