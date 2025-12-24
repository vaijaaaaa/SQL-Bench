import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

const problems: Array<{ id: number; title: string; difficulty: Difficulty; category: string; locked: boolean }> = [
  { id: 1, title: "Window Functions Basics", difficulty: "MEDIUM", category: "Window Functions", locked: false },
  { id: 2, title: "ROW_NUMBER vs RANK", difficulty: "MEDIUM", category: "Window Functions", locked: false },
  { id: 3, title: "DENSE_RANK Usage", difficulty: "MEDIUM", category: "Window Functions", locked: false },
  { id: 4, title: "Partition By", difficulty: "MEDIUM", category: "Window Functions", locked: false },
  { id: 5, title: "Running Totals", difficulty: "HARD", category: "Window Functions", locked: false },
  { id: 6, title: "CTE Basics", difficulty: "MEDIUM", category: "CTEs", locked: false },
  { id: 7, title: "Recursive CTE", difficulty: "HARD", category: "CTEs", locked: false },
  { id: 8, title: "Multiple CTEs", difficulty: "HARD", category: "CTEs", locked: false },
  { id: 9, title: "PIVOT Operations", difficulty: "HARD", category: "Advanced", locked: false },
  { id: 10, title: "UNPIVOT Operations", difficulty: "HARD", category: "Advanced", locked: false },
  { id: 11, title: "Cross Apply", difficulty: "HARD", category: "Advanced", locked: true },
  { id: 12, title: "Outer Apply", difficulty: "HARD", category: "Advanced", locked: true },
];

const difficultyColors: Record<Difficulty, string> = {
  EASY: "text-[#C6FE1E] bg-[#C6FE1E]/10 border-[#C6FE1E]/20",
  MEDIUM: "text-[#FCD34D] bg-[#FCD34D]/10 border-[#FCD34D]/20",
  HARD: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
};

export default function SQL75Page() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#71717A] hover:text-white transition-colors mb-8 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back to Dashboard</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">SQL 75</h1>
          <p className="text-[#71717A] text-lg">Advanced SQL challenges for experienced developers</p>
        </div>

        <div className="space-y-3">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              href={problem.locked ? "#" : `/compiler?title=${encodeURIComponent(problem.title)}&difficulty=${problem.difficulty}`}
              className={`block group p-5 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl hover:border-[#262626] transition-all ${
                problem.locked ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#111] border border-[#262626]/50 flex items-center justify-center text-[#71717A] font-bold text-sm flex-shrink-0">
                    {problem.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-white group-hover:text-[#C6FE1E] transition-colors">
                        {problem.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${difficultyColors[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-xs text-[#71717A]">{problem.category}</span>
                    </div>
                  </div>
                </div>
                {problem.locked ? (
                  <Lock size={18} className="text-[#262626] flex-shrink-0" />
                ) : (
                  <ChevronLeft size={20} className="text-[#262626] group-hover:text-[#C6FE1E] rotate-180 group-hover:translate-x-1 transition-all flex-shrink-0" />
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
