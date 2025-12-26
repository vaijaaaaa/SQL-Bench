'use client';

import ProblemList from '@/components/ProblemList';

export default function JoinsPage() {
  return (
    <ProblemList
      title="Joins"
      description="Master INNER, LEFT, RIGHT, FULL joins and complex relationships"
      category="Inner Join"
      backLink="/dashboard"
    />
  );
}
