# Material guide

All materials are glTF metallic-roughness (Three.js `MeshStandardMaterial`). `KHR_materials_unlit` is the only extension used.

| Material | Used by | Textures / factors | Notes |
|---|---|---|---|
| `bark` | trees, branches, roots | `pbr/bark_basecolor`, `bark_normal`, `bark_roughness` (UV0, repeat); metallic 0, roughness 1 | Vertex colour darkens toward the top. UVs are 0.85 tiles per metre along the length. |
| `wood_old` | sign, pole | bark textures, base tint ~(0.78,0.66,0.6) | |
| `ground` | ground | `pbr/ground_*` on UV0 (1 tile / 6 m); **emissive** `pbr/cracked_ground` on **TEXCOORD_1** (clamp, covers 36 m around the portal) | Intensity of emissive is the portal 'crack glow'; animate `emissiveIntensity`. |
| `vines` | vines | `pbr/vines_basecolor` (+ same map as emissive x0.22), double-sided | `_SWAY` vertex attribute drives sway. |
| `portal_swirl` / `portal_glow` / `portal_void` | portal | `portal/portal_emission` (alpha-blend, unlit, double-sided) | Three layers counter-rotate; use additive blending in Three.js for a hotter look (set `blending = AdditiveBlending`). |
| `portal_ring` | ring | emissive (0.85,0.09,0.04), roughness 0.55 | Vertex colour modulates the emissive 'veins'. |
| `glow_ribbon` | cracks, lightning, ribbons | unlit, alpha-blend, vertex colour RGBA; centre vertex opaque, edge vertices alpha 0 | Gives soft edges with no texture. |
| `particle` / `fog_sheet` | point clouds / fog | points use `extras.sprite`; fog uses `particles/fog_noise` | Replace the point material with `makeParticleMaterial()`. |
| `crystal`, `rock`, `debris`, `metal_rust`, `lamp_glass`, `wire`, `silhouette` | props | factors only + vertex colour | `silhouette` is unlit and pre-tinted toward the fog colour so it reads as depth. |

## Texture conventions
- Normal maps: tangent-space, OpenGL (+Y up), as glTF requires. Roughness is a grayscale map read from the G channel.
- Seam check (mean wrap-seam difference ÷ mean neighbour difference, ≈1 means seamless): bark 1.00, ground 1.15, portal_noise 0.99, fog_noise 0.66. Ground has a very slight seam visible at close range.
- PNGs under `textures/` that compress well also have a `.webp` sibling (lossy q88; normal/distortion maps lossy q90; siblings that were not clearly smaller, plus those of portal_noise, fog_noise, energy_distortion and the roughness maps, were removed to keep the pack under the 30 MB upload limit). The GLBs reference the PNGs; to ship WebP, rewrite the URIs or use the WebP files via a Three.js `TextureLoader` override. Colour maps are sRGB, data maps (normal, roughness, noise, distortion) must be loaded as linear/non-colour.
- Largest files are the noise-heavy maps (normals, energy_distortion, portal_emission, 2-3 MB PNG each). Use the WebP versions or KTX2 for production if bandwidth matters.
