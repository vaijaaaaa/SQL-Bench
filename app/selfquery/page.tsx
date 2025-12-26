'use client';

import ProblemList from '@/components/ProblemList';

export default function SelfQueryPage() {
  return (
    <ProblemList
      title="Self Query"
      description="Advanced self-join patterns and recursive queries"
      category="Self Join"
      backLink="/dashboard"
    />
  );
}
