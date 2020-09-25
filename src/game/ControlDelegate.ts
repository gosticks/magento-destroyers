interface ControlDelegate {
  onGameOver?: (reason: string) => void;
  onComplete?: () => void;
  onPaused?: () => void;
  onResumed?: () => void;
  onEvent?: (event: Event) => void;
  onScoreChanged: (value: number) => void;
}

export default ControlDelegate;
