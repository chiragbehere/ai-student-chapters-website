"""build_lighting_blends.py - run inside Blender (>= 3.6):   blender -b -P build_lighting_blends.py
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
