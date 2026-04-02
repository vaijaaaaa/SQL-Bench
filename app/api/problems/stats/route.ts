import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limiter";

export async function GET(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimit = await checkRateLimit(`problem-stats:${ip}`, 100, 60);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429 }
      );
    }

    const [totalProblems, byCategoryRaw, byDifficultyRaw] = await Promise.all([
      prisma.problem.count(),
      prisma.problem.groupBy({
        by: ["category"],
        _count: { _all: true },
      }),
      prisma.problem.groupBy({
        by: ["difficulty"],
        _count: { _all: true },
      }),
    ]);

    const byCategory = byCategoryRaw.map((item) => ({
      category: item.category,
      total: item._count._all,
    }));

    const byDifficulty = byDifficultyRaw.map((item) => ({
      difficulty: item.difficulty,
      total: item._count._all,
    }));

    return NextResponse.json(
      {
        totalProblems,
        byCategory,
        byDifficulty,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("Get problem stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch problem stats" },
      { status: 500 }
    );
  }
}
