"use client"
import Link from "next/link";
import { ChevronRight, Database, BookOpen, GitMerge, Search } from "lucide-react";
import { useEffect, useState } from "react";


const sections = [
  {
    id: "sql50",
    title: "SQL 50",
    description: "Master fundamental SQL concepts with 50 essential problems",
    icon: Database,
    color: "from-[#C6FE1E] to-[#a8d617]",
    href: "/sql50",
    category: "SQL 50"
  },
  {
    id: "sql75",
    title: "SQL 75",
    description: "Advanced SQL challenges for experienced developers",
    icon: BookOpen,
    color: "from-blue-500 to-blue-600",
    href: "/sql75",
    category: "SQL 75"
  },
  {
    id: "joins",
    title: "Joins",
    description: "Master INNER, LEFT, RIGHT, FULL joins and complex relationships",
    icon: GitMerge,
    color: "from-purple-500 to-purple-600",
    href: "/joins",
    category: "Joins"
  },
  {
    id: "self-queries",
    title: "Self Queries",
    description: "Advanced self-join patterns and recursive queries",
    icon: Search,
    color: "from-orange-500 to-orange-600",
    href: "/selfquery",
    category: "Self Queries"
  }
];




export default function DashboardPage() {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [allProblems, setAllProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [progressRes, problemsRes] = await Promise.all([
          fetch("/api/user/progress"),
          fetch("/api/problems")
        ]);
        const progress = progressRes.ok ? await progressRes.json() : [];
        let problems = problemsRes.ok ? await problemsRes.json() : [];
        // Defensive: if problems is not an array, convert to array
        if (!Array.isArray(problems)) {
          problems = Object.values(problems);
        }
        setProgressData(progress || []);
        setAllProblems(problems || []);
      } catch {
        setProgressData([]);
        setAllProblems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // Map: sectionName -> { total, solved }
  const sectionStats: Record<string, { total: number; solved: number }> = {};
  if (Array.isArray(allProblems)) {
    allProblems.forEach((problem) => {
      const section = problem.category || problem.section || "Other";
      if (!sectionStats[section]) sectionStats[section] = { total: 0, solved: 0 };
      sectionStats[section].total++;
    });
  }
  progressData.forEach((p) => {
    if (p.status === "SOLVED" && p.problem) {
      const section = p.problem.category || p.problem.section || "Other";
      if (sectionStats[section]) sectionStats[section].solved++;
    }
  });

  // Overall progress
  const totalProblems = allProblems.length;
  const totalCompleted = progressData.filter((p) => p.status === "SOLVED").length;
  const completionPercentage = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <span className="text-lg text-[#A1A1A1]">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => window.location.assign("/")}
            className="inline-flex items-center gap-2 text-[#C6FE1E] hover:text-black bg-[#181818] hover:bg-[#C6FE1E] border border-[#C6FE1E]/40 font-semibold rounded-lg px-4 py-2 transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="group-hover:-translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        </div>
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Dashboard</h1>
          <p className="text-[#71717A] text-lg">Track your progress across all SQL topics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-2xl">
            <div className="text-[#71717A] text-sm font-medium mb-2">Total Problems</div>
            <div className="text-3xl font-bold text-white">{totalProblems}</div>
          </div>
          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-2xl">
            <div className="text-[#71717A] text-sm font-medium mb-2">Completed</div>
            <div className="text-3xl font-bold text-[#C6FE1E]">{totalCompleted}</div>
          </div>
          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-2xl">
            <div className="text-[#71717A] text-sm font-medium mb-2">Progress</div>
            <div className="text-3xl font-bold text-white">{completionPercentage}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-[#71717A] uppercase tracking-wider">Overall Progress</span>
            <span className="text-sm font-bold text-white">{totalCompleted}/{totalProblems}</span>
          </div>
          <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#C6FE1E] transition-all duration-700" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

       <div className="space-y-4">
  {sections.map((section) => {
    const Icon = section.icon;
    const stats = sectionStats[section.category] || { total: 0, solved: 0 };
    const progress = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
    return (
      <Link
        key={section.id}
        href={section.href}
        className="group block p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-2xl hover:border-[#C6FE1E]/30 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Icon */}
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0`}>
              <Icon size={28} className="text-white" />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-[#C6FE1E] transition-colors">
                  {section.title}
                </h3>
                <span className="text-xs text-[#71717A] font-medium">
                  {stats.total} problems
                </span>
              </div>
              <p className="text-sm text-[#71717A] mb-3">{section.description}</p>
              {/* Progress */}
              <div className="flex items-center gap-3">
                <div className="flex-1 max-w-xs">
                  <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C6FE1E] transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs font-bold text-[#71717A]">
                  {stats.solved}/{stats.total}
                </span>
              </div>
            </div>
          </div>
          {/* Arrow */}
          <ChevronRight
            size={24}
            className="text-[#262626] group-hover:text-[#C6FE1E] group-hover:translate-x-1 transition-all flex-shrink-0 ml-4"
          />
        </div>
      </Link>
    );
  })}
</div>

      </div>
    </div>
  );
}
