// Effects.jsx
// Post-processing pipeline: Bloom (strength ~0.8, threshold ~0.65), subtle vignette, tone mapping
// Switchable off for low-power devices and mobile
import React, { Component } from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

class EffectsErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn('PostProcessing unavailable on this device, disabling bloom:', error);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function Effects({ enabled = true, bloomStrength = 0.8, bloomThreshold = 0.65 }) {
  if (!enabled) return null;

  return (
    <EffectsErrorBoundary>
      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom
          intensity={bloomStrength}
          luminanceThreshold={bloomThreshold}
          luminanceSmoothing={0.35}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.12} darkness={0.85} />
      </EffectComposer>
    </EffectsErrorBoundary>
  );
}

export default Effects;

