import * as parsingTools from './parsingTools.js';
import * as nodeRotation from './nodeRotation.js'
//Model settings
let showVertsAsFloatingPoint = true
export let usingArmature = false;
//OBJ params
let objDefaultFaceScale = 1
let objDefaultNormalsScale = 1

let objDimension = 0
let objVertCount = 0
let objFormat = ""

let normals;
let texture;

let njaMode;
let quadFaces;
let flatShading;
let unloadNormals = false
let unloadTexture = false

export function getUnloadStatus(type){
  if(type == "normals"){
    return unloadNormals
  }else if(type == "texture"){
    return unloadTexture
  }
}

export function unload(type){
  if(type == "normals"){
    return unloadNormals = !unloadNormals
  }else if(type == "texture"){
    return unloadTexture = !unloadTexture
  }
}

export function setOBJscale(scalar, type){
  if(type == "verts"){
    objDefaultFaceScale = scalar
  }else if(type == "normals"){
    objDefaultNormalsScale = scalar
  }
}

export function isUsingArmature(){
  return usingArmature = !usingArmature
}

export function parseOBJ(obj, objID){
  //xyz, xn yn zn, xy yt, f1/ 2/ 3/(1,2,3) f/1/ /2/ /3/(1,2,3) && f x/ - f /x/ - f /x
  let objVertVector, objNormalVector, objTextureVector, objFaceInfo
  let objX = []
  let objY = []
  let objZ = []
  let objXN = []
  let objYN = []
  let objZN = []
  let objXT = []
  let objYT = []
  let objHasTextures = false
  normals = (obj.search('vn ') == -1 ? false : true)
  texture = (obj.search('vt ') == -1 ? false : true)
  if(texture) objHasTextures = true;
  if(unloadTexture) texture = false;
  let fixOBJ = (obj.search('usemtl') == -1 ? false : true)
  if(fixOBJ) obj.replace('usemtl None', '');
  if(unloadNormals) normals = false;
  njaMode = (normals ? "CnkV_VN" : "CnkV")
  if(texture){
    objVertVector = populateObjectVectors(objX, objY, objZ, "v ", "vt ", "vertex", obj)
    objNormalVector = populateObjectVectors(objXN, objYN, objZN, "vn ", "s ", "normals" ,obj)
    objTextureVector = populateObjectVectors(objXT, objYT, [], "vt ", "vn ", "texture", obj)
  }else{
    if(normals){
      if(objHasTextures){
        objVertVector = populateObjectVectors(objX, objY, objZ, "v ", "vt ", "vertex", obj)
      }else{
        objVertVector = populateObjectVectors(objX, objY, objZ, "v ", "vn ", "vertex", obj)
      }
      objNormalVector = populateObjectVectors(objXN, objYN, objZN, "vn ", "s ", "normals" ,obj)
    }else{
      if(objHasTextures){
        objVertVector = populateObjectVectors(objX, objY, objZ, "v ", "vt ", "vertex", obj)
      }else{
        objVertVector = populateObjectVectors(objX, objY, objZ, "v ", "vn ", "vertex", obj)
      }
    }
  }

  objFaceInfo = parseOBJFaceInfo(obj)
  let objPositionVector = calculateOBJPositionVector(objVertVector)

  if(usingArmature){
    if(unloadNormals){
      objVertVector = nodeRotation.hucastRotationNoNormals(objID, objVertVector)
    }else{
      let vertAndNormalVector = nodeRotation.hucastRotation(objID, objVertVector, objNormalVector)
      objVertVector = vertAndNormalVector[0]
      objNormalVector = vertAndNormalVector[1]
    }
  }

  objVertVector = convertVectorToFloatingPoint(objVertVector)
  objNormalVector = convertVectorToFloatingPoint(objNormalVector)
  return [
    [objVertVector], [objNormalVector], [objTextureVector], [objFaceInfo[0]], [objFaceInfo[1]], [objFaceInfo[0][0],objFaceInfo[0][1],objFaceInfo[0][2]], [normals, texture], objPositionVector
  ]
}

function convertVectorToFloatingPoint(vector){
  for(let dimension in vector){
    for(let vert in vector[dimension]){
      vector[dimension][vert] = valueToFloatingPointHex(vector[dimension][vert])
    }
  }
  return vector
}

function calculateOBJPositionVector(vertVector){
  let positionVector = []
  for(let dimension in vertVector){
    let max = Math.max.apply(0, vertVector[dimension])
    let min = Math.min.apply(0, vertVector[dimension])
    let average = (max + min)/2
    positionVector.push(average.toPrecision(7))
    positionVector[dimension] = positionVector[dimension].substring(0,9)
  }
  return positionVector
}

export function populateObjectVectors(x, y, z, from, to, type, obj){
  let objIsolate = parsingTools.isolateStringRange(obj, from, to, true)
  var tempString = ""
  for(var i = 0; i < objIsolate.length; i++){
    if(objIsolate.charAt(i) != 'v' && objIsolate.charAt(i) != ' ' && objIsolate.charAt(i) != 'n'){
      tempString += objIsolate.charAt(i)
    }else{
      tempString = ""
    }
    if(type == "normals"){
      cyclePushXYZConfig(x, y, z, tempString, showVertsAsFloatingPoint, type, 7)
    }
    if(type == "vertex"){

      cyclePushXYZConfig(x, y, z, tempString, showVertsAsFloatingPoint, type, 9)
    }
    if(type == "texture"){
      if(tempString.length == 8){
        cyclePushXY(x, y, tempString)
      }
    }
  }
  if(type == "texture"){
    return [x, y]
  }else{
    return [x, y, z]
  }
}

export function cyclePushXYZConfig(x, y, z, string, convertToFloatingPoint, type, maxLen){
  if(string.charAt(0) == '-' && string.length == maxLen){
    cyclePushXYZ(x, y, z, string, convertToFloatingPoint, type)
  }else if(string.charAt(0) != '-' && string.length == maxLen-1){
    cyclePushXYZ(x, y, z, string, convertToFloatingPoint, type)
  }
}

export function cyclePushXYZ(x, y, z, string, convertToFloatingPoint, type){
  if(type == "normals"){ // Not sure about scaling normals yet, will test it later
    if(convertToFloatingPoint){
      let objRepositionVertex = parseInt(string).toPrecision(7)
      let tempString = []
      for(i in string.length){
        tempString.push() = objRepositionVertex[i]
      }
      string*=objDefaultNormalsScale
      string=string.toString()
    }else{
      let objRepositionVertex = parseInt(string).toPrecision(7)
      let tempString = []
      for(i in string.length){
        tempString.push() = objRepositionVertex[i]
      }
      string*=objDefaultNormalsScale
      string=string.toString()
      string = (string*1).toPrecision(7)
    }
  }
  if(type == "vertex"){
    if(convertToFloatingPoint){
      let objRepositionVertex = parseInt(string).toPrecision(7)
      let tempString = []
      for(i in string.length){
        tempString.push() = objRepositionVertex[i]
      }
      string*=objDefaultFaceScale
      string=string.toString()
    }else{
      let objRepositionVertex = parseInt(string).toPrecision(7)
      let tempString = []
      for(i in string.length){
        tempString.push() = objRepositionVertex[i]
      }
      string*=objDefaultFaceScale
      string=string.toString()
      string = (string*1).toPrecision(7)
    }
  }
  switch(objDimension){
    case 0:
      x.push(string)
      objDimension += 1
    break;
    case 1:
      y.push(string)
      objDimension += 1
    break;
    case 2:
      z.push(string)
      objDimension = 0
    break;
  }
}

export function cyclePushXY(x, y, string){
  switch(objDimension){
    case 0:
      string = parseInt(string*256)
      x.push(string)
      objDimension += 1
    break;
    case 1:
      string = parseInt((string*-1*256)+256)
      y.push(string)
      objDimension = 0
    break;
  }
}

export function parseOBJFaceInfo(obj){
  //Order lists from OBJ - these are returned
  let objVertexOrder = []
  let objNormalsOrder = []
  let objTextureOrder = []
  //Order lists compiled into faces
  let objTriIndices = []
  let objTexIndices = []
  //Find face info and cut
  let cutFrom = obj.search("f ")
  let objTriangleIsolate = obj.substring(cutFrom)

  let tempStoreArray = [] //Used for vertex and texture - breaks at 3 index .length
  let tempString = "" //Used to carry info as String

  let addToArray = true
  //Check for quad
  let cfq = 0;
  for(var i = 0; i < objTriangleIsolate.length; i++){
    if(objTriangleIsolate.charAt(i) == '/') cfq+=1;
    if(objTriangleIsolate.charAt(i) == 'f') cfq=0;
    if(cfq == 8){
      quadFaces = true;
      document.getElementById("output").innerHTML = "Error: Current version does not support quads, triangulate OBJ faces before export!"
    }
  }
  //Vertex index
  for(i = 0; i < objTriangleIsolate.length; i++){
    if(addToArray){
      if(objTriangleIsolate.charAt(i) == 'f' || objTriangleIsolate.charAt(i) == '/'){
        if(tempString != ""){
          tempString = parseInt(tempString)-1
          tempStoreArray.push(tempString)
          objVertexOrder.push(tempString)
          tempString = "";
          if(tempStoreArray.length == 3){
            objTriIndices.push(tempStoreArray);
            tempStoreArray = []
          }
        }
        addToArray = false
      }else{
        tempString += objTriangleIsolate.charAt(i)
      }
    }
    if(objTriangleIsolate.charAt(i) == ' '){
      addToArray = true
    }
  }
  //Normal index
  addToArray = false
  let slashCounter = 0;
  for(i = 0; i < objTriangleIsolate.length; i++){
    if(objTriangleIsolate.charAt(i) == 'f') slashCounter = 0;
    if(objTriangleIsolate.charAt(i) == '/'){
      slashCounter+=1
      if(slashCounter == 2){
        addToArray = true
        slashCounter = 0
      }
    }
    if(addToArray){
      if(objTriangleIsolate.charAt(i) != ' ' && objTriangleIsolate.charAt(i) != 'f' && objTriangleIsolate.charAt(i) != '/'){
        tempString += objTriangleIsolate.charAt(i)
      }else if(tempString != ""){
          tempString = parseInt(tempString)-1
          objNormalsOrder.push(tempString)
          tempString = "";
          addToArray = false
      }
    }
  }
  //Hacky, but need to add last index.
  tempString = parseInt(tempString)-1
  objNormalsOrder.push(tempString)
  tempString = "";
  //Textures index
  addToArray = false
  for(i = 0; i < objTriangleIsolate.length; i++){
    if(objTriangleIsolate.charAt(i) == '/'){
      addToArray = !addToArray
      if(tempString != ""){
        tempString = parseInt(tempString)-1
        tempStoreArray.push(tempString)
        objTextureOrder.push(tempString)
        tempString = ""
        if(tempStoreArray.length == 3){
          objTexIndices.push(tempStoreArray);
          tempStoreArray = []
        }
      }
    }
    if(addToArray && objTriangleIsolate.charAt(i) != '/'){
      tempString += objTriangleIsolate.charAt(i)
    }
  }
  return [[objVertexOrder, objTextureOrder, objNormalsOrder], [objTriIndices, objTexIndices]]
}

export function valueToFloatingPointHex(string){
  //function retrieved from:
  //https://stackoverflow.com/questions/47164675/convert-float-to-32bit-hex-string-in-javascript/47187116#47187116
  const getHex = i => ('00' + i.toString(16)).slice(-2)
  var view = new DataView(new ArrayBuffer(4)), result
  view.setFloat32(0, string)
  result = Array
      .apply(null, { length: 4 })
      .map((_, i) => getHex(view.getUint8(i)))
      .join('')
  return "0x" + result;
}
