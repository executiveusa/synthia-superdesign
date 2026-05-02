/**
 * Synthia™ muapi.ai Unified Media Client
 *
 * Unified access to 200+ image, video, and cinema generation models.
 * Polling-based async pattern for long-running media generation.
 *
 * Docs: https://muapi.ai/docs
 */

import { WHITELABEL } from './identity';

export interface ImageGenerationRequest {
  prompt: string;
  model?: string;  // Default: flux-pro
  size?: '1024x1024' | '1024x768' | '768x1024' | string;
  style?: string;
  negative_prompt?: string;
}

export interface VideoGenerationRequest {
  prompt: string;
  model?: string;  // Default: runway-ml-gen3
  duration?: number;  // Seconds (1–60)
  frames?: number;
  fps?: number;
}

export interface CinemaGenerationRequest {
  prompt: string;
  duration?: number;
  camera_movement?: 'pan' | 'zoom' | 'dolly' | 'tracking' | 'orbiting';
  lighting_mood?: 'cinematic' | 'moody' | 'bright' | 'neon' | 'natural';
  depth?: 'shallow' | 'medium' | 'deep';
  aspect_ratio?: '16:9' | '9:16' | '4:3' | '1:1';
}

export interface LipSyncRequest {
  video_url: string;
  audio_url: string;
  model?: string;  // Default: d-id-express
}

export interface GenerationResponse {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result_url?: string;
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface BalanceResponse {
  credits: number;
  used: number;
  remaining: number;
  reset_date?: string;
}

const MAX_ATTEMPTS = 900;  // 30 minutes at 2-second intervals
const POLL_INTERVAL = 2000;  // 2 seconds
const MUAPI_BASE_URL = 'https://api.muapi.ai/v1';

export class SynthiaMediaClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || WHITELABEL.muapi_api_key;
    this.baseUrl = MUAPI_BASE_URL;

    if (!this.apiKey) {
      throw new Error(
        'muapi.ai API key not found. Set MUAPI_API_KEY in environment or pass to constructor.'
      );
    }
  }

  /**
   * Generate an image from a text prompt
   * Returns immediately with job ID; poll with checkStatus()
   */
  async generateImage(request: ImageGenerationRequest): Promise<GenerationResponse> {
    const payload = {
      prompt: request.prompt,
      model: request.model || 'flux-pro',
      size: request.size || '1024x1024',
      style: request.style || 'photorealistic',
      negative_prompt: request.negative_prompt || '',
    };

    return this.submitJob('/images/generate', payload);
  }

  /**
   * Generate a video from a text prompt
   * Returns immediately with job ID; poll with checkStatus()
   */
  async generateVideo(request: VideoGenerationRequest): Promise<GenerationResponse> {
    const payload = {
      prompt: request.prompt,
      model: request.model || 'runway-ml-gen3',
      duration: Math.min(request.duration || 10, 60),
      frames: request.frames || 240,
      fps: request.fps || 24,
    };

    return this.submitJob('/videos/generate', payload);
  }

  /**
   * Generate cinematic video with advanced controls
   * Combines camera movement, lighting, and composition
   */
  async generateCinema(request: CinemaGenerationRequest): Promise<GenerationResponse> {
    const cameraMap: Record<string, string> = {
      pan: 'horizontal-pan',
      zoom: 'zoom-in',
      dolly: 'dolly-in',
      tracking: 'tracking-shot',
      orbiting: 'orbital-rotation',
    };

    const apertureMap: Record<string, string> = {
      shallow: 'f-1.4',
      medium: 'f-5.6',
      deep: 'f-16',
    };

    const payload = {
      prompt: request.prompt,
      model: 'synthia-cinema-pro',
      duration: Math.min(request.duration || 15, 60),
      camera: {
        movement: cameraMap[request.camera_movement || 'pan'],
        speed: 'moderate',
      },
      lighting: {
        mood: request.lighting_mood || 'cinematic',
        intensity: 0.8,
      },
      depth: {
        aperture: apertureMap[request.depth || 'medium'],
        focus_distance: 'mid',
      },
      aspect_ratio: request.aspect_ratio || '16:9',
    };

    return this.submitJob('/videos/cinema', payload);
  }

  /**
   * Generate marketing/promotional video
   */
  async generateMarketingAd(prompt: string, duration: number = 15): Promise<GenerationResponse> {
    const payload = {
      prompt,
      model: 'haiper-v1',
      duration: Math.min(duration, 30),
      style: 'marketing',
      aspect_ratio: '16:9',
    };

    return this.submitJob('/videos/marketing', payload);
  }

  /**
   * Synchronize audio to video (lip-sync)
   */
  async lipSync(request: LipSyncRequest): Promise<GenerationResponse> {
    const payload = {
      video_url: request.video_url,
      audio_url: request.audio_url,
      model: request.model || 'd-id-express',
    };

    return this.submitJob('/video/lip-sync', payload);
  }

  /**
   * Poll a job until completion or failure
   * Implements exponential backoff for efficiency
   */
  async waitForCompletion(
    jobId: string,
    onProgress?: (status: GenerationResponse) => void
  ): Promise<GenerationResponse> {
    let attempt = 0;
    let lastLogTime = Date.now();

    while (attempt < MAX_ATTEMPTS) {
      try {
        const status = await this.checkStatus(jobId);

        // Log progress every 10 seconds
        if (Date.now() - lastLogTime > 10000) {
          console.log(
            `[Synthia Media] Job ${jobId.slice(0, 8)}... progress: ${status.progress || 0}%`
          );
          lastLogTime = Date.now();
        }

        if (onProgress) {
          onProgress(status);
        }

        if (status.status === 'completed' || status.status === 'failed') {
          return status;
        }

        // Wait before polling again
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        attempt++;
      } catch (error) {
        console.error(`[Synthia Media] Error checking job status:`, error);
        throw error;
      }
    }

    throw new Error(
      `Job ${jobId} exceeded maximum poll attempts (${MAX_ATTEMPTS}). Likely abandoned.`
    );
  }

  /**
   * Check the status of a generation job
   */
  async checkStatus(jobId: string): Promise<GenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`muapi API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`[Synthia Media] Failed to check job status:`, error);
      throw error;
    }
  }

  /**
   * Get current account balance and usage
   */
  async getBalance(): Promise<BalanceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/account/balance`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`muapi API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`[Synthia Media] Failed to get balance:`, error);
      throw error;
    }
  }

  /**
   * Submit a job to muapi and return immediately with job ID
   * Private helper method
   */
  private async submitJob(endpoint: string, payload: Record<string, any>): Promise<GenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`muapi API error: ${response.status} ${error}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`[Synthia Media] Failed to submit job to ${endpoint}:`, error);
      throw error;
    }
  }
}

/**
 * Singleton instance for global use
 */
let mediaClient: SynthiaMediaClient | null = null;

export function getMediaClient(): SynthiaMediaClient {
  if (!mediaClient) {
    mediaClient = new SynthiaMediaClient();
  }
  return mediaClient;
}

/**
 * Reset singleton (useful for testing)
 */
export function resetMediaClient(): void {
  mediaClient = null;
}
