"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Lock, Search, Filter } from "lucide-react";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

const problems: Array<{ id: number; title: string; difficulty: Difficulty; category: string; locked: boolean }> = [
  { id: 1, title: "Select All Columns", difficulty: "EASY", category: "Basic Select", locked: false },
  { id: 2, title: "Select Specific Columns", difficulty: "EASY", category: "Basic Select", locked: false },
  { id: 3, title: "Where Clause Filtering", difficulty: "EASY", category: "Filtering", locked: false },
  { id: 4, title: "AND OR Operators", difficulty: "EASY", category: "Filtering", locked: false },
  { id: 5, title: "Order By Clause", difficulty: "EASY", category: "Sorting", locked: false },
  { id: 6, title: "Limit and Offset", difficulty: "EASY", category: "Pagination", locked: false },
  { id: 7, title: "Distinct Values", difficulty: "EASY", category: "Aggregation", locked: false },
  { id: 8, title: "Count Function", difficulty: "EASY", category: "Aggregation", locked: false },
  { id: 9, title: "Sum and Average", difficulty: "EASY", category: "Aggregation", locked: false },
  { id: 10, title: "Min and Max", difficulty: "EASY", category: "Aggregation", locked: false },
  { id: 11, title: "Group By Basics", difficulty: "MEDIUM", category: "Grouping", locked: false },
  { id: 12, title: "Having Clause", difficulty: "MEDIUM", category: "Grouping", locked: false },
  { id: 13, title: "Inner Join", difficulty: "MEDIUM", category: "Joins", locked: false },
  { id: 14, title: "Left Join", difficulty: "MEDIUM", category: "Joins", locked: false },
  { id: 15, title: "Right Join", difficulty: "MEDIUM", category: "Joins", locked: false },
  { id: 16, title: "Multiple Joins", difficulty: "MEDIUM", category: "Joins", locked: false },
  { id: 17, title: "Subqueries", difficulty: "MEDIUM", category: "Advanced", locked: false },
  { id: 18, title: "IN Operator", difficulty: "MEDIUM", category: "Filtering", locked: false },
  { id: 19, title: "EXISTS Clause", difficulty: "MEDIUM", category: "Advanced", locked: false },
  { id: 20, title: "Case When", difficulty: "MEDIUM", category: "Conditional", locked: false },
  { id: 21, title: "String Functions", difficulty: "MEDIUM", category: "Functions", locked: true },
  { id: 22, title: "Date Functions", difficulty: "MEDIUM", category: "Functions", locked: true },
];

const difficultyColors: Record<Difficulty, string> = {
  EASY: "text-[#C6FE1E] bg-[#C6FE1E]/10 border-[#C6FE1E]/20",
  MEDIUM: "text-[#FCD34D] bg-[#FCD34D]/10 border-[#FCD34D]/20",
  HARD: "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
};

export default function SQL50Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "ALL">("ALL");

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         problem.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === "ALL" || problem.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Back Button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#71717A] hover:text-white transition-colors mb-8 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">SQL 50</h1>
          <p className="text-[#71717A] text-lg">Master fundamental SQL concepts with 50 essential problems</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl text-white text-sm focus:outline-none focus:border-[#C6FE1E]/30 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#71717A]" />
            {["ALL", "EASY", "MEDIUM", "HARD"].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff as Difficulty | "ALL")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterDifficulty === diff
                    ? "bg-[#C6FE1E] text-black"
                    : "bg-[#0A0A0A] border border-[#262626]/50 text-[#71717A] hover:text-white hover:border-[#262626]"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-[#71717A]">
          Showing {filteredProblems.length} of {problems.length} problems
        </div>

        {/* Problems List */}
        <div className="space-y-3">
          {filteredProblems.map((problem) => (
            <Link
              key={problem.id}
              href={problem.locked ? "#" : `/compiler?title=${encodeURIComponent(problem.title)}&difficulty=${problem.difficulty}`}
              className={`block group p-5 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl hover:border-[#262626] transition-all ${
                problem.locked ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Number */}
                  <div className="w-10 h-10 rounded-lg bg-[#111] border border-[#262626]/50 flex items-center justify-center text-[#71717A] font-bold text-sm flex-shrink-0">
                    {problem.id}
                  </div>

                  {/* Content */}
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

                {/* Status */}
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
