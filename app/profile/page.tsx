"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Trophy, Flame, Calendar, CheckCircle2, Clock, Code2, Award, TrendingUp, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "submissions" | "stats">("overview");


  // Dynamic state
  const [userData, setUserData] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch user profile
        const userRes = await fetch("/api/user/profile");
        const user = userRes.ok ? await userRes.json() : null;
        setUserData(user);

        // Fetch progress
        const progressRes = await fetch("/api/user/progress");
        const progressData = progressRes.ok ? await progressRes.json() : [];
        setProgress(progressData);

        // Fetch submissions
        const submissionsRes = await fetch("/api/submissions?limit=10");
        const submissionsData = submissionsRes.ok ? await submissionsRes.json() : { data: [] };
        setRecentSubmissions(submissionsData.data || []);

      } catch (e) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculate stats from progress
  // Fetch all problems for accurate section/overall progress
  const [allProblems, setAllProblems] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await fetch("/api/problems?limit=1000");
        const data = res.ok ? await res.json() : { data: [] };
        setAllProblems(data.data || []);
      } catch {
        setAllProblems([]);
      }
    }
    fetchProblems();
  }, []);

  // Map: sectionName -> { total, solved }
  const sectionStats: Record<string, { total: number; solved: number }> = {};
  allProblems.forEach((problem) => {
    const section = problem.section || "Other";
    if (!sectionStats[section]) sectionStats[section] = { total: 0, solved: 0 };
    sectionStats[section].total++;
  });
  progress.forEach((p) => {
    if (p.status === "SOLVED" && p.problem) {
      const section = p.problem.section || "Other";
      if (sectionStats[section]) sectionStats[section].solved++;
    }
  });

  // Overall progress
  const totalProblems = allProblems.length;
  const totalSolved = progress.filter((p) => p.status === "SOLVED").length;
  const completionPercentage = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  // Difficulty breakdown (dynamic)
  const easy = progress.filter((p) => p.status === "SOLVED" && p.problem?.difficulty === "EASY").length;
  const medium = progress.filter((p) => p.status === "SOLVED" && p.problem?.difficulty === "MEDIUM").length;
  const hard = progress.filter((p) => p.status === "SOLVED" && p.problem?.difficulty === "HARD").length;


  // Loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="text-lg text-muted-foreground">Loading...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <span className="text-lg text-destructive">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground mb-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </Button>

        {/* Profile Header */}
        <div className="mb-8 p-8 bg-card border border-border rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-cyan-400 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center text-3xl font-bold text-foreground">
                  {userData?.name ? userData.name.split(' ').map((n: string) => n[0]).join('') : "U"}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">{userData?.name || "User"}</h1>
                <p className="text-muted-foreground mb-3">@{userData?.username || "username"}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                    <Trophy size={14} className="text-primary" />
                    <span className="text-xs font-bold text-primary">{userData?.xp ?? 0} XP</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-muted-foreground text-sm mb-1">Global Rank</div>
              <div className="text-2xl font-bold text-foreground">{userData?.rank ?? "-"}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 size={20} className="text-primary" />
              <span className="text-muted-foreground text-sm">Solved</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{totalSolved}</div>
            <div className="text-xs text-muted-foreground mt-1">of {totalProblems} problems</div>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Flame size={20} className="text-orange-500" />
              <span className="text-muted-foreground text-sm">Streak</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{userData?.streak ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">days current</div>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Target size={20} className="text-blue-500" />
              <span className="text-muted-foreground text-sm">Best Streak</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{userData?.longestStreak ?? 0}</div>
            <div className="text-xs text-muted-foreground mt-1">days max</div>
          </div>

          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-purple-500" />
              <span className="text-muted-foreground text-sm">Progress</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{completionPercentage}%</div>
            <div className="text-xs text-muted-foreground mt-1">completion rate</div>
            <div className="mt-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${completionPercentage}%` }} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{totalSolved}/{totalProblems} solved</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "overview"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "submissions"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recent Submissions
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "stats"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Difficulty Breakdown */}
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-lg font-bold text-foreground mb-6">Problems Solved</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Easy</span>
                    <span className="text-sm font-bold text-foreground">{easy}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${allProblems.filter(p => p.difficulty === 'EASY').length ? (easy / allProblems.filter(p => p.difficulty === 'EASY').length) * 100 : 0}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{easy}/{allProblems.filter(p => p.difficulty === 'EASY').length} solved</div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Medium</span>
                    <span className="text-sm font-bold text-foreground">{medium}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-500" style={{ width: `${allProblems.filter(p => p.difficulty === 'MEDIUM').length ? (medium / allProblems.filter(p => p.difficulty === 'MEDIUM').length) * 100 : 0}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{medium}/{allProblems.filter(p => p.difficulty === 'MEDIUM').length} solved</div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Hard</span>
                    <span className="text-sm font-bold text-foreground">{hard}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${allProblems.filter(p => p.difficulty === 'HARD').length ? (hard / allProblems.filter(p => p.difficulty === 'HARD').length) * 100 : 0}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{hard}/{allProblems.filter(p => p.difficulty === 'HARD').length} solved</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === "submissions" && (
          <div className="p-6 bg-card border border-border rounded-xl">
            <h3 className="text-lg font-bold text-foreground mb-6">Recent Submissions</h3>
            <div className="space-y-3">
              {recentSubmissions.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">No submissions yet</div>
              ) : recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-4 bg-muted/50 border border-border rounded-lg hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-foreground mb-2">{submission.problem?.title || submission.title || "-"}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          (submission.problem?.difficulty || submission.difficulty) === "EASY" ? "text-green-500 bg-green-500/10 border-green-500/20" :
                          (submission.problem?.difficulty || submission.difficulty) === "MEDIUM" ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" :
                          "text-red-500 bg-red-500/10 border-red-500/20"
                        }`}>
                          {submission.problem?.difficulty || submission.difficulty || "-"}
                        </span>
                        <span className={`text-xs font-semibold ${
                          (submission.status || submission.verdict) === "Accepted" ? "text-green-500" : "text-red-500"
                        }`}>
                          {submission.status || submission.verdict || "-"}
                        </span>
                        <span className="text-xs text-muted-foreground">{submission.executionTime ? `${submission.executionTime}ms` : (submission.runtime || "-")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {submission.createdAt ? new Date(submission.createdAt).toLocaleString() : (submission.time || "-")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="p-6 bg-card border border-border rounded-xl">
            <h3 className="text-lg font-bold text-foreground mb-6">Detailed Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Submission Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Submissions</span>
                    <span className="text-sm font-bold text-foreground">{recentSubmissions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                    <span className="text-sm font-bold text-primary">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Runtime</span>
                    <span className="text-sm font-bold text-foreground">67ms</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Activity</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Problems This Week</span>
                    <span className="text-sm font-bold text-foreground">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Problems This Month</span>
                    <span className="text-sm font-bold text-foreground">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Most Active Day</span>
                    <span className="text-sm font-bold text-foreground">Monday</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
