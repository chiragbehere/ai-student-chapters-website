// Procedural animation driver for the Code Carnival GLBs.
// Framework-agnostic Three.js (r150+). Reads each node's `userData` (glTF "extras") and animates it.
// Usage:  const anim = createAnimator(gltf.scene); renderer.setAnimationLoop(() => anim.update(clock.getElapsedTime()));
// NOTE: written against the Three.js API but not executed in the build environment (no network/three available there).
import * as THREE from 'three';

export function createAnimator(root, opts = {}) {
  const items = [];
  root.traverse((o) => {
    const a = o.userData && o.userData.anim;
    if (!a) return;
    items.push({ o, a, d: o.userData, base: { p: o.position.clone(), q: o.quaternion.clone() } });
  });

  // Vertex-shader sway for vines using the custom _SWAY attribute (0 at anchor .. 1 at tip).
  // glTFLoader exposes custom attributes as `_sway` (lower-cased).
  root.traverse((o) => {
    if (!o.isMesh || !o.geometry.attributes._sway) return;
    const mat = o.material;
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = o.userData._uTime = { value: 0 };
      sh.uniforms.uAmp = { value: o.userData.amp ?? 0.08 };
      sh.uniforms.uPhase = { value: o.userData.phase ?? 0 };
      sh.vertexShader = 'attribute float _sway; uniform float uTime, uAmp, uPhase;\n' + sh.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         float s = _sway * _sway;
         transformed.x += sin(uTime * 0.8 + uPhase + position.y * 0.9) * uAmp * s * 2.0;
         transformed.z += cos(uTime * 0.6 + uPhase * 1.3 + position.y * 0.7) * uAmp * s * 2.0;`);
    };
    mat.needsUpdate = true;
  });

  const tmpE = new THREE.Euler();
  const handlers = {
    sway(it, t) {            // trees / branches: tiny rotation about the base
      const ph = it.d.phase ?? 0, a = it.d.amp ?? 0.01, s = it.d.speed ?? 0.4;
      tmpE.set(Math.sin(t * s + ph) * a, 0, Math.cos(t * s * 0.8 + ph) * a);
      it.o.quaternion.copy(it.base.q).multiply(new THREE.Quaternion().setFromEuler(tmpE));
    },
    swing(it, t) { it.o.rotation.z = it.base.q ? Math.sin(t * (it.d.speed ?? 0.7)) * (it.d.amp ?? 0.05) - 0.14 : 0; },
    float(it, t) {
      const ph = it.d.phase ?? 0, a = it.d.amp ?? 0.2, s = it.d.speed ?? 0.5, sp = it.d.spin ?? [0, 0, 0];
      it.o.position.y = it.base.p.y + Math.sin(t * s + ph) * a;
      it.o.rotation.x += sp[0] * 0.004; it.o.rotation.y += sp[1] * 0.004; it.o.rotation.z += sp[2] * 0.004;
    },
    spin(it, t, dt) { it.o.rotation.z += (it.d.speed ?? 0.1) * dt; },
    pulse(it, t) {
      const k = 1 + Math.sin(t * (it.d.speed ?? 1.2)) * (it.d.amp ?? 0.1);
      it.o.scale.setScalar(k);
      const m = it.o.material; if (m && m.emissiveIntensity !== undefined) m.emissiveIntensity = 0.8 + 0.5 * Math.sin(t * (it.d.speed ?? 1.2));
    },
    flicker(it, t) {
      const n = Math.sin(t * (it.d.speed ?? 3) * 7.3) * Math.sin(t * (it.d.speed ?? 3) * 3.1);
      it.o.traverse((c) => { if (c.material && c.material.opacity !== undefined) { c.material.transparent = true; c.material.opacity = THREE.MathUtils.clamp(0.75 + 0.25 * n, 0.2, 1); } });
    },
    uv_scroll(it, t) {
      const m = it.o.material; if (m && m.map) { m.map.wrapS = m.map.wrapT = THREE.RepeatWrapping; m.map.offset.x = t * (it.d.speed ?? 0.01); m.map.offset.y = t * (it.d.speed ?? 0.01) * 0.6; }
      if (m && it.d.opacity !== undefined) { m.transparent = true; m.opacity = it.d.opacity; }
    },
    ribbon_flow(it, t) { it.o.rotation.z = t * (it.d.speed ?? 0.2); },
    flash(it, t) {           // lightning bolt: hidden except while its strike window is active
      const st = it.strike ?? -9;
      it.o.visible = t - st < (it.d.duration ?? 0.18);
    },
    vine_sway() {}           // handled in the vertex shader
  };

  // Lightning scheduler: strikes a random bolt every 3-9 s; calls opts.onStrike(boltIndex) for flash overlays / light strobe.
  const bolts = items.filter((i) => i.a === 'flash');
  let nextStrike = 2 + Math.random() * 3, last = 0;

  return {
    update(t) {
      const dt = Math.min(t - last, 0.1); last = t;
      if (bolts.length && t > nextStrike) {
        const b = bolts[Math.floor(Math.random() * bolts.length)];
        b.strike = t; b.o.position.x = (Math.random() - 0.5) * 40; b.o.position.z = -20 - Math.random() * 40;
        opts.onStrike && opts.onStrike(b.d.variant);
        nextStrike = t + 3 + Math.random() * 6;
      }
      for (const it of items) { const h = handlers[it.a]; h && h(it, t, dt); if (it.o.userData._uTime) it.o.userData._uTime.value = t; }
    }
  };
}

// Points clouds: orbit / drift / rise / fall implemented in a shader so thousands of particles cost one draw call.
export function makeParticleMaterial(spriteTexture, { size = 0.1, mode = 'drift', speed = 0.2, box = 20 } = {}) {
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true,
    uniforms: { uTime: { value: 0 }, uSize: { value: size }, uSpeed: { value: speed }, uMap: { value: spriteTexture }, uMode: { value: ['drift', 'rise', 'fall', 'orbit', 'float', 'spark'].indexOf(mode) }, uBox: { value: box } },
    vertexShader: `
      attribute float _seed; uniform float uTime, uSize, uSpeed, uBox; uniform int uMode; varying vec4 vColor;
      void main(){
        vec3 p = position; float s = _seed * 6.2831;
        if (uMode == 0 || uMode == 4) { p += vec3(sin(uTime*uSpeed+s), cos(uTime*uSpeed*0.8+s*1.7), sin(uTime*uSpeed*0.6+s*2.3)) * 0.6; }
        else if (uMode == 1) { p.y = mod(p.y + uTime*uSpeed*(0.6+_seed), 10.0); p.x += sin(uTime*0.7+s)*0.3; }
        else if (uMode == 2) { p.y = 12.0 - mod(12.0 - p.y + uTime*uSpeed*(0.5+_seed), 12.0); p.x += sin(uTime*0.5+s)*0.5; }
        else if (uMode == 3) { float r = length(p.xy); float a = atan(p.y,p.x) + uTime*uSpeed/max(r,0.5) + s*0.0; p.xy = vec2(cos(a),sin(a))*r; }
        else { p.xy *= 1.0 + 0.04*sin(uTime*6.0+s*4.0); }
        vec4 mv = modelViewMatrix * vec4(p,1.0); vColor = color;
        gl_PointSize = uSize * 900.0 / -mv.z; gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `uniform sampler2D uMap; varying vec4 vColor; void main(){ vec4 t = texture2D(uMap, gl_PointCoord); gl_FragColor = vec4(vColor.rgb*t.rgb, t.a*vColor.a); }`
  });
  return mat;
}
