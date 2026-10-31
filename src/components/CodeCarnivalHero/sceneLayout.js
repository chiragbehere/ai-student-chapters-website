export const sceneLayout = {
 "units": "metres, +Y up, portal faces +Z",
 "portal_centre": [
  0.0,
  4.9,
  -10.0
 ],
 "camera": {
  "position": [
   0.0,
   1.7,
   11.5
  ],
  "target": [
   0.0,
   4.2,
   -10.0
  ],
  "fov_y_degrees": 58
 },
 "placements": [
  {
   "file": "models/environment/environment_ground.glb",
   "position": [
    0.0,
    0.0,
    0.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": "origin; 92 x 92 m"
  },
  {
   "file": "models/environment/environment_distant_forest.glb",
   "position": [
    0.0,
    0.0,
    0.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": "background silhouettes, unlit"
  },
  {
   "file": "models/environment/environment_dark_forest.glb",
   "position": [
    0.0,
    0.0,
    0.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": "trees + brush baked at scene positions"
  },
  {
   "file": "models/trees/environment_dead_trees.glb",
   "position": [
    0.0,
    -0.35,
    -38.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": "hero dead-tree row behind the portal"
  },
  {
   "file": "models/environment/environment_vines.glb",
   "position": [
    0.0,
    0.0,
    0.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": "canopy branches with hanging vines"
  },
  {
   "file": "models/environment/environment_floating_debris.glb",
   "position": [
    0.0,
    0.0,
    0.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": ""
  },
  {
   "file": "models/portal/portal_main.glb",
   "position": [
    0.0,
    4.9,
    -10.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": "portal centre; faces +Z"
  },
  {
   "file": "models/portal/portal_ring.glb",
   "position": [
    0.0,
    4.9,
    -10.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": ""
  },
  {
   "file": "models/portal/portal_cracks.glb",
   "position": [
    0.0,
    4.9,
    -10.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": ""
  },
  {
   "file": "models/portal/portal_particles.glb",
   "position": [
    0.0,
    4.9,
    -10.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": ""
  },
  {
   "file": "models/effects/energy_ribbons.glb",
   "position": [
    0.0,
    4.9,
    -10.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": ""
  },
  {
   "file": "models/effects/red_lightning_effect.glb",
   "position": [
    0.0,
    0.0,
    0.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": "bolts hang from y~30; toggle visibility for flashes",
   "preview_hide_nodes": [
    "lightning_bolt_01",
    "lightning_bolt_03",
    "lightning_bolt_05"
   ]
  },
  {
   "file": "models/environment/environment_fog_particles.glb",
   "position": [
    0.0,
    0.0,
    0.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": ""
  },
  {
   "file": "models/props/abandoned_sign.glb",
   "position": [
    -3.6,
    0.305,
    -1.2
   ],
   "yaw_radians": 0.45,
   "scale": 1.0,
   "note": "yaw turns the board toward the corridor"
  },
  {
   "file": "models/props/broken_electric_pole.glb",
   "position": [
    6.8,
    0.147,
    -3.0
   ],
   "yaw_radians": -0.7,
   "scale": 1.0,
   "note": ""
  },
  {
   "file": "models/props/old_lamp.glb",
   "position": [
    -7.2,
    0.178,
    -5.5
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": "arm reaches +X toward the corridor"
  },
  {
   "file": "models/props/floating_rocks.glb",
   "position": [
    -11.0,
    1.0,
    -9.0
   ],
   "yaw_radians": 0.4,
   "scale": 1.0,
   "note": "hovering cluster; animate via node extras floatAmp/floatSpeed"
  },
  {
   "file": "models/props/floating_rocks.glb",
   "position": [
    12.5,
    1.5,
    -15.0
   ],
   "yaw_radians": 2.2,
   "scale": 0.8,
   "note": ""
  },
  {
   "file": "models/props/dead_branches.glb",
   "position": [
    -5.0,
    0.156,
    -8.0
   ],
   "yaw_radians": 0.5,
   "scale": 1.0,
   "note": "lying on the ground"
  },
  {
   "file": "models/props/dead_branches.glb",
   "position": [
    4.0,
    0.329,
    -2.2
   ],
   "yaw_radians": -1.1,
   "scale": 1.0,
   "note": ""
  },
  {
   "file": "models/props/mysterious_crystals.glb",
   "position": [
    3.7,
    0.009,
    -8.2
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": ""
  },
  {
   "file": "models/props/mysterious_crystals.glb",
   "position": [
    -4.0,
    0.067,
    -9.3
   ],
   "yaw_radians": 0.0,
   "scale": 0.8,
   "note": ""
  },
  {
   "file": "models/props/forest_roots.glb",
   "position": [
    -10.0,
    -0.434,
    -2.0
   ],
   "yaw_radians": 0.0,
   "scale": 1.0,
   "note": ""
  },
  {
   "file": "models/props/forest_roots.glb",
   "position": [
    10.5,
    0.091,
    -13.0
   ],
   "yaw_radians": 1.0,
   "scale": 1.0,
   "note": ""
  }
 ]
};
export default sceneLayout;
