"use client"
import Link from "next/link";
import { ChevronRight, Database, BookOpen, GitMerge, Search, ArrowLeft, Trophy, Activity, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

const sections = [
  {
    id: "sql50",
    title: "SQL 50",
    description: "Master fundamental SQL concepts with 50 essential problems",
    icon: Database,
    color: "text-chart-1",
    bg: "bg-chart-1/10",
    href: "/sql50",
    category: "SQL 50"
  },
  {
    id: "sql75",
    title: "SQL 75",
    description: "Advanced SQL challenges for experienced developers",
    icon: Trophy,
    color: "text-chart-2",
    bg: "bg-chart-2/10",
    href: "/sql75",
    category: "SQL 75"
  },
  {
    id: "joins",
    title: "Joins",
    description: "Master INNER, LEFT, RIGHT, FULL joins and complex relationships",
    icon: GitMerge,
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    href: "/joins",
    category: "Joins"
  },
  {
    id: "self-queries",
    title: "Self Queries",
    description: "Advanced self-join patterns and recursive queries",
    icon: Search,
    color: "text-chart-4",
    bg: "bg-chart-4/10",
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
          fetch("/api/problems?limit=1000")
        ]);
        const progress = progressRes.ok ? await progressRes.json() : [];
        const problemsData = problemsRes.ok ? await problemsRes.json() : { data: [] };
        
        // Handle the response structure { data: [...], pagination: {...} }
        const problems = Array.isArray(problemsData.data) ? problemsData.data : [];
        
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
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="text-lg text-muted-foreground animate-pulse">Loading workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FlickeringGrid
          className="w-full h-full opacity-10"
          squareSize={4}
          gridGap={6}
          color="#C6FE1E"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={() => window.location.assign("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Track your progress, analyze your performance, and master SQL concepts through our structured curriculum.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Database size={18} />
              </div>
              <div className="text-muted-foreground text-sm font-medium">Total Problems</div>
            </div>
            <div className="text-3xl font-bold text-foreground">{totalProblems}</div>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <CheckCircle2 size={18} />
              </div>
              <div className="text-muted-foreground text-sm font-medium">Completed</div>
            </div>
            <div className="text-3xl font-bold text-foreground">{totalCompleted}</div>
          </div>
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Activity size={18} />
              </div>
              <div className="text-muted-foreground text-sm font-medium">Progress</div>
            </div>
            <div className="text-3xl font-bold text-foreground">{completionPercentage}%</div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 p-8 bg-card border border-border rounded-3xl shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Trophy size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">Overall Progress</h3>
                <p className="text-sm text-muted-foreground">Keep pushing! You're doing great.</p>
              </div>
              <span className="text-2xl font-bold text-primary">{totalCompleted}/{totalProblems}</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-out relative" 
                style={{ width: `${completionPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Learning Tracks */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {sections.map((section) => {
            const Icon = section.icon;
            const stats = sectionStats[section.category] || { total: 0, solved: 0 };
            const progress = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
            
            return (
              <motion.div
                key={section.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Link
                  href={section.href}
                  className="group block h-full p-6 bg-card border border-border rounded-3xl hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${section.bg} flex items-center justify-center ${section.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="p-2 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                    {section.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-primary transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

function CheckCircle2({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
