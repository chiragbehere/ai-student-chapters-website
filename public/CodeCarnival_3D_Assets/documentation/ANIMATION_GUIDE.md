# Animation guide

No baked animation clips are shipped: motion is procedural, which is smaller and loops forever. Each node carries parameters in glTF `extras` (`userData`), e.g. `{ "anim": "float", "amp": 0.2, "speed": 0.5, "phase": 1.3 }`.

```js
import { createAnimator } from './animations/codeCarnivalAnimations.js';
const anim = createAnimator(gltf.scene, { onStrike: (variant) => flashOverlay(variant) });
renderer.setAnimationLoop(() => anim.update(clock.getElapsedTime()));
```

| Effect | `extras.anim` | Where | How |
|---|---|---|---|
| Floating portal energy | `ribbon_flow`, `spin` | `energy_ribbons`, portal swirls/rings | rotate about Z; opposite signs give counter-rotation |
| Pulsating portal | `pulse` | `portal_core_glow` | scale and emissive oscillation |
| Moving vines | `vine_sway` | vines, roots, cables | vertex shader, `_SWAY` attribute (0 anchor .. 1 tip) |
| Swaying branches / trees | `sway` | trees, branches | few-milliradian rotation about the base |
| Lightning flashes | `flash` | `red_lightning_effect` | scheduler picks a bolt every 3-9 s, shows it for 0.18 s, calls `onStrike`; combine with `textures/overlays/lightning_flash_0N.png` and `lighting/lighting_red_alert.json` |
| Floating embers/spores/ash/dust | point `anim`: `rise`, `float`, `fall`, `drift` | `environment_fog_particles` | use `makeParticleMaterial(texture,{mode})` on the Points; `extras.sprite` names the texture |
| Slowly moving fog | `uv_scroll` | `fog_sheet_*` | scroll `map.offset`; drift opacity |
| Portal particles | `orbit`, `spark` | `portal_particles` | angular speed ∝ 1/radius |
| Debris / rocks | `float` | debris, rocks | sine bob + slow spin |

Audio triggers: `portal_open.wav` on the first click, `portal_transition.wav` on route change, `cinematic_impact.wav` on title reveal, `electric_crackle.wav` on each lightning strike. Keep all audio muted until the first user gesture (browsers block autoplay anyway): create the `AudioContext` inside the click handler. `.ogg` copies are ~10x smaller than WAV.

**Status:** the JS module was syntax-checked with Node but not run against Three.js in the build environment (no network). Expect to adjust import paths and, if you use a newer Three.js, check that custom GLTF attributes still arrive as `_sway`.
