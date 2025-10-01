'use client';

import { Game } from '@/components/game/Game';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function Home() {
  return (
    <ErrorBoundary>
      <Game />
    </ErrorBoundary>
  );
}