# njaPatcher
This tool is a reverse engineering of NJA (Ninja Ascii) file format used in many Dreamcast games. Currently the tool can generate NJA files from OBJ (OBJ 2 NJA). The tool does not intend to infringe on any rights of other software companies, and is only made with intention to move an already available process (OBJ 2 NJA) out of being restricted to Windows 98/Windows NT/Windows XP machine.

# Demo build usage, njaPatcher.js
The current repo is still in early development and is not refactored in any way, the build is only tested in Chrome. The process of transferring OBJ to NJA is entirely functional. In it's current state, the program will auto detect which type of OBJ is being loaded, and determine whether it should have a texture list, or normals list, producing different versions of NJA.

To use the demo build, first a code editor is required (live server, choose html folder), since it's not formatted into a lib yet. The user of the tool will have to manually edit booleans at the top of the script, which are as follows:

### objPath, objModelFile

The folder where OBJ files are stored (recommended to use the one already in the project folder) and the model file to be converted.

### name, custom_comment, texture_comment

Name of object in NJA file, custom comment in head of NJA file, and a string that will be transferred (even after making NJA to NJ conversions).

### unloadNormals, showVertsAsFloatingPoint

Completely remove normals from the object, print NJA with non usable denery values (used for debugging only).

### optimizeTriangleStripDetermination

Not recommended to use this function on large objects, as it will make the program hang until the model is converted, it does generally make smaller files, although it's pretty irrelevant. If the console (F12) is open before running a model with this feature, it will show each path that the last triangle strip took, in terms of reordered verts.

## OBJ requirements

Before running an OBJ through the script, various adjustments need to be made to the OBJ to get the best results. All of those adjustments can be made in the 3D editor used (tested with Blender), the adjustments are listed below.

* Export as triangulated mesh (do this on export, don't permanently add tris to your mesh, it will be pain to re-adjust)
* Make sure shade smooth is enabled in the viewport before exporting the OBJ
* Export OBJ as single object (no support for groups)
* Don't write materials to OBJ on export
* Use a 256x256 texture, can use any square image, but the UV coords must be inside 256x256

It's not recommended to exceed 1000 verts with the OBJ, 1000 verts will probably pass, but anything around 1500 verts will cause maximum stack call for the time being.

The tool doesn't require a texture, and doesn't process them either, it's only concerned with UV mapping. The tool will catch some of these errors, such as, if the OBJ contains quads, it can also tell when some OBJ files are not using smooth shading, but is not completely accurate for that check yet.

# Included files

The project currently contains 2 test objects, one of them is a directional cube which shows coordinate orientation (XYZ) in respect to Blender's default viewport, this model is printed as an NJA with textures. I have also included the texture for this object in PNG and DDS format, to be used in a 3D editor.

The other test object is a cube with normals, this model does not have textures and can be used to visualize the difference between a textured NJA (NJTL) and a non textured NJA (NJCM).

# Future of the tool

Ideally the tool will support batch conversion of OBJ to NJA in the future, and better detection for unusable OBJ files. From this point, the tool will likely start to incorporate function usage via the developer console. It's not recommended to add to the current code base, as there is no entity relationships in place yet, but feel free to use any code from the tool whilst bearing in mind it will be updated later.

# Credits

Special thanks to DOOMGUY and Rize for helping with precarious parts of this development.
