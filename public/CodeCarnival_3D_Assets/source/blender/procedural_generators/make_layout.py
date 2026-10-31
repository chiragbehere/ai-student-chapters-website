"""Writes models/scene_layout.json: where each GLB sits in the hero scene (also used by the preview renderer)."""
import json
import numpy as np
from cc_common import ROOT, out
from gen_models_env import PORTAL_C, terrain


def Y(x, z, off=0.0):
    return round(float(terrain(x, z)) + off, 3)


def layout():
    P = [round(float(v), 3) for v in PORTAL_C]
    L = []

    def add(f, pos=(0, 0, 0), yaw=0.0, scale=1.0, note=""):
        L.append({"file": f, "position": [round(float(v), 3) for v in pos], "yaw_radians": round(float(yaw), 3), "scale": scale, "note": note})
    add("models/environment/environment_ground.glb", note="origin; 92 x 92 m")
    add("models/environment/environment_distant_forest.glb", note="background silhouettes, unlit")
    add("models/environment/environment_dark_forest.glb", note="trees + brush baked at scene positions")
    add("models/trees/environment_dead_trees.glb", (0, -0.35, -38), note="hero dead-tree row behind the portal")
    add("models/environment/environment_vines.glb", note="canopy branches with hanging vines")
    add("models/environment/environment_floating_debris.glb")
    add("models/portal/portal_main.glb", P, note="portal centre; faces +Z")
    add("models/portal/portal_ring.glb", P)
    add("models/portal/portal_cracks.glb", P)
    add("models/portal/portal_particles.glb", P)
    add("models/effects/energy_ribbons.glb", P)
    add("models/effects/red_lightning_effect.glb", note="bolts hang from y~30; toggle visibility for flashes")
    L[-1]["preview_hide_nodes"] = ["lightning_bolt_01", "lightning_bolt_03", "lightning_bolt_05"]
    add("models/environment/environment_fog_particles.glb")
    def prop(f, x, z, yaw=0.0, scale=1.0, dy=0.0, note=""):
        add(f, (x, Y(x, z, dy), z), yaw, scale, note)
    prop("models/props/abandoned_sign.glb", -3.6, -1.2, yaw=0.45, dy=-0.05, note="yaw turns the board toward the corridor")
    prop("models/props/broken_electric_pole.glb", 6.8, -3.0, yaw=-0.7)
    prop("models/props/old_lamp.glb", -7.2, -5.5, yaw=0.0, note="arm reaches +X toward the corridor")
    add("models/props/floating_rocks.glb", (-11.0, 1.0, -9.0), 0.4, 1.0, "hovering cluster; animate via node extras floatAmp/floatSpeed")
    add("models/props/floating_rocks.glb", (12.5, 1.5, -15.0), 2.2, 0.8)
    prop("models/props/dead_branches.glb", -5.0, -8.0, yaw=0.5, dy=0.08, note="lying on the ground")
    prop("models/props/dead_branches.glb", 4.0, -2.2, yaw=-1.1, dy=0.08)
    prop("models/props/mysterious_crystals.glb", 3.7, -8.2)
    prop("models/props/mysterious_crystals.glb", -4.0, -9.3, scale=0.8)
    prop("models/props/forest_roots.glb", -10.0, -2.0, dy=-0.1)
    prop("models/props/forest_roots.glb", 10.5, -13.0, yaw=1.0, dy=-0.1)
    cam = {"position": [0.0, 1.7, 11.5], "target": [0.0, 4.2, -10.0], "fov_y_degrees": 58}
    doc = {"units": "metres, +Y up, portal faces +Z", "portal_centre": P, "camera": cam, "placements": L}
    json.dump(doc, open(out("models", "scene_layout.json"), "w"), indent=1)
    return doc


if __name__ == "__main__":
    d = layout()
    print(len(d["placements"]), "placements")
