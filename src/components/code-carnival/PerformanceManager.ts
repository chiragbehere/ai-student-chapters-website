// PerformanceManager.ts
// Detects GPU capability, device memory, mobile status, and user motion preferences

export type PerformanceTier = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PerformanceSettings {
  tier: PerformanceTier;
  particleCount: number;
  portalSegments: number;
  enablePostProcessing: boolean;
  enableShaders: boolean;
  enableAudio: boolean;
  reducedMotion: boolean;
  isMobile: boolean;
}

export function detectPerformance(): PerformanceSettings {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) {
    return {
      tier: 'MEDIUM',
      particleCount: 200,
      portalSegments: 32,
      enablePostProcessing: false,
      enableShaders: true,
      enableAudio: true,
      reducedMotion: false,
      isMobile: false,
    };
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;

  // Check hardware concurrency & device memory
  const concurrency = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4;

  // Check WebGL support & GPU renderer
  let hasWebGL = false;
  let isLowPowerGPU = false;

  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (gl) {
      hasWebGL = true;
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        if (/SwiftShader|Mali-4|Adreno 3|PowerVR/i.test(renderer)) {
          isLowPowerGPU = true;
        }
      }
    }
  } catch {
    hasWebGL = false;
  }

  let tier: PerformanceTier = 'HIGH';

  if (!hasWebGL || reducedMotion || isLowPowerGPU || memory < 2 || concurrency < 2) {
    tier = 'LOW';
  } else if (isMobile || memory < 4 || concurrency < 4) {
    tier = 'MEDIUM';
  }

  const settingsMap: Record<PerformanceTier, Omit<PerformanceSettings, 'tier' | 'reducedMotion' | 'isMobile'>> = {
    HIGH: {
      particleCount: 500,
      portalSegments: 64,
      enablePostProcessing: true,
      enableShaders: true,
      enableAudio: true,
    },
    MEDIUM: {
      particleCount: 220,
      portalSegments: 36,
      enablePostProcessing: false,
      enableShaders: true,
      enableAudio: true,
    },
    LOW: {
      particleCount: 60,
      portalSegments: 20,
      enablePostProcessing: false,
      enableShaders: false,
      enableAudio: true,
    },
  };

  return {
    tier,
    reducedMotion,
    isMobile,
    ...settingsMap[tier],
  };
}
