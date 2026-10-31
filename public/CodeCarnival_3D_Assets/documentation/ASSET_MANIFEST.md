# Asset manifest

Every file below exists in the pack. Sizes are on-disk. Texture folders: `pbr/`, `particles/`, `portal/`, `overlays/`.

| File | Format | Dimensions / count | Size | Purpose |
|---|---|---|---|---|
| `models/environment/environment_dark_forest.glb` | GLB | 68,335 rendered tris | 178 KB | Main forest: 56 instanced twisted dead trees (4 variants), 8 fallen logs, 10 stumps, world-placed, portal clearing + camera corridor kept open. |
| `models/environment/environment_ground.glb` | GLB | 20,000 rendered tris | 558 KB | Uneven 120x120 m heightfield with fissure trenches and a crater under the portal; 2nd UV set maps cracked_ground.png as glowing cracks around the portal. |
| `models/environment/environment_fog_particles.glb` | GLB | 10 rendered tris | 49 KB | 5 scrolling fog sheets + 5 point clouds (fog wisps, dust, ash, embers, spores). Points carry a _SEED attribute and an extras.sprite path. |
| `models/environment/environment_floating_debris.glb` | GLB | 2,080 rendered tris | 48 KB | 72 instanced floating shards, rock chunks, planks and leaf cards (4 meshes), each with float/spin extras. |
| `models/trees/environment_dead_trees.glb` | GLB | 4,696 rendered tris | 144 KB | The 4 hero dead-tree variants as separate nodes for close-ups or re-instancing. |
| `models/environment/environment_vines.glb` | GLB | 4,280 rendered tris | 187 KB | 28 hanging vines + 10 hanging root bundles; each is its own node with origin at the anchor, plus a _SWAY vertex attribute for shader sway. |
| `models/environment/environment_distant_forest.glb` | GLB | 19,971 rendered tris | 84 KB | 3 parallax layers (near/mid/far) of low-poly silhouette trees, unlit, tinted toward the fog colour. |
| `models/portal/portal_main.glb` | GLB | 4,584 rendered tris | 54 KB | Portal body: void disc, 3 counter-rotating swirl discs (portal_emission.png, unlit alpha-blend) and a pulsing core glow. |
| `models/portal/portal_ring.glb` | GLB | 3,692 rendered tris | 112 KB | Broken stone-like ring, inner ring, 28 radial shards, and 3 floating arcs; emissive red. |
| `models/portal/portal_cracks.glb` | GLB | 3,460 rendered tris | 125 KB | Recursive branching glowing cracks in three weights (primary/secondary/fine) as soft-edged ribbons. |
| `models/portal/portal_particles.glb` | GLB | 0 rendered tris | 57 KB | 2,400 orbiting red particles + 420 bright sparks (point primitives). |
| `models/effects/red_lightning_effect.glb` | GLB | 5,376 rendered tris | 185 KB | 6 independent bolt variants (midpoint-displaced, crossed double ribbon, with side branches) for random strikes. |
| `models/effects/energy_ribbons.glb` | GLB | 1,704 rendered tris | 63 KB | 6 spiralling soft-edged energy ribbons around the portal. |
| `models/props/abandoned_sign.glb` | GLB | 45 rendered tris | 7 KB | Leaning post + swinging board (hinge at origin) + broken plank. |
| `models/props/broken_electric_pole.glb` | GLB | 354 rendered tris | 18 KB | Leaning splintered pole, cross-arm and two cut cables. |
| `models/props/old_lamp.glb` | GLB | 204 rendered tris | 9 KB | Rusted street lamp with hood and emissive glass (flicker + light hint in extras). |
| `models/props/floating_rocks.glb` | GLB | 2,240 rendered tris | 259 KB | 7 faceted rocks of descending size, glowing undersides (vertex colour). |
| `models/props/dead_branches.glb` | GLB | 1,026 rendered tris | 39 KB | 6 fallen branch assemblies, individually swaying. |
| `models/props/mysterious_crystals.glb` | GLB | 270 rendered tris | 34 KB | 3 faceted crystal clusters, translucent red with glow gradient (pulse + light hint). |
| `models/props/forest_roots.glb` | GLB | 3,054 rendered tris | 93 KB | 5 root bundles to place around tree bases. |
| `textures/overlays/fog_overlay.png` | PNG RGBA (+ .webp) | 1280x720 | 349 KB | Screen-space drifting fog overlay |
| `textures/overlays/lightning_flash_01.png` | PNG RGBA (+ .webp) | 1280x720 | 111 KB | Full-screen lightning overlay variant 1 |
| `textures/overlays/lightning_flash_02.png` | PNG RGBA (+ .webp) | 1280x720 | 114 KB | Lightning overlay variant 2 |
| `textures/overlays/lightning_flash_03.png` | PNG RGBA (+ .webp) | 1280x720 | 80 KB | Lightning overlay variant 3 |
| `textures/particles/fog_noise.png` | PNG RGBA | 1024x1024 | 716 KB | Tileable fog density (alpha) for scrolling fog sheets |
| `textures/particles/fog_puff.png` | PNG RGBA (+ .webp) | 512x512 | 103 KB | Soft fog sprite |
| `textures/particles/particle_ash.png` | PNG RGBA (+ .webp) | 256x256 | 118 KB | Ash flake sprite |
| `textures/particles/particle_dust.png` | PNG RGBA (+ .webp) | 256x256 | 8 KB | Dust mote sprite |
| `textures/particles/particle_ember.png` | PNG RGBA (+ .webp) | 256x256 | 8 KB | Ember sprite |
| `textures/particles/particle_red.png` | PNG RGBA (+ .webp) | 256x256 | 13 KB | Red glowing particle sprite |
| `textures/particles/particle_spore.png` | PNG RGBA (+ .webp) | 256x256 | 15 KB | Glowing spore sprite (ring + core) |
| `textures/pbr/bark_basecolor.png` | PNG RGB (+ .webp) | 1024x1024 | 1331 KB | Dead-tree bark albedo (tileable) |
| `textures/pbr/bark_normal.png` | PNG RGB (+ .webp) | 1024x1024 | 2386 KB | Bark normal map (OpenGL +Y) |
| `textures/pbr/bark_roughness.png` | PNG L | 1024x1024 | 595 KB | Bark roughness (G channel) |
| `textures/pbr/cracked_ground.png` | PNG RGBA (+ .webp) | 1024x1024 | 437 KB | Glowing radial cracks, clamp-sampled; ground UV1 |
| `textures/pbr/ground_basecolor.png` | PNG RGB (+ .webp) | 1024x1024 | 1136 KB | Forest ground albedo, cracked plates (tileable) |
| `textures/pbr/ground_normal.png` | PNG RGB (+ .webp) | 1024x1024 | 2239 KB | Ground normal map |
| `textures/pbr/ground_roughness.png` | PNG L | 1024x1024 | 569 KB | Ground roughness |
| `textures/pbr/vines_basecolor.png` | PNG RGB (+ .webp) | 1024x1024 | 1086 KB | Vines/roots albedo with faint red veins |
| `textures/portal/energy_distortion.png` | PNG RGB | 1024x1024 | 2929 KB | Tileable normal-style map for refraction/distortion shaders |
| `textures/portal/portal_emission.png` | PNG RGBA (+ .webp) | 1024x1024 | 2096 KB | Portal swirl colour+alpha (red/orange, hot core) |
| `textures/portal/portal_noise.png` | PNG L | 1024x1024 | 867 KB | Tileable grayscale noise for shader distortion/dissolve |
| `graphics/code_carnival_logo.png` | PNG RGBA | 2048x1024 | 492 KB | Original event logo: circus tent inside a broken portal ring with code brackets |
| `graphics/cursor_particle.png` | PNG RGBA | 128x128 | 4 KB | Small glowing cursor sprite |
| `graphics/film_grain.png` | PNG RGBA | 512x512 | 391 KB | Tileable retro grain, transparent |
| `graphics/red_glow.png` | PNG RGBA | 512x512 | 42 KB | Soft red glow sprite |
| `graphics/title_texture.png` | PNG RGBA | 2048x512 | 358 KB | Neon outline title wordmark, transparent |
| `graphics/transition_portal.png` | PNG RGBA | 1280x1280 | 1976 KB | Opaque dark-red swirl with a transparent glowing portal hole; scale up to transition |
| `graphics/vignette.png` | PNG RGBA | 1600x900 | 74 KB | Dark vignette overlay, transparent centre |
| `audio/ambient_forest.wav` (+ `.ogg`) | WAV PCM16 mono 22050 Hz | 24.0 s | 1034 KB wav / 94 KB ogg | Room-tone, wind bed, insects, creaks; seamless loop (22.05 kHz) |
| `audio/cinematic_impact.wav` (+ `.ogg`) | WAV PCM16 mono 44100 Hz | 5.0 s | 431 KB wav / 33 KB ogg | Boom + hit + metallic ring |
| `audio/dark_drone.wav` (+ `.ogg`) | WAV PCM16 mono 44100 Hz | 20.0 s | 1723 KB wav / 41 KB ogg | Low detuned drone; seamless loop |
| `audio/electric_crackle.wav` (+ `.ogg`) | WAV PCM16 mono 44100 Hz | 4.0 s | 345 KB wav / 45 KB ogg | Randomised electric crackle |
| `audio/portal_open.wav` (+ `.ogg`) | WAV PCM16 mono 44100 Hz | 7.0 s | 603 KB wav / 61 KB ogg | 7 s rising swell to sub boom (boom lands at 5.6 s) |
| `audio/portal_transition.wav` (+ `.ogg`) | WAV PCM16 mono 44100 Hz | 3.5 s | 302 KB wav / 33 KB ogg | Whoosh with sub drop |
| `audio/wind_ambience.wav` (+ `.ogg`) | WAV PCM16 mono 22050 Hz | 24.0 s | 1034 KB wav / 130 KB ogg | Layered wind; seamless loop (22.05 kHz) |
| `lighting/lighting_forest.json` | JSON | - | 1 KB | Default lighting preset (Three.js) |
| `lighting/lighting_portal.json` | JSON | - | 1 KB | Portal close-up preset |
| `lighting/lighting_red_alert.json` | JSON | - | 1 KB | Lightning / transition preset |
| `animations/codeCarnivalAnimations.js` | ES module | - | 6 KB | Procedural animation driver + particle shader material |
| `animations/PortalScene.example.jsx` | React Three Fiber | - | 2 KB | Integration example |
| `animations/animation_presets.json` | JSON | - | 1 KB | Animation reference values |
| `animations/scene_layout.json` | JSON | - | 3 KB | World placement for every model, camera, fog |
| `source/blender/build_blend_files.py` | Blender Python | - | 3 KB | Builds the .blend scene and lighting .blend files (UNTESTED, see README) |
| `preview_environment.jpg` | JPEG q92 | - | 359 KB | Software-rendered preview of the assembled scene |

Source generators (`source/*.py`) rebuild every model, texture and audio file deterministically: `python3 gen_textures.py OUT && python3 gen_models.py OUT && python3 gen_audio.py OUT` (needs numpy, scipy, Pillow, ffmpeg).
