import * as nP from "./njaPatcher.js"
import * as nA from "./scripts/njaArmature.js"

//Armature with directional reference example
let objFilePath = "/obj/armature_obj/"
let nja = new nP.njaPatcher(objFilePath)
let rig = new nA.hucastArmature()
rig.directionalArmatureView()
nja.loadOBJAsArmature(rig)

/*

//Armature with ExMLDNet scan override - *note that this will not work with -any- scan
let objFilePath = "/obj/armature_obj/"
let nja = new nP.njaPatcher(objFilePath)
let rig = new nA.hucastArmature()
rig.directionalArmatureView()
nja.overrideArmature("racastScan.txt")
nja.loadOBJAsArmature(rig)

*/

/*

//Partial armature with user defined node parts
let objFilePath = "/obj/armature_obj/"
let nja = new njaPatcher.njaPatcher(objFilePath)
let rig = new njaArmature.hucastArmature()
rig.fillArmature()
rig.neck = "2.obj"
rig.leftFoot = "2.obj"
rig.LeftHand = "2.obj"
nja.loadOBJAsArmature(rig)

*/

/*

//Multi-obj as NJA
let objFilePath = "/obj/"
let objPosList = ["0.000000", "0.000000", "0.000000", "4.000000", "0.000000", "0.000000"]
let objFileList = ["weapon_model_size_reference.obj", "cube_t_blender_dir_ref.obj"]
let nja = new nP.njaPatcher(objFilePath)
nja.loadOBJ(objFileList, objPosList)

*/

/*

//Single obj output as NJ
let objFilePath = "/obj/";
let objPosList = ["0.000000", "0.000000", "0.000000"]
let objFileList = ["weapon_model_size_reference.obj"]
let nja = new nP.njaPatcher(objFilePath)
nja.loadOBJ(objFileList, objPosList)
nja.flashNJ()

*/
