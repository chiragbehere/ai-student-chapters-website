"""Generates documentation/*.md and README.md by scanning the actual files in the pack (no hand-typed counts)."""
import os, glob, json, wave, shutil
from PIL import Image
from glb import read_glb
from cc_common import ROOT, out

PURPOSE = {
 "environment_ground.glb": "Uneven 92x92 m forest floor (heightfield, 18.4k tris) with vertex-colour red scorching around the clearing. Tiles ground_* PBR textures x14.",
 "environment_dark_forest.glb": "Main forest: 7 tree variants (near LOD1 + far LOD2) and a twig-brush clump, instanced as separate nodes (mesh data is shared, not duplicated).",
 "environment_dead_trees.glb": "Six hero dead-tree models (twisted, forked, broken stump, drooping, skeletal, gnarled) laid out in a row for picking individually.",
 "environment_vines.glb": "Four canopy branches with 20 hanging woody vines and alpha-cut leaf-card vines. Three glTF sway clips.",
 "environment_distant_forest.glb": "Three unlit silhouette layers of conifers and dead trees at 60/78/98 m for depth. Vertex-colour gradients only, no textures.",
 "environment_fog_particles.glb": "1,100 point-cloud fog puffs (POINTS primitive with _SIZE/_PHASE attributes). Needs the particle shader in animations/.",
 "environment_floating_debris.glb": "Rock shards and planks hovering around the portal; per-node extras give float amplitude/speed/spin.",
 "portal_main.glb": "Concave jagged-rift surface (uses portal_emission.png as emissive), additive halo disc, and black void plate. Clip: portal_pulse.",
 "portal_ring.glb": "Jagged outer rim with spikes, two counter-rotating broken circles, three gyroscope rings. Five rotation clips.",
 "portal_cracks.glb": "Glowing crack ribbons: radiating across the portal wall plane and across the ground in front. Emissive, alpha-blended.",
 "portal_particles.glb": "700 point-cloud red energy motes around the portal centre (_SIZE/_PHASE attributes).",
 "red_lightning_effect.glb": "Five procedural bolt meshes (midpoint displacement + branches), each its own node for random flashing.",
 "energy_ribbons.glb": "Seven spiral and three drifting translucent energy ribbons. Seven spin clips.",
 "abandoned_sign.glb": "Leaning, bent warning sign on a post. Stripes/grime are vertex colours, so no sign texture is needed.",
 "broken_electric_pole.glb": "Snapped utility pole with a swung-down cross-arm, dangling wires and sparking ends (flicker nodes).",
 "old_lamp.glb": "Street lamp with warm glowing bulb (flicker node; extras hold suggested point-light settings).",
 "floating_rocks.glb": "Eight faceted levitating rocks with red-lit undersides; extras give float parameters.",
 "dead_branches.glb": "Eight loose branches, each an independent node with a sway clip.",
 "mysterious_crystals.glb": "Ten emissive red/violet crystals plus rubble base; nodes flagged for pulsing.",
 "forest_roots.glb": "Seven arching exposed roots with side roots.",
}
TEXPURPOSE = {
 "bark_basecolor.png": "Dead-bark albedo, tileable, fissured, red cast deep in cracks.", "bark_normal.png": "Bark tangent-space normal (OpenGL/glTF +Y).",
 "bark_roughness.png": "Bark roughness (greyscale).", "ground_basecolor.png": "Ash/soil/root-vein albedo, tileable.",
 "ground_normal.png": "Ground normal map.", "ground_roughness.png": "Ground roughness.", "cracked_ground.png": "Dark rock with glowing lava-like cracks (emissive-style albedo) for the clearing / decals.",
 "vines_basecolor.png": "RGBA atlas: two leaf-vine strips with alpha (use alphaTest ~0.4).", "portal_emission.png": "Swirling red portal emissive, circular, black outside the rift.",
 "portal_noise.png": "Tileable greyscale fbm noise for portal shader distortion.", "energy_distortion.png": "Two decorrelated tileable noise channels (R,G) for UV-flow distortion; B=0.5.",
 "portal_distortion.png": "Concentric-ripple normal map for the refraction/transition effect (extra).", "fog_noise.png": "Tileable greyscale cloud noise for scrolling fog.",
 "red_particle.png": "Soft red glow sprite.", "ash_particle.png": "Irregular grey ash flake.", "dust_particle.png": "Very soft dust puff.", "ember_particle.png": "White-hot ember spark.",
 "spore_particle.png": "Pale glowing spore with faint ring.", "particle_atlas_2x2.png": "2x2 atlas: red, ember / spore, ash (single draw call).",
 "fog_sprite_01.png": "Large soft fog wisp, alpha.", "fog_sprite_02.png": "Second fog wisp variant.",
 "lightning_flash_01.png": "Full-screen lightning flash overlay (alpha), variant 1.", "lightning_flash_02.png": "Lightning flash overlay, variant 2.", "lightning_flash_03.png": "Lightning flash overlay, variant 3.",
 "code_carnival_logo.png": "Original event logo: broken ferris-wheel portal emblem with </> core, title, 'AI STUDENT CHAPTER'.", "title_texture.png": "Transparent 'CODE CARNIVAL' title treatment.",
 "red_glow.png": "Soft red radial glow sprite.", "film_grain.png": "Tileable 512 px retro film grain (alpha).", "vignette.png": "Dark vignette overlay, 16:9.",
 "transition_portal.png": "Iris overlay: opaque outside, torn glowing hole in the centre; scale up/down to wipe.", "cursor_particle.png": "64 px glowing cursor particle.",
}
AUDIOPURPOSE = {
 "ambient_forest.wav": "Looping night-forest bed: filtered noise, creaks, leaf rustles.", "dark_drone.wav": "Looping detuned low drone with slow filter sweep.",
 "electric_crackle.wav": "One-shot electrical crackle with mains hum.", "portal_open.wav": "One-shot rising sweep then tearing burst/boom at ~4.2 s.",
 "portal_transition.wav": "One-shot whoosh for page transitions.", "cinematic_impact.wav": "One-shot sub-boom hit with crack and long tail.",
 "wind_ambience.wav": "Looping gusting wind with faint whistle.",
}


def kb(p): return f"{os.path.getsize(p)/1024:.0f} KiB"


def glb_info(p):
    js, binb = read_glb(p)
    import numpy as np
    from validate_glb import accessor_data
    uniq = inst = 0; pts = 0
    mesh_tris = []
    for m in js["meshes"]:
        t = 0
        for pr in m["primitives"]:
            if pr.get("mode", 4) == 0: pts += js["accessors"][pr["attributes"]["POSITION"]]["count"]
            elif "indices" in pr: t += js["accessors"][pr["indices"]]["count"] // 3
        mesh_tris.append(t); uniq += t
    inst = sum(mesh_tris[n["mesh"]] for n in js["nodes"] if "mesh" in n and "mesh" in n)
    verts = sum(js["accessors"][pr["attributes"]["POSITION"]]["count"] for m in js["meshes"] for pr in m["primitives"])
    mats = [m["name"] for m in js.get("materials", [])]
    texs = sorted({i["uri"].split("/")[-1] for i in js.get("images", [])})
    return dict(uniq=uniq, inst=inst, pts=pts, verts=verts, nodes=len(js["nodes"]), meshes=len(js["meshes"]), mats=mats, texs=texs,
                anims=[(a["name"], round(float(max(accessor_data(js, binb, s["input"]).max() for s in a["samplers"])), 1)) for a in js.get("animations", [])],
                names=[n["name"] for n in js["nodes"]])


def img_info(p):
    im = Image.open(p); return f"{im.width}x{im.height} {im.mode}"


def build():
    glbs = sorted(glob.glob(os.path.join(ROOT, "models", "**", "*.glb"), recursive=True))
    info = {os.path.basename(g): (os.path.relpath(g, ROOT), glb_info(g), os.path.getsize(g)) for g in glbs}
    pngs = sorted(glob.glob(os.path.join(ROOT, "textures", "**", "*.png"), recursive=True) + glob.glob(os.path.join(ROOT, "graphics", "*.png")))
    webps = sorted(glob.glob(os.path.join(ROOT, "**", "*.webp"), recursive=True))
    wavs = sorted(glob.glob(os.path.join(ROOT, "audio", "*.wav")))

    # ------------------------------------------------------------- MANIFEST
    L = ["# Asset Manifest", "", "Generated from the files actually present in this pack (sizes, dimensions and counts were read back from disk).", "",
         "## 3D models (.glb)", "", "| File | Purpose | Unique tris | Instanced tris | Points | Size |", "|---|---|---:|---:|---:|---:|"]
    for n, (rel, i, sz) in info.items():
        L.append(f"| `{rel}` | {PURPOSE.get(n,'')} | {i['uniq']:,} | {i['inst']:,} | {i['pts']:,} | {sz/1024:.0f} KiB |")
    L += ["", "*Unique tris* = geometry stored in the file. *Instanced tris* = what is drawn once every node instance is counted (forest/debris reuse meshes).", "",
          "Also: `models/scene_layout.json` - placement, yaw, scale and camera for the hero scene (read by the preview renderer and by `animations/ExampleScene.jsx`).", "",
          "## Textures and graphics (.png)", "", "| File | Format / size | Purpose | Disk |", "|---|---|---|---:|"]
    for p in pngs:
        n = os.path.basename(p)
        L.append(f"| `{os.path.relpath(p, ROOT)}` | PNG {img_info(p)} | {TEXPURPOSE.get(n,'')} | {kb(p)} |")
    L += ["", "## WebP web-delivery copies", "", "Same filenames as the PNG with a `.webp` extension (lossy q88-90). Use them for colour maps in production; keep PNG for normal/roughness data.", ""]
    for p in webps:
        L.append(f"- `{os.path.relpath(p, ROOT)}` ({img_info(p)}, {kb(p)})")
    L += ["", "## Audio (.wav, 44.1 kHz 16-bit mono)", "", "| File | Duration | Loop? | Purpose | Disk |", "|---|---:|---|---|---:|"]
    for p in wavs:
        w = wave.open(p); d = w.getnframes() / w.getframerate(); n = os.path.basename(p)
        loop = "yes (seamless crossfade)" if n in ("ambient_forest.wav", "dark_drone.wav", "wind_ambience.wav") else "no"
        L.append(f"| `audio/{n}` | {d:.1f}s | {loop} | {AUDIOPURPOSE[n]} | {kb(p)} |")
    L += ["", "## Lighting, animation and source", "",
          "| File | Purpose |", "|---|---|",
          "| `lighting/lighting_forest.json`, `lighting_portal.json`, `lighting_red_alert.json` | The three lighting presets (colours, fog, intensities, pulse/flicker, bloom hints). |",
          "| `lighting/lighting_presets.js` | `applyLightingPreset(THREE, scene, url)` - builds the lights/fog from a preset. |",
          "| `source/blender/build_lighting_blends.py` | Run in Blender to create `lighting_forest/portal/red_alert.blend` from the JSON presets. |",
          "| `source/blender/assemble_scene.py` | Run in Blender to import all GLBs at their layout positions and save `CodeCarnival_scene.blend`. |",
          "| `source/blender/procedural_generators/` | The Python generators that produced every model, texture, graphic and sound. Re-run to regenerate / tweak. |",
          "| `animations/codecarnival-animations.js` | Procedural animation helpers (see ANIMATION_GUIDE.md). |",
          "| `animations/ExampleScene.jsx` | React Three Fiber integration sketch (untested). |",
          "| `documentation/preview_render.png` | Software-rendered preview of the assembled hero scene. |", "",
          "## Honest limitations", "",
          "- **No `.blend` files are included.** Blender was not available in the generation environment. The `.blend` lighting files named in the brief can be produced by running `source/blender/build_lighting_blends.py` (and the scene via `assemble_scene.py`); those scripts were syntax-checked but never run in Blender.",
          "- **Models were generated procedurally with a custom Python glTF writer, not sculpted in Blender.** They are low-poly stylised geometry; every file was parsed back and structurally validated, and the whole scene was rasterised by a custom software renderer for the preview. They have **not** been loaded in three.js or a glTF viewer.",
          "- The JS helpers were checked with Node syntax checks and stub-based unit tests only, not in a browser.",
          "- `preview_render.png` comes from a simple software rasteriser (no true PBR, shadows or real bloom). Expect the live Three.js scene to look different (generally better lit, with real-time animation).",
          "- Models use UV tiling/texture paths relative to the `.glb` (`../../textures/...`). Keep the folder layout intact, or re-point the URIs.",
          "- Compressed GPU textures (KTX2) and Draco/meshopt were not produced (no tools offline); WebP copies are provided instead.", ""]
    open(out("documentation", "ASSET_MANIFEST.md"), "w").write("\n".join(L))

    # ------------------------------------------------------------- MODEL DETAILS
    L = ["# Model Details", "", "Units: metres. +Y up. glTF 2.0 right-handed. All object origins sit at logical pivots (tree base, vine anchor, portal centre, etc.); transforms are baked or expressed as node TRS (none are left as matrices).", "",
         "Portal centre in scene space is `(0, 4.9, -10)`; the rift is an ellipse of half-width 2.7 m and half-height 4.7 m facing +Z. Vertex colours (`COLOR_0`) are used for tinting, so enable `vertexColors` on materials where the loader does not do it automatically (three.js GLTFLoader does).", ""]
    for n, (rel, i, sz) in info.items():
        L += [f"## {n}", "", f"- Path: `{rel}`  |  Size: {sz/1024:.0f} KiB", f"- Unique triangles: **{i['uniq']:,}**  |  Instanced (drawn) triangles: **{i['inst']:,}**  |  Vertices: {i['verts']:,}  |  Point sprites: {i['pts']:,}",
              f"- Nodes: {i['nodes']}  |  Meshes: {i['meshes']}  |  Materials: {', '.join(f'`{m}`' for m in i['mats']) or '-'}",
              f"- Textures referenced: {', '.join(f'`{t}`' for t in i['texs']) or 'none (vertex colours / factors only)'}"]
        if i["anims"]:
            L.append("- Animation clips: " + ", ".join(f"`{a}` ({d}s)" for a, d in i["anims"]))
        shown = i["names"][:14]
        L.append("- Node names: " + ", ".join(f"`{x}`" for x in shown) + (f" ... (+{len(i['names'])-14} more)" if len(i["names"]) > 14 else ""))
        L += ["", PURPOSE.get(n, ""), ""]
    tot_u = sum(i["uniq"] for _, i, _ in info.values()); tot_i = sum(i["inst"] for _, i, _ in info.values())
    L += ["## Budget summary", "", f"- Sum of unique triangles over all 20 GLBs: **{tot_u:,}**.",
          f"- Triangles drawn if every GLB is loaded and placed by `scene_layout.json` at once: roughly **{tot_i:,}** (counts every instance, before any culling).",
          "- Far-field forest uses lower-detail LOD2 trees (fewer sides, branches and segments); near-field uses LOD1. Per-mesh counts are in the forest entry above.", "- Everything is a handful of draw calls per file; use `InstancedMesh` for the forest if you need to cut draw calls further.", ""]
    open(out("documentation", "MODEL_DETAILS.md"), "w").write("\n".join(L))

    # ------------------------------------------------------------- MATERIAL GUIDE
    L = ["# Material Guide", "",
         "All materials are glTF 2.0 metallic-roughness. Texture URIs are relative to each .glb. Colour maps are sRGB; normal/roughness maps are linear data.", "",
         "| Material | Used by | Maps / factors | Notes |", "|---|---|---|---|",
         "| `bark_dead` | forest, dead trees, vines, props | base `bark_basecolor.png`, normal `bark_normal.png`, roughness 0.95 | Triplanar not needed; UVs are cylindrical along each tube. |",
         "| `ground_forest` | ground | base `ground_basecolor.png`, normal `ground_normal.png`, roughness 0.97 | UVs tile 14x; vertex colour darkens edges and reds the clearing. |",
         "| `rock_dark` | debris, floating rocks, rubble | vertex colours only | Underside tinted red by vertex colour. |",
         "| `vine_leaf_card` | vines | base `vines_basecolor.png` (RGBA), alphaMode MASK 0.4, double-sided | Two crossed cards per vine. |",
         "| `portal_surface` | portal_main | emissive `portal_emission.png`, strength 1.35, double-sided | Rotate the emissive map's UV for the swirl (see ANIMATION_GUIDE). |",
         "| `portal_halo` | portal_main | vertex-colour alpha, unlit, BLEND | Scale pulses; keep `depthWrite=false`. |",
         "| `ring_energy`, `ring_obsidian` | portal_ring | emissive factors 0.8-0.85 | Bloom pass makes them glow. |",
         "| `crack_glow` | portal_cracks | emissive 2.0 + vertex alpha, BLEND | Core vertices are bright, edge vertices alpha 0. |",
         "| `lightning_core` | lightning | emissive 4.0 | Intended to bloom hard; toggle node visibility. |",
         "| `energy_ribbon` | ribbons | emissive 1.5, vertex alpha, BLEND, double-sided | |",
         "| `crystal_red` | crystals | emissive 1.7, BLEND 0.82 | Per-crystal vertex tint. |",
         "| `lamp_bulb`, `lamp_glass`, `wire_spark` | props | emissive 4-8 / 1.7 | Flicker via `animations/codecarnival-animations.js`. |",
         "| `silhouette_unlit` | distant forest | KHR_materials_unlit, vertex colours | No lighting; fog should still be applied (`fog:true`). |",
         "| `fog_points`, `energy_points` | particle files | KHR_materials_unlit, BLEND | POINTS primitives - replace with `makeParticleMaterial`. |", "",
         "Extensions used: `KHR_materials_unlit`, `KHR_materials_emissive_strength` (both supported by three.js r150+).", "",
         "## Texture mapping table", "", "| Texture | Resolution | Used by |", "|---|---|---|"]
    use = {}
    for n, (rel, i, sz) in info.items():
        for t in i["texs"]: use.setdefault(t, []).append(n)
    for p in pngs:
        n = os.path.basename(p)
        L.append(f"| `{n}` | {img_info(p)} | {', '.join(use.get(n, [])) or 'runtime (shader / overlay / UI) - not baked into a GLB'} |")
    L += ["", "## Using the loose effect textures at runtime", "",
          "- `portal_noise.png`, `energy_distortion.png`: scrolling UV offsets in a custom ShaderMaterial for the portal swirl (RG channels = flow vector, subtract 0.5).",
          "- `fog_noise.png`: sample twice with different scroll speeds for volumetric-looking fog cards; multiply by `fog_sprite_*.png`.",
          "- `portal_distortion.png`: use as a refraction normal map on a full-screen quad for the transition.", "- `cracked_ground.png`: ground decal under the portal (additive or as emissive map on a plane at y=0.03).",
          "- `lightning_flash_*.png`, `vignette.png`, `film_grain.png`, `red_glow.png`, `transition_portal.png`, `cursor_particle.png`: plain DOM/CSS or screen-space overlays.", ""]
    open(out("documentation", "MATERIAL_GUIDE.md"), "w").write("\n".join(L))

    # ------------------------------------------------------------- ANIMATION GUIDE
    clip_lines = []
    for n, (rel, i, sz) in info.items():
        if i["anims"]: clip_lines.append(f"- `{n}`: " + ", ".join(f"`{a}`" for a, _ in i["anims"]))
    L = ["# Animation Guide", "",
         "Two layers: (1) glTF clips baked into the GLBs for rigid motion that loops cleanly, (2) procedural JS in `animations/codecarnival-animations.js` for everything else (cheaper than baking).", "",
         "## glTF clips (play all with `playClips`)", ""] + clip_lines + [
         "", "All clips loop. Vine/branch sway amplitudes are 3-6 degrees; ring spins run 14-60 s per revolution so they read as slow drift.", "",
         "## Effect -> how to animate", "",
         "| Effect (brief) | Method | Where |", "|---|---|---|",
         "| Floating portal energy | `makeParticleMaterial(THREE,{mode:'swirl'})` on `portal_particles.glb`; ribbons use their spin clips | JS + clips |",
         "| Moving vines | `vine_sway_1..3` clips | `environment_vines.glb` |",
         "| Swaying branches | `branch_sway` clip | `dead_branches.glb` |",
         "| Lightning flashes | `LightningController` (random 2.5-9 s gaps; 4-step flicker pattern; drives bolt visibility, a PointLight and the `lightning_flash_*.png` overlay) | JS |",
         "| Floating embers | `makeParticleMaterial(THREE,{mode:'rise', map: ember_particle.png})` on any point cloud | JS |",
         "| Pulsating portal | `portal_pulse` clip **or** `PortalPulse` (also pulses the light, spins the emissive map) | clip / JS |",
         "| Slowly moving fog | `environment_fog_particles.glb` with `mode:'drift'`; optionally scroll `fog_noise.png` on fog cards | JS |",
         "| Environmental particles (ash, dust, spores) | Reuse a point cloud with `ash_/dust_/spore_particle.png`; `mode:'rise'` or `'drift'` | JS |",
         "| Floating debris / rocks | `FloatingProps(root)` reads `floatAmp`, `floatSpeed`, `spin` from node extras | JS |",
         "| Lamp / spark flicker | `flicker(nodes, t)` on nodes with `userData.flicker` | JS |", "",
         "## Node extras (three.js exposes them as `userData`)", "",
         "`floatAmp`, `floatSpeed`, `spin` (debris, rocks) - `flicker` (lamp bulb, sparks) - `pulse` (crystals) - `flash` (lightning bolts) - `sway` (vines) - `lod` (forest trees) - `light` (suggested light settings on the lamp bulb).", "",
         "## Minimal usage", "", "```js",
         "import * as THREE from 'three';", "import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';",
         "import { playClips, FloatingProps, LightningController, makeParticleMaterial, setPointScale, AudioManager } from './animations/codecarnival-animations.js';", "",
         "const gltf = await new GLTFLoader().loadAsync('/CodeCarnival_3D_Assets/models/environment/environment_vines.glb');",
         "scene.add(gltf.scene); const mixer = playClips(THREE, gltf);",
         "// per frame: mixer.update(dt); floating.update(dt); lightning.update(dt); material.uniforms.uTime.value = t;", "```", "",
         "## Particle point clouds", "",
         "`portal_particles.glb` and `environment_fog_particles.glb` contain a POINTS primitive with custom attributes `_SIZE` (diameter in metres) and `_PHASE` (random 0-2pi). three.js exposes them as `geometry.attributes._size` / `_phase` (lower-cased); the shader in `makeParticleMaterial` expects exactly those names. Find the mesh, swap its material:", "",
         "```js", "gltf.scene.traverse(o => { if (o.isPoints) { o.material = makeParticleMaterial(THREE, { map: tex, mode: 'swirl', size: 1 }); } });", "```", "",
         "## Audio", "", "`AudioManager` stays silent until a pointer/key/touch event unlocks audio, and only plays after the visitor calls `enable()` (e.g. from a sound toggle button). Loops fade in/out over 1.2 s; one-shots: `shot('open')`, `shot('impact')`, `shot('transition')`, `shot('crackle')`.", ""]
    open(out("documentation", "ANIMATION_GUIDE.md"), "w").write("\n".join(L))

    # ------------------------------------------------------------- LICENSES
    L = ["# Licenses and Attribution", "",
         "## Original content", "",
         "Every model, texture, graphic and audio file in this pack was generated procedurally by the Python scripts in `source/blender/procedural_generators/` (numpy, scipy, Pillow). No third-party meshes, textures, samples or recordings were downloaded or used. The creator of the pack (Anthropic's Claude, on behalf of the requesting user) asserts no restrictions on this original material; the requesting user may use, modify and redistribute it, including commercially, for the Code Carnival project. Review the work yourself before relying on it legally; this is not legal advice.", "",
         "## Third-party components", "",
         "| Component | Used for | License |", "|---|---|---|",
         "| Poppins Bold / Medium (Indian Type Foundry) | Lettering in `code_carnival_logo.png`, `title_texture.png`, rasterised into the PNGs | SIL Open Font License 1.1 - embedding rendered glyphs in images is permitted. Font files are **not** redistributed. |",
         "| numpy, scipy, Pillow (build tools only) | Generating assets | BSD-style / HPND - not distributed in the pack. |", "",
         "## Brand / IP notes", "",
         "- The look is *inspired by* generic 1980s supernatural-horror atmosphere (dark forest, red lightning, fog). It contains no characters, logos, title lettering, music or scenes from any existing show. The logo is an original ferris-wheel/portal emblem with a code-bracket core; the title uses an unrelated typeface.",
         "- Audio is fully synthesised (noise, oscillators, convolution reverb); no samples.", "",
         "## What you should still verify", "",
         "- Run a trademark/brand check on the name and emblem before public launch.", "- If you replace the Poppins lettering, keep the font's license with your source files.", ""]
    open(out("documentation", "LICENSES.md"), "w").write("\n".join(L))

    # ------------------------------------------------------------- README
    nfiles = sum(len(f) for _, _, f in os.walk(ROOT))
    R = ["# CodeCarnival_3D_Assets", "",
         "Procedurally generated cinematic asset pack for the Code Carnival opening scene: a dead forest, a red dimensional rift, lightning, fog and embers. All content is original.", "",
         "![preview](documentation/preview_render.png)", "",
         "*Preview: software-rendered from the shipped GLBs (see limitations in `documentation/ASSET_MANIFEST.md`).*", "",
         "## Contents", "", "```", "models/        20 .glb + scene_layout.json (environment/ portal/ trees/ props/ effects/)",
         "textures/      PBR maps, portal + noise maps, particle sprites, lightning overlays (PNG, WebP for colour maps)",
         "graphics/      logo, title, glow, grain, vignette, portal transition, cursor particle",
         "audio/         7 original .wav (3 seamless loops)", "animations/    codecarnival-animations.js, ExampleScene.jsx",
         "lighting/      3 presets (.json) + loader; .blend builders in source/blender/",
         "source/blender/ bpy scripts + procedural_generators/ (full Python source of every asset)", "documentation/ manifest, model details, material guide, animation guide, licenses, preview", "```", "",
         "## Quick start (React + three.js)", "",
         "1. Copy this folder to your site's `public/` directory so it is served at `/CodeCarnival_3D_Assets/` (keep the structure - GLBs reference textures with `../../textures/...`).",
         "2. `npm i three @react-three/fiber @react-three/drei`", "3. Start from `animations/ExampleScene.jsx` (an **untested** sketch) and load models via `models/scene_layout.json`.",
         "4. Add `animations/codecarnival-animations.js` helpers for clips, particles, lightning, floating props and opt-in audio.", "5. Apply a lighting preset with `lighting/lighting_presets.js` (`forest` for the intro, `portal` when it opens, `red_alert` for transitions).", "",
         "Suggested sequence: forest preset + `ambient_forest`/`wind_ambience` -> `electric_crackle` and lightning flashes -> `portal_open` while the halo scales up and lighting switches to `portal` -> `cinematic_impact` + `title_texture.png` -> `transition_portal.png` + `portal_transition` to leave the scene.", "",
         "## Important notes", "",
         "- **No .blend files are shipped** (Blender wasn't available when this was generated). Run `blender -b -P source/blender/build_lighting_blends.py` for the three lighting .blend files and `assemble_scene.py` for a full scene file. Those scripts have not been executed.",
         "- Models, JS and the example scene have not been run in a real browser or three.js; they were validated structurally (GLB parser, Node stub tests). Test early and tweak materials/intensities in your renderer.",
         "- Audio is silent by default - use `AudioManager`, and only enable it after a user gesture.", "- Regenerate or tweak anything by running the scripts in `source/blender/procedural_generators/` (`gen_*.py`, then `make_layout.py`, `build_docs.py`).", "",
         f"Total files: {nfiles}", ""]
    open(out("README.md"), "w").write("\n".join(R))
    print("docs written;", nfiles, "files")


if __name__ == "__main__":
    build()
