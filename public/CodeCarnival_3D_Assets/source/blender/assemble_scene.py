"""assemble_scene.py - run inside Blender (>= 3.6):   blender -b -P assemble_scene.py
Imports every .glb listed in models/scene_layout.json, groups each into a collection under an Empty carrying the
layout transform, and saves source/blender/CodeCarnival_scene.blend.
NOTE: written without Blender available - not executed by the author. Report/fix any API drift for your Blender version."""
import bpy, json, os, math

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.abspath(os.path.join(HERE, "..", ".."))
layout = json.load(open(os.path.join(PACK, "models", "scene_layout.json")))

bpy.ops.wm.read_factory_settings(use_empty=True)
for i, pl in enumerate(layout["placements"]):
    name = f"{i:02d}_{os.path.splitext(os.path.basename(pl['file']))[0]}"
    col = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(col)
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=os.path.join(PACK, pl["file"]))
    new = [o for o in bpy.data.objects if o not in before]
    # glTF is Y-up, Blender Z-up: (x, y, z) -> (x, -z, y). A yaw about glTF +Y is a rotation about Blender +Z.
    x, y, z = pl["position"]
    root = bpy.data.objects.new(name + "_root", None)
    col.objects.link(root)
    root.location = (x, -z, y)
    root.rotation_euler = (0, 0, pl["yaw_radians"])
    root.scale = (pl["scale"],) * 3
    for o in new:
        for c in list(o.users_collection):
            c.objects.unlink(o)
        col.objects.link(o)
        if o.parent is None:
            o.parent = root
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "CodeCarnival_scene.blend"))
print("saved CodeCarnival_scene.blend")
