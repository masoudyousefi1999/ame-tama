// Performance monitoring utility for mobile optimization

export interface PerformanceMetrics {
  fps: number;
  memoryUsage?: number;
  loadTime: number;
  renderTime: number;
}

class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fpsHistory: number[] = [];
  private maxHistoryLength = 60; // Keep last 60 frames

  startMonitoring() {
    if (typeof window === "undefined") return;

    // Monitor FPS
    const measureFPS = () => {
      this.frameCount++;
      const currentTime = performance.now();

      if (currentTime - this.lastTime >= 1000) {
        const fps = Math.round(
          (this.frameCount * 1000) / (currentTime - this.lastTime)
        );
        this.fpsHistory.push(fps);

        // Keep only last 60 measurements
        if (this.fpsHistory.length > this.maxHistoryLength) {
          this.fpsHistory.shift();
        }

        // Log performance issues
        if (fps < 30) {
          console.warn(`Low FPS detected: ${fps}`, {
            averageFPS: this.getAverageFPS(),
            memoryUsage: this.getMemoryUsage(),
          });
        }

        this.frameCount = 0;
        this.lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    return Math.round(
      this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length
    );
  }

  getMemoryUsage(): number | undefined {
    if (typeof (performance as any).memory !== "undefined") {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return undefined;
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return {
      fps: this.getAverageFPS(),
      memoryUsage: this.getMemoryUsage(),
      loadTime: performance.now(),
      renderTime: performance.now(),
    };
  }

  // Optimize for mobile devices
  optimizeForMobile() {
    if (typeof window === "undefined") return;

    // Reduce animation frame rate on mobile
    if (window.innerWidth < 768) {
      // Limit animation frame rate to 30fps on mobile
      const originalRequestAnimationFrame = window.requestAnimationFrame;
      let lastCall = 0;

      window.requestAnimationFrame = (callback) => {
        const now = performance.now();
        if (now - lastCall >= 33) {
          // ~30fps
          lastCall = now;
          return originalRequestAnimationFrame(callback);
        }
        return originalRequestAnimationFrame(() => {});
      };
    }
  }

  // Detect performance issues
  detectPerformanceIssues(): string[] {
    const issues: string[] = [];

    const avgFPS = this.getAverageFPS();
    if (avgFPS < 30) {
      issues.push(`Low average FPS: ${avgFPS}`);
    }

    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage && memoryUsage > 100) {
      // More than 100MB
      issues.push(`High memory usage: ${memoryUsage.toFixed(2)}MB`);
    }

    return issues;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring in development
if (process.env.NODE_ENV === "development") {
  performanceMonitor.startMonitoring();
}

// Export utility functions
export const getPerformanceMetrics = () =>
  performanceMonitor.getPerformanceMetrics();
export const detectPerformanceIssues = () =>
  performanceMonitor.detectPerformanceIssues();
export const optimizeForMobile = () => performanceMonitor.optimizeForMobile();
