# njaPatcher
njaPatcher is a reverse engineering of NJA (Ninja Ascii) and NJ (Ninja Chunk) file formats used in many SEGA Dreamcast games. njaPatcher is not intended to infringe on the rights of other software companies, and is only made with the intention of moving an already available process out of being restricted to Windows 98/Windows NT/Windows XP machine.

## njaPatcher capabilities
njaPatcher uses a specified version of OBJ file which is described in the OBJ requirements section of this document.

Currently njaPatcher can convert single OBJ models into NJA/NJ file format, and can additionally convert many OBJ models into a node based armature as NJA file format. The armature is based on a scan file output from ExMLDNet, which reads NJ files. The armature included is the same as the character class HUcast from Phantasy Star Online Blue Burst.

# How to use njaPatcher
The current repo is still in early development and is refactored in a minimal way, the testing browser/console for njaPatcher is Google Chrome, so it's recommended while njaPatcher is still in alpha version. All functionality for this version of njaPatcher is controlled through the "main.js" script.

If it is decided to use a new "main.js" script, it must be of type module in HTML, as njaPatcher is based on module aggregation for the time being, e.g.,

`<script type="module" src="fileSource"></script>`

There are a couple of objects to use with njaPatcher, the first one being "njaPatcher" and the second being "njaArmature".

Lastly, njaPatcher is not developed with privatized variables at the moment, so please refer to this document for function names and usage.

## Included files
The included HTML/CSS with the added "main.js" script is setup to export an NJA with a node based armature structure, the 'main.js' script also has commented out examples for different usage of the package.

The repo currently contains 4 test OBJ files/folders:

1) A directional cube which shows coordinate orientation (XYZ) in respect to Blender's default viewport. This model has both textures and normals. Also included is the texture for this object in PNG and DDS format, to be used in a 3D editor.

2) A cube with normals, this model does not have textures and can be used to visualize the difference between a textured NJA (NJTL) and a non-textured NJA (NJCM). This type of file is not supported for NJ output at the moment.

3) A weapon style object to visualize the 3D object scaling (low-mid vertex count).

4) A set of cubes that can be loaded as a directional reference in an armature.

Additionally there are two scans created using ExMLDNet, that provide various details for re-creating existing node models.

## njaPatcher object
njaPatcher must be imported into the project using an import statement.

`import * as nP from './scriptPath/njaPatcher.js'`

An object of njaPatcher can be created. The `objFilePath` parameter should be the folder intended to load OBJ files from. An OBJ folder is setup for this version of njaPatcher.

`let nja = new nP.njaPatcher(objFilePath)`

String: **objFilePath** is required.

## njaPatcher functions
### loadOBJ(objFileList, objPosList)
This function will output NJA if used by itself, the `objFileList` parameter is a list of OBJ files to be converted, if multiple are loaded njaPatcher will chain them into a single NJA file. The `objPosList` parameter takes a floating point vector as string and must be defined per OBJ in the `objFileList`, for now this parameter must have at least 6 trailing values, e.g, `["0.000000", "0.000000", "0.000000"]` for a single OBJ.

`nP.loadOBJ(objFileList, objPosList)`

Array: **objFileList** is required  
Array: **objPosList** is required

### flashNJ()
This function will output an NJ file during the `loadOBJ(objFileList, objPosList)` function. This function does not work with multi OBJ outputs.

`nP.flashNJ()`

Boolean.

### objScale(scalar)
This will change the scale of OBJ faces by adding a scalar to each vert.

`nP.objScale(3.0)`

Floating point: **scalar** is required.

### objScaleNormals(scalar)
This will change the scale of OBJ normals by adding a scalar to each normal.

`nP.objScaleNormals(3.0)`

Floating point: **scalar** is required.

### forceNormals(x, y, z)
This will force normal entries into NJA or NJ output, the main usage of this is for analysis of either file, since it will create a pattern within their data structures.

`nP.forceNormals(1.0, 1.0, 1.0)`

Floating point: **x** is required  
Floating point: **y** is required  
Floating point: **z** is required  

### forceTextureCoords(x, y)
This will force texture coordinate entries into NJA or NJ output, the main usage of this is for analysis of either NJA or NJ, since it will create a pattern within their data structures. Texture coordinates cap out at `nP.forceTextureCoords(256, 256)` for NJA/NJ files.

`nP.forceTextureCoords(256, 256)`

Integer: **x** is required  
Integer: **y** is required  

### hideHex() **[REMOVED FOR NOW]**
This function will remove hex from showing in NJA files, doesn't work with NJ since NJ is outputted as hex.

`nP.hideHex()`

Boolean.

### unloadTextures(), unloadNormals()
Two more functions for analysis of NJA and NJ, they unload all normals and texture coordinates, both will break NJ files, but the error is displayed in HTML for now.

```
nP.unloadTextures()
nP.unloadNormals()
```

Boolean.

### optimizeStrips()
This function is seriously not recommended for general usage, it will optimize triangle strips size, but it is extremely slow in it's current state and will make njaPatcher hang. The effectiveness of this function can be seen when processing a small OBJ (100 verts~), but is technically unnecessary.

`nP.optimizeStrips()`

Boolean.

### details(name, custom_comment) **[REMOVED FOR NOW]**
This function is not necessary to use, but will add some extra text into an NJA output. The next version will allow adding a permanent comment into NJ (NJTL) files.

`nP.details(name, custom_comment)`

String: **name** is required  
String: **custom_comment** is required  

### overrideArmature(filePath)
Although njaPatcher only has one available armature at the moment, it's still possible to override this armature with a different ExMLDNet scan, and this function allows that. If the new scan has more models than the current armature, njaPatcher won't be able to process an NJA, but if the new scan has less or the same amount of models, it will load the override scan as NJA. There is no guarantee that the new scan will use the same properties as the `hucastArmature()`, so this is an experimental choice for the user.

`nP.overrideArmature(filePath)`

String: **filePath** is required

## njaArmature object
njaArmature must be imported into the project using an import statement.

`import * as nA from './scriptPath/njaArmature.js'`

An object of njaArmature can be created, currently njaArmature only supports one type of armature, which is named `hucastArmature()`, there are no parameters for the creation of this object.

`let rig = new nA.hucastArmature()`

### Assignable nodes
With the njaArmature object, instead of loading OBJ models directly to NJA, instead OBJ models are loaded as node parts. For the hucastArmature the node parts can be user defined like so:
```
rig.neck = "0.obj"
rig.leftHand = "1.obj"
rig.leftElbow = "2.obj"
rig.leftShoulder = "3.obj"
rig.leftShoulder2 = "4.obj"
rig.rightHand = "5.obj"
rig.rightElbow = "6.obj"
rig.rightShoulder = "7.obj"
rig.rightShoulder2 = "8.obj"
rig.chest = "9.obj"
rig.leftFoot = "10.obj"
rig.leftKnee = "11.obj"
rig.leftHip = "12.obj"
rig.rightFoot = "13.obj"
rig.rightKnee = "14.obj"
rig.rightHip = "15.obj"
rig.stomach = "16.obj"
rig.nadir = "17.obj"
```
There is one other part named default:

`rig.default = "0.obj"`

Using this with the fillArmature() function, will load this OBJ model into every node point of the armature.

## njaArmature functions
### loadOBJAsArmature(armature)
This function will output an entire armature as NJA file. It is actually part of njaPatcher.js, but has dependency on njaArmature.js. The only parameter required is the armature itself. Instead of loading from a list of defined OBJ positions, this function takes a pre-existing list of positions and loads OBJ files accordingly.

`nja.loadOBJFromArmature(rig)`

Object: **rig** is required

### fillArmature()
This function will 'ready' the armature, when using this function it's not necessary to assign all node parts, as this will load objects into all of the parts except where the user has defined an OBJ. It's recommended to run this before assigning any node parts.

`rig.fillArmature()`

Boolean.

### directionalArmatureView()
This function will load a set of labelled directional cubes, to show how an armature is loaded. It's not required to assign node parts when using this function.

`rig.directionalArmatureView()`

Boolean.

### mirrorArmature()
This function does not function like a typical mirror translation at the moment, meaning it doesn't swap verts just yet. Instead this function will load values assigned to left side nodes into right side nodes as well. Only recommended if using entirely symmetric models (including symmetric origin).

`rig.mirrorArmature()`

Boolean.

## OBJ requirements

Before running an OBJ through njaPatcher, various adjustments need to be made to the OBJ to get working results. All of those adjustments can be made in the 3D editor used (tested with Blender), the adjustments are listed below.

* Export as triangulated mesh (do this on export, don't permanently add tris to your mesh it will be pain to re-adjust)
* Make sure shade smooth is enabled in the viewport before exporting to OBJ
* Export OBJ as single object (no support for groups)
* Don't write materials to OBJ on export
* Use a 256x256 texture, can use any square image, but the UV coordinates should be inside 256x256
* Don't use smoothing groups on OBJ

It's not recommended to exceed 1000 verts with the OBJ, recommended max for now is around 750 verts, but anything around 1000-1500 verts can cause maximum stack call for the time being.

njaPatcher doesn't require a texture input, and doesn't process them either, it's only concerned with UV mapping. For games that support AFS, it is possibly required to convert the image texture to DDS before using it.  

# Credits

Special thanks to DOOMGUY, Rize, TrueVision and Shiva, additional thanks to SEGA dev and modding communities.
