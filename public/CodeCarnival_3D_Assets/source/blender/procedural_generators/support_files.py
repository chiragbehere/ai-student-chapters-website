"""Writes animations/*.js, lighting presets (+ JS loader) and the Blender (bpy) scripts."""
import json, os, shutil, glob
from cc_common import ROOT, out

ANIM_JS = r'''// codecarnival-animations.js
// Procedural animation helpers for the Code Carnival asset pack. Framework-agnostic ES module:
// pass the THREE namespace in (works with three.js and React Three Fiber).  No dependencies.
// NOTE: written offline without a browser/three.js to run against - smoke-tested with Node stubs only.

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
  }[mode];
  return new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uMap: { value: map || null }, uColor: { value: new THREE.Color(color) },
                uSize: { value: size }, uScale: { value: 400 }, uOpacity: { value: opacity } },
    vertexShader: `
      uniform float uTime, uSize, uScale;
      attribute float _size; attribute float _phase;
      varying vec4 vCol; varying float vFlick;
      void main() {
        vec3 p = position;
        ${motion}
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = max(1.0, _size * uSize * uScale / max(0.1, -mv.z));
        gl_Position = projectionMatrix * mv;
        vCol = color;               // vertexColors:true => 'color' is vec4 because the GLB stores COLOR_0 as VEC4
        vFlick = 0.8 + 0.2 * sin(uTime * 2.0 + _phase * 6.0);
      }`,
    fragmentShader: `
      uniform sampler2D uMap; uniform vec3 uColor; uniform float uOpacity;
      varying vec4 vCol; varying float vFlick;
      void main() {
        vec4 t = texture2D(uMap, gl_PointCoord);
        float a = t.a * vCol.a * uOpacity * vFlick;
        if (a < 0.01) discard;
        gl_FragColor = vec4(t.rgb * vCol.rgb * uColor, a);
      }`,
    vertexColors: true, transparent: true, depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
}

/** world-units -> pixels factor for gl_PointSize */
export function setPointScale(material, rendererHeightPx, fovDegrees) {
  material.uniforms.uScale.value = rendererHeightPx / (2 * Math.tan((fovDegrees * Math.PI) / 360));
}

/** Pulse the portal halo + light and slowly rotate the swirl texture (the rift outline stays fixed). */
export class PortalPulse {
  constructor({ halo, surfaceMaterial, light } = {}) { this.halo = halo; this.mat = surfaceMaterial; this.light = light; this.t = 0; }
  update(dt) {
    const P = PARAMS.portalPulse;
    this.t += dt;
    const s = 1 + P.amount * Math.sin(this.t * P.speed) + 0.02 * Math.sin(this.t * 7.3);
    if (this.halo) this.halo.scale.set(s, s, 1);
    if (this.light) this.light.intensity = P.lightBase * (1 + P.lightJitter * Math.sin(this.t * 2.1) * Math.sin(this.t * 5.7 + 1));
    const tex = this.mat && this.mat.emissiveMap;
    if (tex) { tex.center.set(0.5, 0.5); tex.rotation = this.t * P.swirlSpeed; }
  }
}

/** Random lightning: shows one of the bolt nodes, flickers a light and a full-screen overlay (<img>/mesh with .style.opacity or .material.opacity). */
export class LightningController {
  constructor({ bolts = [], light = null, overlay = null, onFlash = null, rng = Math.random } = {}) {
    Object.assign(this, { bolts, light, overlay, onFlash, rng });
    this.bolts.forEach(b => (b.visible = false));
    this.wait = 1 + rng() * 3; this.step = -1; this.stepT = 0; this.active = null;
  }
  trigger() {
    if (this.step >= 0) return;
    this.active = this.bolts[Math.floor(this.rng() * this.bolts.length)] || null;
    this.step = 0; this.stepT = 0;
    if (this.onFlash) this.onFlash(this.active);
  }
  _apply(v) {
    if (this.active) this.active.visible = v > 0.05;
    if (this.light) this.light.intensity = v * 60;
    if (this.overlay) { const o = v * 0.55; if (this.overlay.style) this.overlay.style.opacity = o; else if (this.overlay.material) this.overlay.material.opacity = o; }
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
      this.step += 1; this.stepT = 0;
      if (this.step >= P.pattern.length) {
        this._apply(0); this.step = -1; this.active = null;
        this.wait = P.minGap + this.rng() * (P.maxGap - P.minGap);
      }
    }
  }
}

/** Bob / spin every node that carries userData.floatAmp / floatSpeed / spin (debris, floating rocks). */
export class FloatingProps {
  constructor(root) {
    this.items = [];
    root.traverse(n => {
      const u = n.userData || {};
      if (u.floatAmp !== undefined || u.spin) {
        this.items.push({ n, y0: n.position.y, amp: u.floatAmp ?? PARAMS.float.defaultAmp, sp: u.floatSpeed ?? PARAMS.float.defaultSpeed,
                          spin: u.spin || [0, 0, 0], ph: Math.random() * 6.28 });
      }
    });
    this.t = 0;
  }
  update(dt) {
    this.t += dt;
    for (const it of this.items) {
      it.n.position.y = it.y0 + it.amp * Math.sin(this.t * it.sp * 6.2832 + it.ph);
      it.n.rotation.x += it.spin[0] * dt; it.n.rotation.y += it.spin[1] * dt; it.n.rotation.z += it.spin[2] * dt;
    }
  }
}

/** Flicker for nodes flagged userData.flicker (lamp bulb, wire sparks). Optional `light` follows the node. */
export function flicker(nodes, t, lights = []) {
  nodes.forEach((n, i) => {
    const v = 0.6 + 0.4 * Math.sin(t * 17 + i * 3.1) * Math.sin(t * 5.3 + i) + (Math.random() < 0.02 ? -0.5 : 0);
    n.scale.setScalar(Math.max(0.3, v));
    if (lights[i]) lights[i].intensity = (lights[i].userData.base ?? (lights[i].userData.base = lights[i].intensity)) * Math.max(0.2, v);
  });
}

/** Audio stays silent until the visitor interacts. Call attach() once; user must opt in via enable()/toggle(). */
export class AudioManager {
  constructor(baseUrl = '/CodeCarnival_3D_Assets/audio/') {
    this.base = baseUrl; this.enabled = false; this.unlocked = false; this.loops = {}; this.volume = 0.6;
    this.files = { forest: 'ambient_forest.wav', drone: 'dark_drone.wav', wind: 'wind_ambience.wav' };
    this.shots = { crackle: 'electric_crackle.wav', open: 'portal_open.wav', transition: 'portal_transition.wav', impact: 'cinematic_impact.wav' };
  }
  attach(target = window) {
    const unlock = () => { this.unlocked = true; ['pointerdown', 'keydown', 'touchstart'].forEach(e => target.removeEventListener(e, unlock)); };
    ['pointerdown', 'keydown', 'touchstart'].forEach(e => target.addEventListener(e, unlock, { once: false }));
  }
  _audio(file, loop) { const a = new Audio(this.base + file); a.loop = loop; a.volume = 0; a.preload = 'auto'; return a; }
  enable() {
    if (!this.unlocked) return false;
    this.enabled = true;
    for (const [k, f] of Object.entries(this.files)) {
      if (!this.loops[k]) this.loops[k] = this._audio(f, true);
      this.loops[k].play().catch(() => {});
      this._fade(this.loops[k], k === 'drone' ? this.volume * 0.7 : this.volume * 0.5);
    }
    return true;
  }
  disable() { this.enabled = false; Object.values(this.loops).forEach(a => this._fade(a, 0, () => a.pause())); }
  toggle() { return this.enabled ? (this.disable(), false) : this.enable(); }
  shot(name, volume = 1) {
    if (!this.enabled || !this.shots[name]) return;
    const a = this._audio(this.shots[name], false); a.volume = Math.min(1, this.volume * volume); a.play().catch(() => {});
  }
  _fade(a, to, done) {
    const from = a.volume, t0 = performance.now();
    const step = now => { const k = Math.min(1, (now - t0) / 1200); a.volume = from + (to - from) * k; if (k < 1) requestAnimationFrame(step); else if (done) done(); };
    requestAnimationFrame(step);
  }
}
'''

LIGHT_JS = r'''// lighting_presets.js - applies lighting/*.json to a three.js scene (forest | portal | red_alert).
// usage:  const rig = await applyLightingPreset(THREE, scene, '/CodeCarnival_3D_Assets/lighting/lighting_portal.json');
//         in the render loop: rig.update(elapsedSeconds);   later: rig.dispose();
export async function applyLightingPreset(THREE, scene, urlOrObject) {
  const cfg = typeof urlOrObject === 'string' ? await (await fetch(urlOrObject)).json() : urlOrObject;
  const lights = [], dyn = [];
  scene.background = new THREE.Color(cfg.background);
  scene.fog = new THREE.FogExp2(new THREE.Color(cfg.fog.color), cfg.fog.density);
  const add = l => { scene.add(l); lights.push(l); return l; };
  if (cfg.ambient) add(new THREE.AmbientLight(cfg.ambient.color, cfg.ambient.intensity));
  if (cfg.hemisphere) add(new THREE.HemisphereLight(cfg.hemisphere.sky, cfg.hemisphere.ground, cfg.hemisphere.intensity));
  (cfg.directional || []).forEach(d => {
    const l = add(new THREE.DirectionalLight(d.color, d.intensity)); l.position.set(...d.position); l.castShadow = !!d.castShadow; l.name = d.name;
  });
  (cfg.points || []).forEach(p => {
    const l = add(new THREE.PointLight(p.color, p.intensity, p.distance, p.decay)); l.position.set(...p.position); l.name = p.name;
    l.userData.base = p.intensity; l.userData.cfg = p; dyn.push(l);
  });
  return {
    config: cfg, lights, exposure: cfg.exposure, bloom: cfg.bloom,
    update(t) {
      dyn.forEach((l, i) => {
        const p = l.userData.cfg;
        if (p.pulse) { const k = 0.5 + 0.5 * Math.sin(t * Math.PI * 2 * p.pulse.frequency + i); l.intensity = l.userData.base * (p.pulse.min + (p.pulse.max - p.pulse.min) * k); }
        else if (p.flicker) l.intensity = l.userData.base * (0.8 + 0.2 * Math.sin(t * 17 + i) * Math.sin(t * 5.3));
      });
    },
    dispose() { lights.forEach(l => scene.remove(l)); },
  };
}
'''

EXAMPLE_JSX = r'''// ExampleScene.jsx - React Three Fiber integration sketch for the Code Carnival hero scene.
// Requires: three, @react-three/fiber, @react-three/drei  (optionally @react-three/postprocessing for Bloom).
// NOTE: this file was written offline and has NOT been compiled or run - treat it as a starting point.
import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { playClips, FloatingProps, PortalPulse, LightningController, makeParticleMaterial, setPointScale } from './codecarnival-animations.js';

const BASE = '/CodeCarnival_3D_Assets/';           // copy the folder into your /public directory
const layout = await (await fetch(BASE + 'models/scene_layout.json')).json();

function Placed({ file, position, yaw, scale, onReady }) {
  const gltf = useGLTF(BASE + file);               // textures resolve relative to the .glb (../../textures/...)
  const root = useMemo(() => gltf.scene.clone(true), [gltf]);
  const mixer = useRef();
  useEffect(() => {
    if (gltf.animations.length) mixer.current = playClips(THREE, gltf, root);
    onReady && onReady(root, gltf);
  }, []);
  useFrame((_, dt) => mixer.current && mixer.current.update(dt));
  return <primitive object={root} position={position} rotation={[0, yaw, 0]} scale={scale} />;
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: layout.camera.position, fov: layout.camera.fov_y_degrees, near: 0.1, far: 300 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}>
      <color attach="background" args={['#0a0510']} />
      <fogExp2 attach="fog" args={['#120610', 0.018]} />
      <ambientLight intensity={0.45} color="#1a1530" />
      <directionalLight position={[-14, 28, 18]} intensity={0.9} color="#6f86d6" />
      <pointLight position={[0, 4.9, -8]} intensity={40} distance={40} color="#ff2a14" />
      {layout.placements.map((p, i) => (
        <Placed key={i} file={p.file} position={p.position} yaw={p.yaw_radians} scale={p.scale} />
      ))}
    </Canvas>
  );
}
'''

BPY_ASSEMBLE = r'''"""assemble_scene.py - run inside Blender (>= 3.6):   blender -b -P assemble_scene.py
Imports every .glb listed in models/scene_layout.json, groups each into a collection under an Empty carrying the
layout transform, and saves source/blender/CodeCarnival_scene.blend.
NOTE: written without Blender available - not executed by the author. Report/fix any API drift for your Blender version."""
import bpy, json, os, math

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.abspath(os.path.join(HERE, "..", ".."))
layout = json.load(open(os.path.join(PACK, "models", "scene_layout.json")))

bpy.ops.wm.read_factory_settings(use_empty=True)
for i, pl in enumerate(layout["placements"]):
    name = f"{i:02d}_{os.path.splitext(os.path.basename(pl['file']))[0]}"
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(PACK, pl["file"]))
    new = [o for o in bpy.data.objects if o not in before]
    # glTF is Y-up, Blender Z-up: (x, y, z) -> (x, -z, y). A yaw about glTF +Y is a rotation about Blender +Z.
    x, y, z = pl["position"]
    root = bpy.data.objects.new(name + "_root", None)
    col.objects.link(root)
    root.location = (x, -z, y)
    root.rotation_euler = (0, 0, pl["yaw_radians"])
    root.scale = (pl["scale"],) * 3
    for o in new:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        col.objects.link(o)
        if o.parent is None:
            o.parent = root
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "CodeCarnival_scene.blend"))
print("saved CodeCarnival_scene.blend")
'''

BPY_LIGHTS = r'''"""build_lighting_blends.py - run inside Blender (>= 3.6):   blender -b -P build_lighting_blends.py
Creates lighting/lighting_forest.blend, lighting_portal.blend and lighting_red_alert.blend from the matching .json presets.
Unit mapping is approximate (three.js intensity -> Blender watts): point W = intensity * 40, sun strength = intensity * 3.
NOTE: written without Blender available - not executed by the author."""
import bpy, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
LIGHT_DIR = os.path.abspath(os.path.join(HERE, "..", "..", "lighting"))


def hex_rgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [v ** 2.2 for v in c]            # sRGB -> linear


def yup(p):
    return (p[0], -p[2], p[1])


for name in ("forest", "portal", "red_alert"):
    cfg = json.load(open(os.path.join(LIGHT_DIR, f"lighting_{name}.json")))
    bpy.ops.wm.read_factory_settings(use_empty=True)
    world = bpy.data.worlds.new(f"world_{name}")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (*hex_rgb(cfg["background"]), 1)
    bg.inputs[1].default_value = 0.6 * cfg.get("exposure", 1.0)
    bpy.context.scene.world = world
    for d in cfg.get("directional", []):
        ld = bpy.data.lights.new(d["name"], "SUN"); ld.color = hex_rgb(d["color"])[:3]; ld.energy = d["intensity"] * 3
        o = bpy.data.objects.new(d["name"], ld); o.location = yup(d["position"])
        o.rotation_euler = (0.9, 0, 0.6)
        bpy.context.scene.collection.objects.link(o)
    for p in cfg.get("points", []):
        lp = bpy.data.lights.new(p["name"], "POINT"); lp.color = hex_rgb(p["color"])[:3]; lp.energy = p["intensity"] * 40
        lp.shadow_soft_size = 0.3
        o = bpy.data.objects.new(p["name"], lp); o.location = yup(p["position"])
        bpy.context.scene.collection.objects.link(o)
    if cfg.get("ambient"):                    # ambient has no Blender light type: fold into the world strength
        bg.inputs[1].default_value += cfg["ambient"]["intensity"] * 0.3
    bpy.context.scene["codecarnival_fog_density"] = cfg["fog"]["density"]
    bpy.context.scene["codecarnival_fog_color"] = cfg["fog"]["color"]
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(LIGHT_DIR, f"lighting_{name}.blend"))
    print("saved", name)
'''

PRESETS = {
 "forest": {"name": "forest", "description": "Cold moonlit dead forest; the portal is a distant red glow.",
   "background": "#0a0510", "fog": {"type": "FogExp2", "color": "#120610", "density": 0.018}, "exposure": 0.9,
   "ambient": {"color": "#1a1530", "intensity": 0.45}, "hemisphere": {"sky": "#2a2048", "ground": "#1a0508", "intensity": 0.35},
   "directional": [{"name": "moon", "color": "#6f86d6", "intensity": 0.9, "position": [-14, 28, 18], "castShadow": True}],
   "points": [{"name": "portal_glow", "color": "#ff2a14", "intensity": 40, "distance": 40, "decay": 2, "position": [0, 4.9, -8]},
              {"name": "lamp_glow", "color": "#ff5a2a", "intensity": 6, "distance": 9, "decay": 2, "position": [-6.3, 3.7, -5.5], "flicker": True}],
   "bloom": {"strength": 0.8, "radius": 0.6, "threshold": 0.65}},
 "portal": {"name": "portal", "description": "Portal active: strong red-orange key light, redder fog, dimmer moon.",
   "background": "#12050a", "fog": {"type": "FogExp2", "color": "#2a0810", "density": 0.022}, "exposure": 1.0,
   "ambient": {"color": "#301020", "intensity": 0.5}, "hemisphere": {"sky": "#40182a", "ground": "#200608", "intensity": 0.4},
   "directional": [{"name": "moon", "color": "#6f86d6", "intensity": 0.45, "position": [-14, 28, 18], "castShadow": True}],
   "points": [{"name": "portal_key", "color": "#ff3a1a", "intensity": 120, "distance": 55, "decay": 2, "position": [0, 4.9, -7],
               "pulse": {"frequency": 0.4, "min": 0.8, "max": 1.2}},
              {"name": "portal_rim_low", "color": "#ff6a2a", "intensity": 30, "distance": 18, "decay": 2, "position": [0, 0.8, -6], "flicker": True}],
   "bloom": {"strength": 1.1, "radius": 0.7, "threshold": 0.55}},
 "red_alert": {"name": "red_alert", "description": "Alarm state for transitions/glitches: pulsing pure-red light, no moon.",
   "background": "#1a0204", "fog": {"type": "FogExp2", "color": "#3a0508", "density": 0.026}, "exposure": 1.05,
   "ambient": {"color": "#400808", "intensity": 0.6},
   "hemisphere": {"sky": "#601010", "ground": "#200404", "intensity": 0.5},
   "directional": [],
   "points": [{"name": "alert_main", "color": "#ff1010", "intensity": 160, "distance": 60, "decay": 2, "position": [0, 6, 4],
               "pulse": {"frequency": 1.2, "min": 0.25, "max": 1.6}},
              {"name": "alert_back", "color": "#ff2a14", "intensity": 90, "distance": 50, "decay": 2, "position": [0, 4.9, -8],
               "pulse": {"frequency": 1.2, "min": 0.4, "max": 1.4}}],
   "bloom": {"strength": 1.3, "radius": 0.8, "threshold": 0.5}},
}


def write():
    open(out("animations", "codecarnival-animations.js"), "w").write(ANIM_JS)
    open(out("animations", "ExampleScene.jsx"), "w").write(EXAMPLE_JSX)
    open(out("lighting", "lighting_presets.js"), "w").write(LIGHT_JS)
    for k, v in PRESETS.items():
        json.dump(v, open(out("lighting", f"lighting_{k}.json"), "w"), indent=1)
    open(out("source", "blender", "assemble_scene.py"), "w").write(BPY_ASSEMBLE)
    open(out("source", "blender", "build_lighting_blends.py"), "w").write(BPY_LIGHTS)
    gen = out("source", "blender", "procedural_generators", "x")
    os.makedirs(os.path.dirname(gen), exist_ok=True)
    for f in ["cc_common.py", "glb.py", "gen_textures.py", "gen_graphics.py", "gen_models_env.py", "gen_models_fx.py",
              "make_layout.py", "gen_audio.py", "validate_glb.py", "render_preview.py", "support_files.py", "build_docs.py"]:
        p = os.path.join(os.path.dirname(__file__), f)
        if os.path.exists(p):
            shutil.copy(p, os.path.dirname(gen))
    print("support files written")


if __name__ == "__main__":
    write()
