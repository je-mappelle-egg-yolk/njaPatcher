import * as objParser from './scripts/objParser.js';
import * as generateNJA from './scripts/generateNJA.js';
import * as njaMemory from './scripts/njaMemory.js';
import * as njaArmature from './scripts/njaArmature.js'
import * as triangleStripper from './scripts/triangleStripper.js'
import * as njPatcher from './scripts/njPatcher.js'

export function njaPatcher(objFilePath){
  let flashNJ = false
  let forceTextureCoords = false;
  let forceNormalEntries = false;
  let forcedNormals = []
  let forcedTextures = []

  let textureComment = "this doesn't change anything yet"
  let njatColours = [[255, 255, 255, 255], [255, 255, 255, 255], [255, 255, 255, 8]]

  let useArmature = false;

  let objPosList = ["0.000000", "0.000000", "0.000000"]
  let objPathList = ["rot_example2.obj"]

  let objList = []
  let objParsedDataList = []
  let modelTriangleStripsList = []
  let modelCompleteInfoList = []
  let modelMemoryInfoList = []

  let normal, texture;

  let version = "V0.24a"
  document.getElementById("version").innerHTML = "njaPatcher demo build: " + version

  async function loadOBJ(filePath, objFiles){

    let exMLDTemplate = []

    for(let obj in objFiles){
      let response = await fetch(filePath + objFiles[obj])
      let data = await response.text();
      objList.push(data)
    }

    for(let objModel in objList){
      objParsedDataList.push(objParser.parseOBJ(objList[objModel], objModel))
      objParsedDataList[objModel][7] = (objPosList[objModel])
    }
    for(let parsedData in objParsedDataList){
      normal = objParsedDataList[parsedData][6][0]
      texture = objParsedDataList[parsedData][6][1]
      modelTriangleStripsList.push(triangleStripper.generateNJATriangleStrip(objParsedDataList[parsedData][4][0][0], objParsedDataList[parsedData][4][0][1], texture))
      if(normal){
        objParsedDataList[parsedData][1][0] = reorderNormals(objParsedDataList[parsedData][1][0][0], objParsedDataList[parsedData][1][0][1],
          objParsedDataList[parsedData][1][0][1]
        , objParsedDataList[parsedData][5][0], objParsedDataList[parsedData][5][2])
      }
      if(texture){
        objParsedDataList[parsedData][2][0] = reorderTexture(objParsedDataList[parsedData][2][0][0], objParsedDataList[parsedData][2][0][1],
          modelTriangleStripsList[parsedData][0], modelTriangleStripsList[parsedData][1]
        , objParsedDataList[parsedData][5][0], objParsedDataList[parsedData][5][2])
      }

      modelMemoryInfoList.push(njaMemory.generateMemoryInfo(objParsedDataList[parsedData][0][0][0].length, normal, texture
      ,  modelTriangleStripsList[parsedData][0], objParsedDataList[parsedData][2][0]))
    }
    if(flashNJ){
      if(objParser.getUnloadStatus("normals") || objParser.getUnloadStatus("texture")){
        document.getElementById("output").innerHTML += "Error: unloadNormals() and unloadTextures() only supported for NJA output."
      }
      let vlistInfo = []
      vlistInfo.push(modelMemoryInfoList[0][3])
      vlistInfo.push(modelMemoryInfoList[0][4])
      njPatcher.njPatch([modelMemoryInfoList[0][0], modelMemoryInfoList[0][1]],
        textureComment, njatColours,
      [objParsedDataList[0][0][0], objParsedDataList[0][1][0], objParsedDataList[0][2][0], modelTriangleStripsList[0][0]],
        vlistInfo
      )
    }else{
      generateNJA.makeNJA(objParsedDataList, modelTriangleStripsList, triangleStripper.getStripDirectionAsText(), modelMemoryInfoList)
    }
  }

  ////////////////////////////////////////////////////////////////////////////////
  function reorderTexture(xt, yt, triStripList, texStripList, objVertOrder, objTexOrder){
    let tempXT=[]
    let tempYT=[]
    let njaStripOrder=[]
    let njaTexOrder=[]
    for(let strip in triStripList){
      for(let vert in triStripList[strip]){
          njaStripOrder.push(triStripList[strip][vert])
        if(texture){
          njaTexOrder.push(texStripList[strip][vert])
        }
      }
    }
    for(let vert in njaTexOrder){
      tempXT.push(xt[njaTexOrder[vert]])
      tempYT.push(yt[njaTexOrder[vert]])
    }
    xt = tempXT
    yt = tempYT
    if(forceTextureCoords){
      for(let texCoord in xt){
        xt[texCoord] = parseInt(forcedTextures[0])
        yt[texCoord] = parseInt(forcedTextures[1])
      }
    }
    return [xt, yt]
  }
  function reorderNormals(xn, yn, zn, objVertOrder, objNormalOrder){
    let tempXN=[]
    let tempYN=[]
    let tempZN=[]
    let checkedVertMap = []
    for(let vert in objVertOrder){
      checkedVertMap.push(false)
    }
    for(let i in xn){
      tempXN.push(0)
      tempYN.push(0)
      tempZN.push(0)
    }
    for(let vert in objVertOrder){
      if(checkedVertMap[objVertOrder[vert]] != true){
        if(!forceNormalEntries){
          tempXN[objVertOrder[vert]] = xn[objNormalOrder[vert]]
          tempYN[objVertOrder[vert]] = yn[objNormalOrder[vert]]
          tempZN[objVertOrder[vert]] = zn[objNormalOrder[vert]]
        }else{
          tempXN[objVertOrder[vert]] = objParser.valueToFloatingPointHex(forcedNormals[0])
          tempYN[objVertOrder[vert]] = objParser.valueToFloatingPointHex(forcedNormals[1])
          tempZN[objVertOrder[vert]] = objParser.valueToFloatingPointHex(forcedNormals[2])
        }
        checkedVertMap[objVertOrder[vert]] = true
      }
    }
    xn = tempXN
    yn = tempYN
    zn = tempZN
    return [xn, yn, zn]
  }
  return{
    loadOBJAsArmature : function(armature){
      objParser.isUsingArmature()
      generateNJA.isGeneratingNJAFromExMLDNetTemplate(generateNJA.generateNJAFromExMLDNetTemplate);
      let addRig = armature.useArmature()
      objPathList = addRig[0]
      objPosList = addRig[1]
      loadOBJ(objFilePath, objPathList)
    },
    overrideArmature : function(scanPath){
      generateNJA.setScanFile(scanPath)
    },
    loadOBJ : function(objPathList, objPosList){
      loadOBJ(objFilePath, objPathList)
    },
    objScale : (scalar) => {
      objParser.setOBJscale(scalar, "verts")
    },
    objScaleNormals : (scalar) => {
      objParser.setOBJscale(scalar, "normals")
    },
    optimizeStrips : function(){
      triangleStripper.optimizeTriangleStrips()
    },
    unloadNormals : function(){
      objParser.unload("normals")
    },
    unloadTextures : function(){
      objParser.unload("texture")
    },
    forceTextureCoords : (x, y) => {
      forceTextureCoords = true
      forcedTextures = []
      forcedTextures.push(x)
      forcedTextures.push(y)
    },
    forceNormals : (x, y, z) => {
      forceNormalEntries = true
      forcedNormals = []
      forcedNormals.push(x)
      forcedNormals.push(y)
      forcedNormals.push(z)
    },
    flashNJ : function(){
      flashNJ = true
    }
  }
}
////////////////////////////////////////////////////////////////////////////////
