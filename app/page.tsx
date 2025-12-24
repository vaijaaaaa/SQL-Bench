import Link from "next/link";
import { ArrowRight, Code2, Trophy, Zap, Database, CheckCircle2, Users, Sparkles, Terminal, Play, BarChart3, Clock, Award, TrendingUp } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505]">
      

      <div className="fixed inset-0 z-0">
        <FlickeringGrid
          className="w-full h-full"
          squareSize={4}
          gridGap={6}
          color="#C6FE1E"
          maxOpacity={0.2}
          flickerChance={0.1}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-24">
        {/* Gradient Overlays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#C6FE1E]/8 rounded-full blur-[150px] z-0" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#C6FE1E]/5 rounded-full blur-[120px] z-0" />

        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A0A0A]/60 backdrop-blur-md border border-[#262626]/50 rounded-full mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E] animate-pulse" />
              <span className="text-[10px] font-bold text-[#C6FE1E] uppercase tracking-[0.15em]">
                Industrial SQL Training Platform
              </span>
              <Sparkles size={12} className="text-[#C6FE1E]" />
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.15]">
              <span className="text-white">Master SQL with</span>
              <br />
              <span className="text-[#C6FE1E] relative inline-block mt-2">
                QueryPulse
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-[#A1A1AA] max-w-2xl mx-auto mb-10 leading-relaxed">
              Practice <span className="text-white font-semibold">125+ curated SQL problems</span>. 
              Build query skills from basics to advanced.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link
                href="/sql50"
                className="group relative flex items-center gap-2 px-8 py-3.5 bg-[#C6FE1E] text-black rounded-xl font-bold text-sm hover:bg-[#b5ed0d] transition-all shadow-lg hover:shadow-[0_0_30px_rgba(198,254,30,0.4)]"
              >
                <span>Start Learning</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/problems"
                className="flex items-center gap-2 px-8 py-3.5 bg-[#0A0A0A]/60 backdrop-blur-md border border-[#262626] text-white rounded-xl font-semibold text-sm hover:border-[#C6FE1E]/50 transition-all"
              >
                <span>View Problems</span>
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#71717A]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#C6FE1E]" />
                <span><strong className="text-white font-semibold">10K+</strong> learners</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy size={14} className="text-[#C6FE1E]" />
                <span><strong className="text-white font-semibold">50K+</strong> solved</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#C6FE1E]" />
                <span><strong className="text-white font-semibold">95%</strong> success</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Stat Card 1 */}
            <div className="group relative p-8 bg-[#0A0A0A] border border-[#262626]/50 rounded-2xl hover:border-[#C6FE1E]/30 transition-all">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#C6FE1E]/10 border border-[#C6FE1E]/20 flex items-center justify-center mb-4">
                  <Database size={24} className="text-[#C6FE1E]" />
                </div>
                <div className="text-4xl font-bold mb-2 text-white">125+</div>
                <div className="text-sm text-[#71717A] font-medium">SQL Problems</div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="group relative p-8 bg-[#0A0A0A] border border-[#262626]/50 rounded-2xl hover:border-[#C6FE1E]/30 transition-all">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#C6FE1E]/10 border border-[#C6FE1E]/20 flex items-center justify-center mb-4">
                  <Users size={24} className="text-[#C6FE1E]" />
                </div>
                <div className="text-4xl font-bold mb-2 text-white">10K+</div>
                <div className="text-sm text-[#71717A] font-medium">Active Learners</div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="group relative p-8 bg-[#0A0A0A] border border-[#262626]/50 rounded-2xl hover:border-[#C6FE1E]/30 transition-all">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#C6FE1E]/10 border border-[#C6FE1E]/20 flex items-center justify-center mb-4">
                  <Trophy size={24} className="text-[#C6FE1E]" />
                </div>
                <div className="text-4xl font-bold mb-2 text-white">95%</div>
                <div className="text-sm text-[#71717A] font-medium">Success Rate</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-32 border-t border-[#262626]">
        {/* Background decoration */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#C6FE1E]/3 rounded-full blur-[150px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] border border-[#262626] rounded-full mb-6">
              <Sparkles size={16} className="text-[#C6FE1E]" />
              <span className="text-xs font-bold text-[#52525B] uppercase tracking-widest">Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Everything You Need to
              <br />
              <span className="text-[#C6FE1E]">Master SQL</span>
            </h2>
            <p className="text-xl text-[#52525B] max-w-2xl mx-auto">
              A complete learning platform with real-time compiler, progress tracking, and interview preparation.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Feature 1 */}
            <div className="group relative p-10 bg-[#0A0A0A] border border-[#262626] rounded-3xl hover:border-[#C6FE1E]/40 hover:shadow-[0_0_50px_-15px_rgba(198,254,30,0.2)] transition-all overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C6FE1E]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#C6FE1E] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-[0_0_30px_rgba(198,254,30,0.3)]">
                  <Code2 size={32} className="text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#C6FE1E] transition-colors">Interactive SQL Compiler</h3>
                <p className="text-[#A1A1AA] leading-relaxed mb-6">
                  Write and execute SQL queries in real-time. Get instant feedback with detailed error messages, execution time, and query optimization suggestions.
                </p>
                <ul className="space-y-2 text-sm text-[#52525B]">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Real-time syntax highlighting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Instant query execution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Smart error detection</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-10 bg-[#0A0A0A] border border-[#262626] rounded-3xl hover:border-[#C6FE1E]/40 hover:shadow-[0_0_50px_-15px_rgba(198,254,30,0.2)] transition-all overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C6FE1E]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#C6FE1E] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-[0_0_30px_rgba(198,254,30,0.3)]">
                  <Trophy size={32} className="text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#C6FE1E] transition-colors">XP & Progress Tracking</h3>
                <p className="text-[#A1A1AA] leading-relaxed mb-6">
                  Earn experience points for every solved problem. Track your progress across difficulty levels, topics, and unlock achievements as you advance.
                </p>
                <ul className="space-y-2 text-sm text-[#52525B]">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Level-based progression</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Achievement badges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Leaderboard rankings</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-10 bg-[#0A0A0A] border border-[#262626] rounded-3xl hover:border-[#C6FE1E]/40 hover:shadow-[0_0_50px_-15px_rgba(198,254,30,0.2)] transition-all overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C6FE1E]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#C6FE1E] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-[0_0_30px_rgba(198,254,30,0.3)]">
                  <Database size={32} className="text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#C6FE1E] transition-colors">Curated Problem Sets</h3>
                <p className="text-[#A1A1AA] leading-relaxed mb-6">
                  SQL 50 and SQL 75 collections covering joins, aggregations, subqueries, window functions, CTEs, and advanced optimization techniques.
                </p>
                <ul className="space-y-2 text-sm text-[#52525B]">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Difficulty-based learning path</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Topic-wise organization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Real-world scenarios</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative p-10 bg-[#0A0A0A] border border-[#262626] rounded-3xl hover:border-[#C6FE1E]/40 hover:shadow-[0_0_50px_-15px_rgba(198,254,30,0.2)] transition-all overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#C6FE1E]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-[#C6FE1E] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-[0_0_30px_rgba(198,254,30,0.3)]">
                  <CheckCircle2 size={32} className="text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-[#C6FE1E] transition-colors">Interview Ready</h3>
                <p className="text-[#A1A1AA] leading-relaxed mb-6">
                  Solve problems asked in real FAANG interviews. Prepare comprehensively for data analyst, data engineer, and backend developer positions.
                </p>
                <ul className="space-y-2 text-sm text-[#52525B]">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>FAANG interview questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Solution explanations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C6FE1E]" />
                    <span>Performance optimization tips</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* LEARNING PATH SECTION */}
      <section className="relative py-32 border-t border-[#262626]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Your Learning Path
            </h2>
            <p className="text-xl text-[#52525B] max-w-2xl mx-auto">
              Structured curriculum from beginner to advanced
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* SQL 50 Card */}
            <Link href="/sql50" className="group relative p-12 bg-gradient-to-br from-[#0A0A0A] to-[#050505] border-2 border-[#262626] rounded-[2.5rem] hover:border-[#C6FE1E]/50 transition-all overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#C6FE1E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="px-4 py-1.5 bg-[#C6FE1E]/10 border border-[#C6FE1E]/20 rounded-full">
                    <span className="text-xs font-bold text-[#C6FE1E] uppercase tracking-widest">Beginner</span>
                  </div>
                  <BarChart3 size={24} className="text-[#262626] group-hover:text-[#C6FE1E] transition-colors" />
                </div>
                
                <h3 className="text-4xl font-bold mb-4 group-hover:text-[#C6FE1E] transition-colors">SQL 50</h3>
                <p className="text-[#A1A1AA] leading-relaxed mb-8">
                  Master SQL fundamentals with 50 essential problems. Perfect for beginners and interview prep.
                </p>
                
                <div className="flex items-center gap-2 text-sm text-[#52525B] group-hover:text-white transition-colors">
                  <span>Explore curriculum</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* SQL 75 Card */}
            <Link href="/sql75" className="group relative p-12 bg-gradient-to-br from-[#0A0A0A] to-[#050505] border-2 border-[#262626] rounded-[2.5rem] hover:border-[#C6FE1E]/50 transition-all overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#C6FE1E]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="px-4 py-1.5 bg-blue-400/10 border border-blue-400/20 rounded-full">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Advanced</span>
                  </div>
                  <Clock size={24} className="text-[#262626] group-hover:text-[#C6FE1E] transition-colors" />
                </div>
                
                <h3 className="text-4xl font-bold mb-4 group-hover:text-[#C6FE1E] transition-colors">SQL 75</h3>
                <p className="text-[#A1A1AA] leading-relaxed mb-8">
                  Advanced SQL challenges including window functions, CTEs, and complex optimizations.
                </p>
                
                <div className="flex items-center gap-2 text-sm text-[#52525B] group-hover:text-white transition-colors">
                  <span>Explore curriculum</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative py-32 border-t border-[#262626]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative p-20 bg-gradient-to-br from-[#0A0A0A] via-[#050505] to-[#0A0A0A] border-2 border-[#262626] rounded-[3rem] text-center overflow-hidden">
            
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C6FE1E]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C6FE1E]/5 rounded-full blur-[100px]" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#C6FE1E] mb-8 shadow-[0_0_50px_rgba(198,254,30,0.4)]">
                <Zap size={40} fill="currentColor" className="text-black" />
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Ready to Start Your
                <br />
                <span className="text-[#C6FE1E]">SQL Journey?</span>
              </h2>
              
              <p className="text-xl text-[#A1A1AA] mb-10 max-w-2xl mx-auto">
                Join 10,000+ developers mastering SQL. Start practicing today and land your dream job.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/sql50"
                  className="flex items-center gap-3 px-10 py-5 bg-[#C6FE1E] text-black rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-[0_0_50px_rgba(198,254,30,0.4)]"
                >
                  <span>Begin with SQL 50</span>
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/compiler"
                  className="flex items-center gap-3 px-10 py-5 bg-transparent border-2 border-[#262626] text-white rounded-2xl font-bold text-lg hover:border-[#C6FE1E]/50 transition-all"
                >
                  <Terminal size={20} />
                  <span>Try Compiler</span>
                </Link>
              </div>
              
              <p className="text-sm text-[#262626] mt-8">No credit card required • Free forever</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}