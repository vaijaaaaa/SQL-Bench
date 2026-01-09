"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Trophy, Medal, Award, TrendingUp, Clock, CheckCircle2, Target, ArrowLeft } from "lucide-react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LeaderboardUser {
  rank: number;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  solvedCount: number;
  totalSubmissions: number;
  successfulSubmissions: number;
  successRate: string;
  avgExecutionTime: number;
  score: number;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        const response = await fetch(`/api/leaderboard?limit=50&timeframe=${timeframe}`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [timeframe]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    if (rank === 2) return "bg-gray-400/10 text-gray-400 border-gray-400/20";
    if (rank === 3) return "bg-amber-600/10 text-amber-600 border-amber-600/20";
    return "bg-primary/10 text-primary border-primary/20";
  };

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
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Leaderboard</h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Top performers ranked by problems solved and overall performance. Compete with the best SQL practitioners.
          </p>

          {/* Timeframe Filter */}
          <div className="flex gap-2 mt-6">
            {(['all', 'month', 'week'] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={timeframe === tf ? "bg-primary text-primary-foreground" : ""}
              >
                {tf === 'all' ? 'All Time' : tf === 'month' ? 'This Month' : 'This Week'}
              </Button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-lg text-muted-foreground animate-pulse">Loading leaderboard...</span>
          </div>
        ) : leaderboard.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Rankings Yet</h3>
            <p className="text-muted-foreground">Be the first to solve problems and claim the top spot!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`p-6 transition-all hover:shadow-lg hover:border-primary/50 ${
                    entry.rank <= 3 ? 'border-2' : ''
                  } ${
                    entry.rank === 1
                      ? 'border-yellow-500/50 bg-yellow-500/5'
                      : entry.rank === 2
                      ? 'border-gray-400/50 bg-gray-400/5'
                      : entry.rank === 3
                      ? 'border-amber-600/50 bg-amber-600/5'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-6">
                    {/* Rank */}
                    <div className="flex-shrink-0 w-16 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {entry.user.image ? (
                          <img
                            src={entry.user.image}
                            alt={entry.user.name || 'User'}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {(entry.user.name || entry.user.email)[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {entry.user.name || entry.user.email.split('@')[0]}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{entry.user.email}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-primary font-bold text-xl">
                          <CheckCircle2 className="w-5 h-5" />
                          {entry.solvedCount}
                        </div>
                        <div className="text-xs text-muted-foreground">Solved</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 font-semibold text-lg">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          {entry.successRate}%
                        </div>
                        <div className="text-xs text-muted-foreground">Success</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 font-semibold text-lg">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          {entry.avgExecutionTime}ms
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Time</div>
                      </div>
                    </div>

                    {/* Score Badge */}
                    <Badge className={`${getRankBadgeColor(entry.rank)} px-4 py-2 text-sm font-bold`}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {entry.score.toLocaleString()}
                    </Badge>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-primary font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        {entry.solvedCount}
                      </div>
                      <div className="text-xs text-muted-foreground">Solved</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 font-semibold">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        {entry.successRate}%
                      </div>
                      <div className="text-xs text-muted-foreground">Success</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 font-semibold">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {entry.avgExecutionTime}ms
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Time</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Card className="p-8 bg-primary/5 border-primary/20">
              <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Ready to Compete?</h3>
              <p className="text-muted-foreground mb-6">
                Start solving problems and climb your way to the top!
              </p>
              <Link href="/sql50">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Start Solving Problems
                </Button>
              </Link>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
