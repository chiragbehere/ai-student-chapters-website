# Model details

All models: glTF 2.0 binary (.glb), metres, Y-up, -Z into the screen, transforms applied, origins documented per file. Textures are referenced as external relative PNG URIs (keep the folder layout). Counts below were measured by re-parsing the written GLB files (`source/lib_glb.py: inspect_glb`).

'Unique tris' = triangles stored in the file; 'Rendered tris' = triangles drawn once instancing is expanded; 'Points' = point-primitive vertices.

| File | Size | Nodes | Unique tris | Rendered tris | Points | Materials | Purpose |
|---|---|---|---|---|---|---|---|
| `environment/environment_dark_forest.glb` | 178 KB | 74 | 4,959 | 68,335 | 0 | bark | Main forest: 56 instanced twisted dead trees (4 variants), 8 fallen logs, 10 stumps, world-placed, portal clearing + camera corridor kept open. |
| `environment/environment_ground.glb` | 558 KB | 1 | 20,000 | 20,000 | 0 | ground | Uneven 120x120 m heightfield with fissure trenches and a crater under the portal; 2nd UV set maps cracked_ground.png as glowing cracks around the portal. |
| `environment/environment_fog_particles.glb` | 49 KB | 11 | 2 | 10 | 2,140 | fog_sheet, particle | 5 scrolling fog sheets + 5 point clouds (fog wisps, dust, ash, embers, spores). Points carry a _SEED attribute and an extras.sprite path. |
| `environment/environment_floating_debris.glb` | 48 KB | 73 | 124 | 2,080 | 0 | debris | 72 instanced floating shards, rock chunks, planks and leaf cards (4 meshes), each with float/spin extras. |
| `trees/environment_dead_trees.glb` | 144 KB | 4 | 4,696 | 4,696 | 0 | bark | The 4 hero dead-tree variants as separate nodes for close-ups or re-instancing. |
| `environment/environment_vines.glb` | 187 KB | 39 | 4,280 | 4,280 | 0 | vines, bark | 28 hanging vines + 10 hanging root bundles; each is its own node with origin at the anchor, plus a _SWAY vertex attribute for shader sway. |
| `environment/environment_distant_forest.glb` | 84 KB | 139 | 1,329 | 19,971 | 0 | silhouette | 3 parallax layers (near/mid/far) of low-poly silhouette trees, unlit, tinted toward the fog colour. |
| `portal/portal_main.glb` | 54 KB | 6 | 2,152 | 4,584 | 0 | portal_swirl, portal_void, portal_glow | Portal body: void disc, 3 counter-rotating swirl discs (portal_emission.png, unlit alpha-blend) and a pulsing core glow. |
| `portal/portal_ring.glb` | 112 KB | 7 | 3,692 | 3,692 | 0 | portal_ring | Broken stone-like ring, inner ring, 28 radial shards, and 3 floating arcs; emissive red. |
| `portal/portal_cracks.glb` | 125 KB | 4 | 3,460 | 3,460 | 0 | glow_ribbon | Recursive branching glowing cracks in three weights (primary/secondary/fine) as soft-edged ribbons. |
| `portal/portal_particles.glb` | 57 KB | 2 | 0 | 0 | 2,820 | particle | 2,400 orbiting red particles + 420 bright sparks (point primitives). |
| `effects/red_lightning_effect.glb` | 185 KB | 7 | 5,376 | 5,376 | 0 | glow_ribbon | 6 independent bolt variants (midpoint-displaced, crossed double ribbon, with side branches) for random strikes. |
| `effects/energy_ribbons.glb` | 63 KB | 7 | 1,704 | 1,704 | 0 | glow_ribbon | 6 spiralling soft-edged energy ribbons around the portal. |
| `props/abandoned_sign.glb` | 7 KB | 4 | 45 | 45 | 0 | wood_old | Leaning post + swinging board (hinge at origin) + broken plank. |
| `props/broken_electric_pole.glb` | 18 KB | 5 | 354 | 354 | 0 | wood_old, metal_rust, wire | Leaning splintered pole, cross-arm and two cut cables. |
| `props/old_lamp.glb` | 9 KB | 4 | 204 | 204 | 0 | metal_rust, lamp_glass | Rusted street lamp with hood and emissive glass (flicker + light hint in extras). |
| `props/floating_rocks.glb` | 259 KB | 8 | 2,240 | 2,240 | 0 | rock | 7 faceted rocks of descending size, glowing undersides (vertex colour). |
| `props/dead_branches.glb` | 39 KB | 7 | 1,026 | 1,026 | 0 | bark | 6 fallen branch assemblies, individually swaying. |
| `props/mysterious_crystals.glb` | 34 KB | 4 | 270 | 270 | 0 | crystal | 3 faceted crystal clusters, translucent red with glow gradient (pulse + light hint). |
| `props/forest_roots.glb` | 93 KB | 6 | 3,054 | 3,054 | 0 | bark | 5 root bundles to place around tree bases. |

**Whole scene (every model loaded once, as in the preview): about 145,381 rendered triangles.** The static forest + ground + silhouettes dominate (≈108k of that); this is fine for desktop GPUs but heavy for low-end mobile — see 'Performance' below.

## Performance notes
- The preview scene draws ~127k triangles. For mobile, drop `environment_distant_forest` layers `mid`/`far`, halve the tree count (delete every other `tree_NN` node), and use the 512 px WebP textures you generate from the PNGs.
- Dense geometry is the ground (20,000 tris). If needed, regenerate with `n_cells = 60` in `source/gen_models.py` (7,200 tris).
- Transparent/unlit overlap (portal swirls, ribbons, fog sheets) is the main fill-rate cost.
- Not Draco/meshopt compressed (no tooling available offline). Run `gltf-transform optimize` before shipping if you want that.

## Origins and independent objects
Every independently animated element is its own node: each tree, vine, root, debris piece, floating rock, sign board (origin = hinge), portal swirl layer, ring, crack set, lightning bolt and ribbon. Per-node animation parameters are stored in glTF `extras` (Three.js: `object.userData`).
