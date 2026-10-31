"""
Run inside Blender 3.6+ (headless):
    blender -b --python build_blend_files.py -- /path/to/CodeCarnival_3D_Assets
Imports every GLB, assembles the scene using animations/scene_layout.json, and saves:
    source/blender/codecarnival_scene.blend, lighting/lighting_forest.blend, lighting_portal.blend, lighting_red_alert.blend
STATUS: written against the Blender 3.6/4.x Python API but NOT executed during asset generation (Blender was not installed
in the build environment). The authoritative sources are the Python generators in ../ (gen_models.py etc.).
"""
import bpy, json, os, sys, math

root = os.path.abspath(sys.argv[sys.argv.index("--") + 1]) if "--" in sys.argv else os.getcwd()
layout = json.load(open(os.path.join(root, "animations", "scene_layout.json")))


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def import_all():
    for rel, p in layout["placement"].items():
        path = os.path.join(root, "models", rel)
        before = set(bpy.data.objects)
        bpy.ops.import_scene.gltf(filepath=path)
        new = [o for o in bpy.data.objects if o not in before]
        col = bpy.data.collections.new(os.path.basename(rel)[:-4]); bpy.context.scene.collection.children.link(col)
        for o in new:
            for c in o.users_collection: c.objects.unlink(o)
            col.objects.link(o)
            if o.parent is None:
                o.location = (p["position"][0], -p["position"][2], p["position"][1])  # glTF Y-up -> Blender Z-up already handled by importer; offsets added
    return


def add_light(kind, name, color, energy, loc):
    data = bpy.data.lights.new(name, kind); data.color = color; data.energy = energy
    ob = bpy.data.objects.new(name, data); ob.location = loc; bpy.context.scene.collection.objects.link(ob); return ob


def hex2rgb(h): h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def build_lighting(preset_name):
    cfg = json.load(open(os.path.join(root, "lighting", f"lighting_{preset_name}.json")))
    w = bpy.context.scene.world or bpy.data.worlds.new("World"); bpy.context.scene.world = w; w.use_nodes = True
    w.node_tree.nodes["Background"].inputs[0].default_value = (*hex2rgb(cfg["background"]), 1)
    for l in cfg["lights"]:
        if l["type"] == "point":
            x, y, z = l["position"]; add_light("POINT", l["name"], hex2rgb(l["color"]), l["intensity"] * 20, (x, -z, y))
        elif l["type"] == "directional":
            x, y, z = l["position"]; o = add_light("SUN", l["name"], hex2rgb(l["color"]), l["intensity"] * 3, (x, -z, y))
            o.rotation_euler = (math.radians(60), 0, math.radians(20))
        elif l["type"] == "spot":
            x, y, z = l["position"]; add_light("SPOT", l["name"], hex2rgb(l["color"]), l["intensity"] * 20, (x, -z, y))


for preset in ("forest", "portal", "red_alert"):
    reset(); import_all(); build_lighting(preset)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(root, "lighting", f"lighting_{preset}.blend"))
reset(); import_all(); build_lighting("forest")
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(root, "source", "blender", "codecarnival_scene.blend"))
