import Link from "next/link";
import { ChevronRight, Database, BookOpen, GitMerge, Search } from "lucide-react";

const sections = [
  {
    id: "sql50",
    title: "SQL 50",
    description: "Master fundamental SQL concepts with 50 essential problems",
    problems: 50,
    completed: 12,
    icon: Database,
    color: "from-[#C6FE1E] to-[#a8d617]",
    href: "/sql50"
  },
  {
    id: "sql75",
    title: "SQL 75",
    description: "Advanced SQL challenges for experienced developers",
    problems: 75,
    completed: 8,
    icon: BookOpen,
    color: "from-blue-500 to-blue-600",
    href: "/sql75"
  },
  {
    id: "joins",
    title: "Joins",
    description: "Master INNER, LEFT, RIGHT, FULL joins and complex relationships",
    problems: 30,
    completed: 5,
    icon: GitMerge,
    color: "from-purple-500 to-purple-600",
    href: "/joins"
  },
  {
    id: "self-queries",
    title: "Self Queries",
    description: "Advanced self-join patterns and recursive queries",
    problems: 25,
    completed: 3,
    icon: Search,
    color: "from-orange-500 to-orange-600",
    href: "/selfquery"
  }
];

export default function DashboardPage() {
  const totalProblems = sections.reduce((sum, s) => sum + s.problems, 0);
  const totalCompleted = sections.reduce((sum, s) => sum + s.completed, 0);
  const completionPercentage = Math.round((totalCompleted / totalProblems) * 100);

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
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

        {/* Section Cards */}
        <div className="space-y-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const progress = Math.round((section.completed / section.problems) * 100);
            
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
                          {section.problems} problems
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
                          {section.completed}/{section.problems}
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
