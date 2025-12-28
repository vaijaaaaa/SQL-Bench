'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Lock, Search, Filter, Loader } from 'lucide-react';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  slug: string;
  _count: { testCases: number };
}

interface ProblemListProps {
  title: string;
  description: string;
  category?: string;
  categories?: string[];
  backLink: string;
}

const difficultyColors: Record<Difficulty, string> = {
  EASY: 'text-[#C6FE1E] bg-[#C6FE1E]/10 border-[#C6FE1E]/20',
  MEDIUM: 'text-[#FCD34D] bg-[#FCD34D]/10 border-[#FCD34D]/20',
  HARD: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20',
};


export default function ProblemList({
  title,
  description,
  category,
  categories,
  backLink,
}: ProblemListProps) {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string | 'ALL'>('ALL');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch('/api/user/progress');
        if (res.ok) {
          const data = await res.json();
          setProgressData(data || []);
        }
      } catch (error) {
        setProgressData([]);
      }
    };
    fetchProgress();
  }, []);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        let queryString = '/api/problems?limit=100';
        if (category) {
          queryString += `&category=${encodeURIComponent(category)}`;
        }
        const response = await fetch(queryString);
        const data = await response.json();
        setProblems(data.data || []);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [category]);

  // Helper to check if a problem is solved
  const isSolved = (problemId: string) =>
    progressData.some(
      (p: any) => p.problemId === problemId && p.status === "SOLVED"
    );

  // Filter problems based on search and difficulty
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'ALL' || problem.difficulty === filterDifficulty;
    const matchesCategory = filterCategory === 'ALL' || problem.category === filterCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  // Get unique categories from problems
  const uniqueCategories = Array.from(new Set(problems.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href={backLink}
          className="inline-flex items-center gap-2 text-[#71717A] hover:text-white transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">{title}</h1>
          <p className="text-[#71717A] text-lg">{description}</p>
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

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-[#71717A]" />
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff as Difficulty | 'ALL')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  filterDifficulty === diff
                    ? 'bg-[#C6FE1E] text-black'
                    : 'bg-[#0A0A0A] border border-[#262626]/50 text-[#71717A] hover:text-white hover:border-[#262626]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter (if multiple categories) */}
        {uniqueCategories.length > 1 && !category && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('ALL')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filterCategory === 'ALL'
                  ? 'bg-[#C6FE1E] text-black'
                  : 'bg-[#0A0A0A] border border-[#262626]/50 text-[#71717A] hover:text-white'
              }`}
            >
              All Categories
            </button>
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterCategory === cat
                    ? 'bg-[#C6FE1E] text-black'
                    : 'bg-[#0A0A0A] border border-[#262626]/50 text-[#71717A] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-[#71717A]">
          {loading ? 'Loading...' : `Showing ${filteredProblems.length} of ${problems.length} problems`}
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-[#C6FE1E] animate-spin" />
            <span className="ml-3 text-[#71717A]">Loading problems...</span>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#71717A]">No problems found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProblems.map((problem, index) => (
              <Link
                key={problem.id}
                href={`/compiler?problemId=${problem.id}`}
                className="block group p-5 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl hover:border-[#C6FE1E]/30 transition-all hover:shadow-[0_0_20px_rgba(198,254,30,0.1)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Problem Number */}
                    <div className="w-10 h-10 rounded-lg bg-[#111] border border-[#262626]/50 flex items-center justify-center text-[#71717A] font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>

                    {/* Problem Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white group-hover:text-[#C6FE1E] transition-colors mb-1 flex items-center gap-2">
                        {problem.title}
                        {isSolved(problem.id) && (
                          <span title="Solved" className="inline-block text-[#C6FE1E] font-bold text-lg align-middle">✔</span>
                        )}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            difficultyColors[problem.difficulty]
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                        <span className="text-xs text-[#71717A]">{problem.category}</span>
                        <span className="text-xs text-[#71717A]">• {problem._count.testCases} test cases</span>
                      </div>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronLeft
                    size={20}
                    className="text-[#262626] group-hover:text-[#C6FE1E] rotate-180 group-hover:translate-x-1 transition-all flex-shrink-0"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
