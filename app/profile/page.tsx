"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Trophy, Flame, Calendar, CheckCircle2, Clock, Code2, Award, TrendingUp, Target, Zap } from "lucide-react";

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
        const res = await fetch("/api/problems");
        const data = res.ok ? await res.json() : [];
        setAllProblems(data);
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
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <span className="text-lg text-[#A1A1A1]">Loading...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <span className="text-lg text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#71717A] hover:text-white transition-colors mb-8 group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back to Dashboard</span>
        </Link>

        {/* Profile Header */}
        <div className="mb-8 p-8 bg-[#0A0A0A] border border-[#262626]/50 rounded-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#C6FE1E] to-[#00E0FF] p-[2px]">
                <div className="w-full h-full rounded-2xl bg-[#050505] flex items-center justify-center text-3xl font-bold">
                  {userData?.name ? userData.name.split(' ').map((n: string) => n[0]).join('') : "U"}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{userData?.name || "User"}</h1>
                <p className="text-[#71717A] mb-3">@{userData?.username || "username"}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-[#71717A]" />
                    <span className="text-[#A1A1AA]">Joined {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#C6FE1E]/10 border border-[#C6FE1E]/20 rounded-lg">
                    <Trophy size={14} className="text-[#C6FE1E]" />
                    <span className="text-xs font-bold text-[#C6FE1E]">{userData?.xp ?? 0} XP</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-[#71717A] text-sm mb-1">Global Rank</div>
              <div className="text-2xl font-bold text-white">{userData?.rank ?? "-"}</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 size={20} className="text-[#C6FE1E]" />
              <span className="text-[#71717A] text-sm">Solved</span>
            </div>
            <div className="text-3xl font-bold text-white">{totalSolved}</div>
            <div className="text-xs text-[#71717A] mt-1">of {totalProblems} problems</div>
          </div>

          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Flame size={20} className="text-orange-500" />
              <span className="text-[#71717A] text-sm">Streak</span>
            </div>
            <div className="text-3xl font-bold text-white">{userData?.streak ?? 0}</div>
            <div className="text-xs text-[#71717A] mt-1">days current</div>
          </div>

          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Target size={20} className="text-blue-500" />
              <span className="text-[#71717A] text-sm">Best Streak</span>
            </div>
            <div className="text-3xl font-bold text-white">{userData?.longestStreak ?? 0}</div>
            <div className="text-xs text-[#71717A] mt-1">days max</div>
          </div>

          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-purple-500" />
              <span className="text-[#71717A] text-sm">Progress</span>
            </div>
            <div className="text-3xl font-bold text-white">{completionPercentage}%</div>
            <div className="text-xs text-[#71717A] mt-1">completion rate</div>
            <div className="mt-2">
              <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div className="h-full bg-[#C6FE1E]" style={{ width: `${completionPercentage}%` }} />
              </div>
              <div className="text-xs text-[#A1A1A1] mt-1">{totalSolved}/{totalProblems} solved</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#262626]/50">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "overview"
                ? "text-white border-b-2 border-[#C6FE1E]"
                : "text-[#71717A] hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "submissions"
                ? "text-white border-b-2 border-[#C6FE1E]"
                : "text-[#71717A] hover:text-white"
            }`}
          >
            Recent Submissions
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "stats"
                ? "text-white border-b-2 border-[#C6FE1E]"
                : "text-[#71717A] hover:text-white"
            }`}
          >
            Statistics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Difficulty Breakdown */}
            <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-6">Problems Solved</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#71717A]">Easy</span>
                    <span className="text-sm font-bold text-white">{easy}</span>
                  </div>
                  <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C6FE1E]" style={{ width: `${allProblems.filter(p => p.difficulty === 'EASY').length ? (easy / allProblems.filter(p => p.difficulty === 'EASY').length) * 100 : 0}%` }} />
                  </div>
                  <div className="text-xs text-[#A1A1A1] mt-1">{easy}/{allProblems.filter(p => p.difficulty === 'EASY').length} solved</div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#71717A]">Medium</span>
                    <span className="text-sm font-bold text-white">{medium}</span>
                  </div>
                  <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FCD34D]" style={{ width: `${allProblems.filter(p => p.difficulty === 'MEDIUM').length ? (medium / allProblems.filter(p => p.difficulty === 'MEDIUM').length) * 100 : 0}%` }} />
                  </div>
                  <div className="text-xs text-[#A1A1A1] mt-1">{medium}/{allProblems.filter(p => p.difficulty === 'MEDIUM').length} solved</div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#71717A]">Hard</span>
                    <span className="text-sm font-bold text-white">{hard}</span>
                  </div>
                  <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#EF4444]" style={{ width: `${allProblems.filter(p => p.difficulty === 'HARD').length ? (hard / allProblems.filter(p => p.difficulty === 'HARD').length) * 100 : 0}%` }} />
                  </div>
                  <div className="text-xs text-[#A1A1A1] mt-1">{hard}/{allProblems.filter(p => p.difficulty === 'HARD').length} solved</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === "submissions" && (
          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-6">Recent Submissions</h3>
            <div className="space-y-3">
              {recentSubmissions.length === 0 ? (
                <div className="text-center text-[#71717A] py-4">No submissions yet</div>
              ) : recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-4 bg-[#111] border border-[#262626]/50 rounded-lg hover:border-[#262626] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white mb-2">{submission.problem?.title || submission.title || "-"}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          (submission.problem?.difficulty || submission.difficulty) === "EASY" ? "text-[#C6FE1E] bg-[#C6FE1E]/10 border-[#C6FE1E]/20" :
                          (submission.problem?.difficulty || submission.difficulty) === "MEDIUM" ? "text-[#FCD34D] bg-[#FCD34D]/10 border-[#FCD34D]/20" :
                          "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
                        }`}>
                          {submission.problem?.difficulty || submission.difficulty || "-"}
                        </span>
                        <span className={`text-xs font-semibold ${
                          (submission.status || submission.verdict) === "Accepted" ? "text-[#C6FE1E]" : "text-[#EF4444]"
                        }`}>
                          {submission.status || submission.verdict || "-"}
                        </span>
                        <span className="text-xs text-[#71717A]">{submission.executionTime ? `${submission.executionTime}ms` : (submission.runtime || "-")}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-xs text-[#71717A]">
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
          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-6">Detailed Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-[#71717A] mb-4 uppercase tracking-wider">Submission Stats</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#A1A1AA]">Total Submissions</span>
                    <span className="text-sm font-bold text-white">{recentSubmissions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#A1A1AA]">Acceptance Rate</span>
                    <span className="text-sm font-bold text-[#C6FE1E]">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#A1A1AA]">Average Runtime</span>
                    <span className="text-sm font-bold text-white">67ms</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#71717A] mb-4 uppercase tracking-wider">Activity</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#A1A1AA]">Problems This Week</span>
                    <span className="text-sm font-bold text-white">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#A1A1AA]">Problems This Month</span>
                    <span className="text-sm font-bold text-white">28</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#A1A1AA]">Most Active Day</span>
                    <span className="text-sm font-bold text-white">Monday</span>
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
