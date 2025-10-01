declare module 'webgazer' {
  interface WebGazerInstance {
    setRegression: (type: string) => WebGazerInstance;
    setTracker: (type: string) => WebGazerInstance;
    begin: () => Promise<void>;
    pause: () => WebGazerInstance;
    resume: () => WebGazerInstance;
    end: () => void;
    showVideoPreview: (show: boolean) => WebGazerInstance;
    showPredictionPoints: (show: boolean) => WebGazerInstance;
    setGazeListener: (
      callback: (
        data: { x: number; y: number } | null,
        timestamp: number
      ) => void
    ) => WebGazerInstance;
    clearGazeListener: () => WebGazerInstance;
  }

  const webgazer: WebGazerInstance;
  export default webgazer;
}