"use client";

import Link from "next/link";
import { ArrowRight, Database, Terminal, Zap, Trophy, Activity, Code2, CheckCircle2, Play, Github } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { motion } from "motion/react";
import { RainbowButton } from "@/components/ui/rainbow-button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">

      <div className="fixed inset-0 z-0 pointer-events-none">
        <FlickeringGrid
          className="w-full h-full opacity-10 dark:opacity-20"
          squareSize={4}
          gridGap={6}
          color="#C6FE1E"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>


      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            


            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-[1.1]"
            >
              Master SQL. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/60">
                Build Muscle Memory.
              </span>
            </motion.h1>

  
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              The industrial-grade SQL practice platform. 
              <span className="text-foreground font-medium"> 40 curated problems</span>. 
              Real-time execution. Zero setup.
            </motion.p>

   
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link
                href="/sql50"
                className="group relative h-12 px-8 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(198,254,30,0.3)]"
              >
                <span>Start Coding Now</span>
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/problems"
                className="h-12 px-8 flex items-center justify-center bg-background text-foreground border border-border rounded-full font-semibold text-sm hover:bg-accent transition-all hover:border-primary/50"
              >
                View Problem Set
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center mt-4"
            >
              <Link
                href="https://github.com/vaijaaaaa/SQL-Bench"
                target="_blank"
                rel="noopener noreferrer"
              >
                <RainbowButton size="sm" className="gap-2">
                  <Github size={16} />
                  <span>Star on GitHub</span>
                </RainbowButton>
              </Link>
            </motion.div>
          </div>

        
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent rounded-2xl blur-xl opacity-50" />
            <div className="relative bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
    
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                </div>
                <div className="text-xs font-mono text-muted-foreground">main.sql</div>
                <div className="w-16" /> 
              </div>
          
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                <div className="p-6 font-mono text-sm bg-card">
                  <div className="text-muted-foreground mb-2">-- Find top 3 users by points</div>
                  <div className="text-primary">SELECT</div>
                  <div className="pl-4 text-foreground">username,</div>
                  <div className="pl-4 text-foreground">total_points</div>
                  <div className="text-primary">FROM</div>
                  <div className="pl-4 text-foreground">users</div>
                  <div className="text-primary">ORDER BY</div>
                  <div className="pl-4 text-foreground">total_points <span className="text-primary">DESC</span></div>
                  <div className="text-primary">LIMIT</div>
                  <div className="pl-4 text-[#F59E0B]">3</div>
                  <div className="text-foreground">;</div>
                  
                  <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Ready to execute
                  </div>
                </div>
                <div className="p-6 bg-muted/10">
                  <div className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Query Result</div>
                  <div className="space-y-2 font-mono text-sm">
                    <div className="grid grid-cols-2 text-muted-foreground pb-2 border-b border-border">
                      <span>username</span>
                      <span className="text-right">total_points</span>
                    </div>
                    <div className="grid grid-cols-2 text-foreground">
                      <span>alex_dev</span>
                      <span className="text-right text-primary">2,450</span>
                    </div>
                    <div className="grid grid-cols-2 text-foreground">
                      <span>sarah_sql</span>
                      <span className="text-right text-primary">2,100</span>
                    </div>
                    <div className="grid grid-cols-2 text-foreground">
                      <span>mike_db</span>
                      <span className="text-right text-primary">1,950</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to <span className="text-primary">excel</span></h2>
            <p className="text-muted-foreground max-w-xl">From basic SELECT statements to complex recursive CTEs. We have structured the perfect learning path.</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
          
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <Link href="/sql50" className="block h-full group relative p-8 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all overflow-hidden shadow-sm hover:shadow-md">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity text-foreground">
                  <Database size={120} />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Code2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">SQL 50</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    The essential 50 problems every developer must know. Perfect for interviews.
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    Start Track <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>

       
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2">
              <Link href="/sql75" className="block h-full group relative p-8 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all overflow-hidden shadow-sm hover:shadow-md">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                      <Trophy size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">SQL 75 Advanced</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-md mb-6">
                      Deep dive into window functions, recursive queries, and complex joins. 
                      Designed for senior engineering roles.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      Challenge Yourself <ArrowRight size={14} />
                    </div>
                  </div>
        
                  <div className="hidden md:block w-64 h-32 bg-muted/30 rounded-xl border border-border p-4 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary/20 to-transparent" />
                    <div className="flex items-end justify-between h-full gap-2">
                      <div className="w-full bg-muted h-[40%]" />
                      <div className="w-full bg-muted h-[60%]" />
                      <div className="w-full bg-primary h-[80%]" />
                      <div className="w-full bg-muted h-[50%]" />
                      <div className="w-full bg-muted h-[70%]" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

       
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="md:col-span-2">
              <div className="h-full group relative p-8 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Instant Feedback Loop</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-lg">
                    No local setup required. We spin up isolated Postgres instances for every query. 
                    Get execution plans and results in milliseconds.
                  </p>
                </div>
              </div>
            </motion.div>

          
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <div className="h-full group relative p-8 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <Activity size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Analytics</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Track your streak, solve rate, and execution speed against global percentiles.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


      <section className="py-20 border-y border-border bg-muted/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">16</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Basic Select</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">8</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Inner Join</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">8</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Window Functions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-foreground mb-2">8</div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Self Join</div>
            </div>
          </motion.div>
        </div>
      </section>


      <footer className="py-12 px-6 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
              <Terminal size={14} strokeWidth={3} />
            </div>
            <span className="font-bold text-foreground tracking-tight">SQL-Bench</span>
          </div>
          <div className="text-muted-foreground text-sm">
            © 2025 SQL-Bench. Built for developers.
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/problems" className="hover:text-foreground transition-colors">Problems</Link>
            <Link href="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link>
            <Link href="/signin" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}