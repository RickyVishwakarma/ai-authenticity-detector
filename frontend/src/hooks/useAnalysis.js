import { useState, useCallback } from "react";
import { analyzeText, analyzeImage, analyzeVideo } from "../utils/api";

export function useAnalysis() {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const simulateProgress = useCallback(() => {
    const steps = [10, 25, 40, 55, 70, 82, 90, 95];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300);
    return interval;
  }, []);

  const runTextAnalysis = useCallback(async (text) => {
    setAnalyzing(true);
    setResult(null);
    setError(null);
    setProgress(0);
    const progressInterval = simulateProgress();
    try {
      const data = await analyzeText(text);
      setProgress(100);
      setTimeout(() => setResult(data), 200);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(progressInterval);
      setAnalyzing(false);
    }
  }, [simulateProgress]);

  const runImageAnalysis = useCallback(async (file) => {
    setAnalyzing(true);
    setResult(null);
    setError(null);
    setProgress(0);
    const progressInterval = simulateProgress();
    try {
      const data = await analyzeImage(file);
      setProgress(100);
      setTimeout(() => setResult(data), 200);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(progressInterval);
      setAnalyzing(false);
    }
  }, [simulateProgress]);

  const runVideoAnalysis = useCallback(async (file) => {
    setAnalyzing(true);
    setResult(null);
    setError(null);
    setProgress(0);
    const progressInterval = simulateProgress();
    try {
      const data = await analyzeVideo(file);
      setProgress(100);
      setTimeout(() => setResult(data), 200);
    } catch (err) {
      setError(err.message);
    } finally {
      clearInterval(progressInterval);
      setAnalyzing(false);
    }
  }, [simulateProgress]);

  const reset = useCallback(() => {
    setAnalyzing(false);
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  return {
    analyzing, progress, result, error,
    runTextAnalysis, runImageAnalysis, runVideoAnalysis, reset,
  };
}