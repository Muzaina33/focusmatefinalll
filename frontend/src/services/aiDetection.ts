// Simple client-side AI detection using face-api.js or MediaPipe
// For MVP, we'll simulate AI detection based on video analysis

export class AIDetectionService {
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private isRunning: boolean = false;
  private detectionInterval: number | null = null;

  initialize(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  startDetection(onUpdate: (data: { score: number; status: string; frame?: string }) => void) {
    if (!this.videoElement || !this.canvas || !this.ctx) return;

    this.isRunning = true;
    
    // Run detection every 2 seconds
    this.detectionInterval = window.setInterval(() => {
      if (!this.isRunning || !this.videoElement || !this.canvas || !this.ctx) return;

      try {
        // Set canvas size to match video
        this.canvas.width = this.videoElement.videoWidth;
        this.canvas.height = this.videoElement.videoHeight;

        // Draw current video frame to canvas
        this.ctx.drawImage(this.videoElement, 0, 0);

        // Get image data for analysis
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        // Simple brightness-based attention detection (MVP)
        const brightness = this.calculateBrightness(imageData);
        const faceDetected = brightness > 30; // Simple threshold

        // Calculate attention score (0-100)
        let attentionScore = 0;
        let status = 'Absent';

        if (faceDetected) {
          // Simulate attention based on brightness and variance
          attentionScore = Math.min(100, Math.max(0, brightness + Math.random() * 20));
          
          if (attentionScore > 70) status = 'Engaged';
          else if (attentionScore > 50) status = 'Present';
          else if (attentionScore > 30) status = 'Looking Away';
          else status = 'Drowsy';
        }

        // Get frame as base64 for teacher to see
        const frame = this.canvas.toDataURL('image/jpeg', 0.5);

        onUpdate({
          score: Math.round(attentionScore),
          status,
          frame
        });
      } catch (error) {
        console.error('Detection error:', error);
      }
    }, 2000); // Every 2 seconds
  }

  stopDetection() {
    this.isRunning = false;
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval);
      this.detectionInterval = null;
    }
  }

  private calculateBrightness(imageData: ImageData): number {
    const data = imageData.data;
    let sum = 0;
    
    // Sample every 10th pixel for performance
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      sum += (r + g + b) / 3;
    }
    
    return sum / (data.length / 40);
  }

  cleanup() {
    this.stopDetection();
    this.videoElement = null;
    this.canvas = null;
    this.ctx = null;
  }
}

export const aiDetectionService = new AIDetectionService();
