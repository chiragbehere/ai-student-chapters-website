// codecarnival-animations.js
// Procedural animation helpers for the Code Carnival asset pack. Framework-agnostic ES module:
// pass the THREE namespace in (works with three.js and React Three Fiber). No dependencies.
export const PARAMS = {
  portalPulse:   { speed: 1.6, amount: 0.07, lightBase: 40, lightJitter: 0.25, swirlSpeed: 0.12 },
  lightning:     { minGap: 2.5, maxGap: 9.0, pattern: [[0.05, 1.0], [0.06, 0.1], [0.09, 0.9], [0.30, 0.0]] },
  float:         { defaultAmp: 0.2, defaultSpeed: 0.35 },
  particles:     { swirl: { speed: 0.35 }, rise: { speed: 0.5, range: 12 }, drift: { amp: 1.6, speed: 0.08 } },
};

/** Play every glTF clip on a loaded model (vine sway, ring spin, ribbon spin, branch sway, portal pulse).
 *  Returns the mixer: call mixer.update(delta) each frame. Clips are phase-offset so nothing moves in lock-step. */
export function playClips(THREE, gltf, root = gltf.scene, timeScale = 1) {
  const mixer = new THREE.AnimationMixer(root);
  if (!gltf.animations || !gltf.animations.length) return mixer;

  gltf.animations.forEach((clip, i) => {
    const a = mixer.clipAction(clip);
    a.setLoop(THREE.LoopRepeat, Infinity);
    a.timeScale = timeScale;
    a.time = (i * 0.37) % Math.max(clip.duration, 0.001);
    a.play();
  });
  return mixer;
}

/** Points material for the *_particles / fog GLBs. Reads the custom attributes _SIZE (metres) and _PHASE.
 *  mode: 'swirl' (portal energy) | 'rise' (embers, ash) | 'drift' (fog, dust, spores)
 *  Update `material.uniforms.uTime.value` every frame and call setPointScale() on resize. */
export function makeParticleMaterial(THREE, { map, color = 0xffffff, size = 1, mode = 'drift', additive = true, opacity = 1 } = {}) {
  const motion = {
    swirl: `float r = length(p.xy); float a = uTime * ${PARAMS.particles.swirl.speed} / (0.6 + r * 0.25) + _phase;
            float c = cos(a), s = sin(a); p.xy = mat2(c, -s, s, c) * p.xy; p.z += sin(uTime * 0.7 + _phase * 3.0) * 0.4;`,
    rise:  `p.y = mod(p.y + uTime * ${PARAMS.particles.rise.speed} * (0.6 + 0.4 * sin(_phase * 5.0)), ${PARAMS.particles.rise.range.toFixed(1)});
            p.x += sin(uTime * 0.6 + _phase * 4.0) * 0.5;`,
    drift: `p.x += sin(uTime * ${PARAMS.particles.drift.speed} + _phase * 5.0) * ${PARAMS.particles.drift.amp};
            p.z += cos(uTime * ${PARAMS.particles.drift.speed} * 0.8 + _phase * 3.0) * ${PARAMS.particles.drift.amp};
            p.y += sin(uTime * 0.2 + _phase * 7.0) * 0.3;`,
  }[mode] || '';

  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMap: { value: map || null },
      uColor: { value: new THREE.Color(color) },
      uSize: { value: size },
      uScale: { value: 400 },
      uOpacity: { value: opacity },
    },
    vertexShader: `
      uniform float uTime, uSize, uScale;
      attribute float _size;
      attribute float _phase;
      varying vec4 vCol;
      varying float vFlick;
      void main() {
        vec3 p = position;
        ${motion}
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        float ptSize = _size > 0.0 ? _size : 0.8;
        gl_PointSize = max(1.0, ptSize * uSize * uScale / max(0.1, -mv.z));
        gl_Position = projectionMatrix * mv;
        vCol = color;
        vFlick = 0.8 + 0.2 * sin(uTime * 2.0 + _phase * 6.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform vec3 uColor;
      uniform float uOpacity;
      varying vec4 vCol;
      varying float vFlick;
      void main() {
        vec4 t = texture2D(uMap, gl_PointCoord);
        float a = t.a * vCol.a * uOpacity * vFlick;
        if (a < 0.01) discard;
        gl_FragColor = vec4(t.rgb * vCol.rgb * uColor, a);
      }
    `,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

/** world-units -> pixels factor for gl_PointSize */
export function setPointScale(material, rendererHeightPx, fovDegrees) {
  if (material && material.uniforms && material.uniforms.uScale) {
    material.uniforms.uScale.value = rendererHeightPx / (2 * Math.tan((fovDegrees * Math.PI) / 360));
  }
}

/** Pulse the portal halo + light and slowly rotate the swirl texture (the rift outline stays fixed). */
export class PortalPulse {
  constructor({ halo, surfaceMaterial, light } = {}) {
    this.halo = halo;
    this.mat = surfaceMaterial;
    this.light = light;
    this.t = 0;
  }
  update(dt) {
    const P = PARAMS.portalPulse;
    this.t += dt;
    const s = 1 + P.amount * Math.sin(this.t * P.speed) + 0.02 * Math.sin(this.t * 7.3);
    if (this.halo) this.halo.scale.set(s, s, 1);
    if (this.light) {
      this.light.intensity = P.lightBase * (1 + P.lightJitter * Math.sin(this.t * 2.1) * Math.sin(this.t * 5.7 + 1));
    }
    const tex = this.mat && this.mat.emissiveMap;
    if (tex) {
      tex.center.set(0.5, 0.5);
      tex.rotation = this.t * P.swirlSpeed;
    }
  }
}

/** Random lightning: shows one of the bolt nodes, flickers a light and a full-screen overlay */
export class LightningController {
  constructor({ bolts = [], light = null, overlay = null, onFlash = null, rng = Math.random } = {}) {
    Object.assign(this, { bolts, light, overlay, onFlash, rng });
    this.bolts.forEach((b) => (b.visible = false));
    this.wait = 1 + rng() * 3;
    this.step = -1;
    this.stepT = 0;
    this.active = null;
    this.lastFlashIndex = 1;
  }
  trigger() {
    if (this.step >= 0) return;
    if (this.bolts.length > 0) {
      const idx = Math.floor(this.rng() * this.bolts.length);
      this.active = this.bolts[idx] || null;
      this.lastFlashIndex = (idx % 3) + 1;
    }
    this.step = 0;
    this.stepT = 0;
    if (this.onFlash) this.onFlash(this.active, this.lastFlashIndex);
  }
  _apply(v) {
    if (this.active) this.active.visible = v > 0.05;
    if (this.light) this.light.intensity = v * 60;
    if (this.overlay) {
      const o = v * 0.55;
      if (this.overlay.style) this.overlay.style.opacity = o;
      else if (this.overlay.material) this.overlay.material.opacity = o;
    }
  }
  update(dt) {
    const P = PARAMS.lightning;
    if (this.step < 0) {
      this.wait -= dt;
      if (this.wait <= 0) this.trigger();
      return;
    }
    this.stepT += dt;
    const [dur, level] = P.pattern[this.step];
    this._apply(level);
    if (this.stepT >= dur) {
      this.step += 1;
      this.stepT = 0;
      if (this.step >= P.pattern.length) {
        this._apply(0);
        this.step = -1;
        this.active = null;
        this.wait = P.minGap + this.rng() * (P.maxGap - P.minGap);
      }
    }
  }
}

/** Bob / spin every node that carries userData.floatAmp / floatSpeed / spin (debris, floating rocks). */
export class FloatingProps {
  constructor(root) {
    this.items = [];
    if (!root) return;
    root.traverse((n) => {
      const u = n.userData || {};
      if (u.floatAmp !== undefined || u.spin) {
        this.items.push({
          n,
          y0: n.position.y,
          amp: u.floatAmp ?? PARAMS.float.defaultAmp,
          sp: u.floatSpeed ?? PARAMS.float.defaultSpeed,
          spin: u.spin || [0, 0, 0],
          ph: Math.random() * 6.28,
        });
      }
    });
    this.t = 0;
  }
  update(dt) {
    this.t += dt;
    for (const it of this.items) {
      it.n.position.y = it.y0 + it.amp * Math.sin(this.t * it.sp * 6.2832 + it.ph);
      it.n.rotation.x += it.spin[0] * dt;
      it.n.rotation.y += it.spin[1] * dt;
      it.n.rotation.z += it.spin[2] * dt;
    }
  }
}

/** Flicker for nodes flagged userData.flicker (lamp bulb, wire sparks). Optional `light` follows the node. */
export function flicker(nodes, t, lights = []) {
  if (!nodes || !nodes.length) return;
  nodes.forEach((n, i) => {
    const v = 0.6 + 0.4 * Math.sin(t * 17 + i * 3.1) * Math.sin(t * 5.3 + i) + (Math.random() < 0.02 ? -0.5 : 0);
    n.scale.setScalar(Math.max(0.3, v));
    if (lights[i]) {
      lights[i].intensity =
        (lights[i].userData.base ?? (lights[i].userData.base = lights[i].intensity)) * Math.max(0.2, v);
    }
  });
}

/** Audio engine: plays ambient loops and oneshots with .ogg (fast load) and .wav fallback. */
export class AudioManager {
  constructor(baseUrl = '/CodeCarnival_3D_Assets/audio/') {
    this.base = baseUrl;
    this.enabled = false;
    this.unlocked = false;
    this.loops = {};
    this.volume = 0.75;
    this.onStateChange = null;

    // Check OGG support for faster decoding & low latency
    const testAudio = typeof Audio !== 'undefined' ? new Audio() : null;
    const canOgg = testAudio && !!testAudio.canPlayType('audio/ogg; codecs="vorbis"');
    const ext = canOgg ? '.ogg' : '.wav';

    this.files = {
      forest: `ambient_forest${ext}`,
      drone: `dark_drone${ext}`,
      wind: `wind_ambience${ext}`,
    };
    this.shots = {
      crackle: `electric_crackle${ext}`,
      open: `portal_open${ext}`,
      transition: `portal_transition${ext}`,
      impact: `cinematic_impact${ext}`,
    };
  }

  attach(target = typeof window !== 'undefined' ? window : null) {
    if (!target) return;
    const unlock = () => {
      this.unlocked = true;
      try {
        const saved = localStorage.getItem('codecarnival_audio_enabled');
        if (saved !== 'false') {
          this.enable();
        }
      } catch {
        this.enable();
      }
      ['pointerdown', 'keydown', 'touchstart'].forEach((e) => target.removeEventListener(e, unlock));
    };
    ['pointerdown', 'keydown', 'touchstart'].forEach((e) => target.addEventListener(e, unlock, { once: false }));
  }

  _audio(file, loop) {
    const a = new Audio(this.base + file);
    a.loop = loop;
    a.volume = 0;
    a.preload = 'auto';
    return a;
  }

  enable() {
    this.unlocked = true;
    this.enabled = true;
    try {
      localStorage.setItem('codecarnival_audio_enabled', 'true');
    } catch {}

    for (const [k, f] of Object.entries(this.files)) {
      if (!this.loops[k]) this.loops[k] = this._audio(f, true);
      const playPromise = this.loops[k].play();
      if (playPromise) {
        playPromise
          .then(() => {
            this._fade(this.loops[k], k === 'drone' ? this.volume * 0.8 : this.volume * 0.5);
          })
          .catch(() => {});
      }
    }
    if (this.onStateChange) this.onStateChange(true);
    return true;
  }

  disable() {
    this.enabled = false;
    try {
      localStorage.setItem('codecarnival_audio_enabled', 'false');
    } catch {}
    Object.values(this.loops).forEach((a) => this._fade(a, 0, () => a.pause()));
    if (this.onStateChange) this.onStateChange(false);
  }

  toggle() {
    return this.enabled ? (this.disable(), false) : this.enable();
  }

  shot(name, volume = 1) {
    if (!this.enabled || !this.shots[name]) return;
    const a = this._audio(this.shots[name], false);
    a.volume = Math.min(1.0, this.volume * volume);
    a.play().catch(() => {});
  }

  _fade(a, to, done) {
    if (!a) return;
    const from = a.volume;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / 1200);
      a.volume = from + (to - from) * k;
      if (k < 1) requestAnimationFrame(step);
      else if (done) done();
    };
    requestAnimationFrame(step);
  }

  dispose() {
    this.disable();
    this.loops = {};
  }
}

