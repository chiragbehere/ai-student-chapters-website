// lighting_presets.js - applies lighting/*.json to a three.js scene (forest | portal | red_alert).
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
