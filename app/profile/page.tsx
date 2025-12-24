"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Trophy, Flame, Calendar, CheckCircle2, Clock, Code2, Award, TrendingUp, Target, Zap } from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "submissions" | "stats">("overview");

  // Mock user data
  const userData = {
    name: "John Doe",
    username: "johndoe",
    joinDate: "Jan 2024",
    totalSolved: 28,
    totalProblems: 180,
    streak: 7,
    longestStreak: 15,
    xp: 1250,
    rank: "#1,234",
    easy: 15,
    medium: 10,
    hard: 3
  };

  const recentSubmissions = [
    { id: 1, title: "Customers Who Never Order", difficulty: "EASY", status: "Accepted", time: "2 hours ago", runtime: "45ms" },
    { id: 2, title: "Window Functions Basics", difficulty: "MEDIUM", status: "Accepted", time: "5 hours ago", runtime: "78ms" },
    { id: 3, title: "Inner Join Basics", difficulty: "EASY", status: "Wrong Answer", time: "1 day ago", runtime: "-" },
    { id: 4, title: "Recursive CTE", difficulty: "HARD", status: "Accepted", time: "2 days ago", runtime: "123ms" },
    { id: 5, title: "Self Join Basics", difficulty: "MEDIUM", status: "Accepted", time: "3 days ago", runtime: "56ms" },
  ];

  const achievements = [
    { id: 1, title: "First Blood", description: "Solve your first problem", icon: Trophy, unlocked: true },
    { id: 2, title: "Speed Demon", description: "Solve 5 problems in one day", icon: Zap, unlocked: true },
    { id: 3, title: "Week Warrior", description: "7 day streak", icon: Flame, unlocked: true },
    { id: 4, title: "SQL Master", description: "Solve 50 problems", icon: Award, unlocked: false },
  ];

  const completionPercentage = Math.round((userData.totalSolved / userData.totalProblems) * 100);

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
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{userData.name}</h1>
                <p className="text-[#71717A] mb-3">@{userData.username}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-[#71717A]" />
                    <span className="text-[#A1A1AA]">Joined {userData.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#C6FE1E]/10 border border-[#C6FE1E]/20 rounded-lg">
                    <Trophy size={14} className="text-[#C6FE1E]" />
                    <span className="text-xs font-bold text-[#C6FE1E]">{userData.xp} XP</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-[#71717A] text-sm mb-1">Global Rank</div>
              <div className="text-2xl font-bold text-white">{userData.rank}</div>
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
            <div className="text-3xl font-bold text-white">{userData.totalSolved}</div>
            <div className="text-xs text-[#71717A] mt-1">of {userData.totalProblems} problems</div>
          </div>

          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Flame size={20} className="text-orange-500" />
              <span className="text-[#71717A] text-sm">Streak</span>
            </div>
            <div className="text-3xl font-bold text-white">{userData.streak}</div>
            <div className="text-xs text-[#71717A] mt-1">days current</div>
          </div>

          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Target size={20} className="text-blue-500" />
              <span className="text-[#71717A] text-sm">Best Streak</span>
            </div>
            <div className="text-3xl font-bold text-white">{userData.longestStreak}</div>
            <div className="text-xs text-[#71717A] mt-1">days max</div>
          </div>

          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={20} className="text-purple-500" />
              <span className="text-[#71717A] text-sm">Progress</span>
            </div>
            <div className="text-3xl font-bold text-white">{completionPercentage}%</div>
            <div className="text-xs text-[#71717A] mt-1">completion rate</div>
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
                    <span className="text-sm font-bold text-white">{userData.easy}</span>
                  </div>
                  <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C6FE1E]" style={{ width: `${(userData.easy / 50) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#71717A]">Medium</span>
                    <span className="text-sm font-bold text-white">{userData.medium}</span>
                  </div>
                  <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FCD34D]" style={{ width: `${(userData.medium / 75) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#71717A]">Hard</span>
                    <span className="text-sm font-bold text-white">{userData.hard}</span>
                  </div>
                  <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#EF4444]" style={{ width: `${(userData.hard / 55) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-6">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${
                        achievement.unlocked
                          ? "bg-[#C6FE1E]/5 border-[#C6FE1E]/20"
                          : "bg-[#111] border-[#262626]/50 opacity-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          achievement.unlocked ? "bg-[#C6FE1E] text-black" : "bg-[#262626] text-[#71717A]"
                        }`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white mb-1">{achievement.title}</h4>
                          <p className="text-xs text-[#71717A]">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "submissions" && (
          <div className="p-6 bg-[#0A0A0A] border border-[#262626]/50 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-6">Recent Submissions</h3>
            <div className="space-y-3">
              {recentSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-4 bg-[#111] border border-[#262626]/50 rounded-lg hover:border-[#262626] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white mb-2">{submission.title}</h4>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          submission.difficulty === "EASY" ? "text-[#C6FE1E] bg-[#C6FE1E]/10 border-[#C6FE1E]/20" :
                          submission.difficulty === "MEDIUM" ? "text-[#FCD34D] bg-[#FCD34D]/10 border-[#FCD34D]/20" :
                          "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
                        }`}>
                          {submission.difficulty}
                        </span>
                        <span className={`text-xs font-semibold ${
                          submission.status === "Accepted" ? "text-[#C6FE1E]" : "text-[#EF4444]"
                        }`}>
                          {submission.status}
                        </span>
                        <span className="text-xs text-[#71717A]">{submission.runtime}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-xs text-[#71717A]">
                        <Clock size={12} />
                        {submission.time}
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
                    <span className="text-sm font-bold text-white">42</span>
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
