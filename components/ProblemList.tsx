'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Lock, Search, Filter, Loader, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { companyColors, defaultCompanyColor } from '@/lib/utils';

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  slug: string;
  companies?: string[];
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
  EASY: 'text-green-500 bg-green-500/10 border-green-500/20',
  MEDIUM: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  HARD: 'text-red-500 bg-red-500/10 border-red-500/20',
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
        let queryString = '/api/problems?limit=1000';
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
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link href={backLink} className="flex items-center gap-2">
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>
          </Button>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-3">{title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">{description}</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col md:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-card"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter size={18} className="text-muted-foreground mr-2 hidden md:block" />
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
              <Button
                key={diff}
                variant={filterDifficulty === diff ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterDifficulty(diff as Difficulty | 'ALL')}
                className="text-xs font-bold"
              >
                {diff}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Category Filter (if multiple categories) */}
        {uniqueCategories.length > 1 && !category && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            <Button
              variant={filterCategory === 'ALL' ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilterCategory('ALL')}
              className="text-xs"
            >
              All Categories
            </Button>
            {uniqueCategories.map((cat) => (
              <Button
                key={cat}
                variant={filterCategory === cat ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setFilterCategory(cat)}
                className="text-xs"
              >
                {cat}
              </Button>
            ))}
          </motion.div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-muted-foreground">
          {loading ? 'Loading...' : `Showing ${filteredProblems.length} of ${problems.length} problems`}
        </div>

        {/* Problems List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground">Loading problems...</span>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">No problems found matching your filters.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery('');
                setFilterDifficulty('ALL');
                setFilterCategory('ALL');
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="space-y-3"
          >
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Link
                  href={`/compiler?problemId=${problem.id}`}
                  className="block group p-5 bg-card border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Problem Number */}
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {index + 1}
                      </div>

                      {/* Problem Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1 flex items-center gap-2">
                          {problem.title}
                          {isSolved(problem.id) && (
                            <CheckCircle2 size={16} className="text-green-500 fill-green-500/10" />
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
                          <span className="text-xs text-muted-foreground">{problem.category}</span>
                          <span className="text-xs text-muted-foreground">• {problem._count.testCases} test cases</span>
                          {problem.companies && problem.companies.length > 0 && (
                            <div className="flex gap-1 ml-2">
                              {problem.companies.slice(0, 3).map((company) => (
                                <Badge 
                                  key={company} 
                                  variant="secondary" 
                                  className={`text-[10px] h-5 px-1.5 font-normal ${companyColors[company] || defaultCompanyColor}`}
                                >
                                  {company}
                                </Badge>
                              ))}
                              {problem.companies.length > 3 && (
                                <span className="text-[10px] text-muted-foreground">+{problem.companies.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Chevron */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <ChevronLeft
                        size={20}
                        className="rotate-180"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
