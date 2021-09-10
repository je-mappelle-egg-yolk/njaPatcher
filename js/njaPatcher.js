/////Define prototype
function njaPatcher(objPath){
  //Editable options section : USER INTERFACE
  //Tool settings
  let version = "V0.20a"
  //let objPath = "/obj/"
  //let objModelFile = "cube_t_blender_dir_ref.obj"
  let name = "name_in_nja"
  let custom_comment = "custom_comment"

  let texture_comment, forcedNormals, forcedTextures
  let njatColours = [[255, 255, 255, 255], [255, 255, 255, 255], [8, 255, 255, 255]]
  let bandwidth, bandwidthOffset, vlistChunk, vlistOffnbIdx

  let objHasTextures = false

  let showVertsAsFloatingPoint = true
  let optimizeTriangleStripDetermination = false

  let unloadNormals = false
  let unloadTexture = false

  let forceNormals = false
  let forceTextureCoords = false

  let objDefaultFaceScale = 5

  let flashNJ = false
  ////////////////////////////////////////////////////////////////////////////////

  //Model settings
  let normals = true
  let texture = true
  let njaMode;
  let quadFaces;
  let flatShading;

  //OBJ params
  let objDimension = 0
  let objVertCount = 0
  let objFormat = ""
  let objX = []
  let objY = []
  let objZ = []
  let objXN = []
  let objYN = []
  let objZN = []
  let objXT = []
  let objYT = []
  let objTriIndices = []
  let objTexIndices = []
  let objNormIndices = []

  //Order lists from OBJ
  let objVertexOrder = []
  let objNormalsOrder = []
  let objTextureOrder = []

  //NJA params
  let njaOptimizedTriList = []
  let njaOptimizedTexList = []
  let stripDirectionAsText = []

  //Proto bools
  var finalNJAData = []
  ////////////////////////////////////////////////////////////////////////////////
  //Ex html
  document.getElementById("version").innerHTML = "njaPatcher demo build: " + version
  if(optimizeTriangleStripDetermination) document.getElementById("output").innerHTML = "Warning: Program will hang if optimizing triangle strips, processing can be seen in the console (f12), if it's open before optimization begins."
  //Ex func
  function removeDupe(array){
    return array.filter((value, index) => array.indexOf(value) === index);
  }
  ////////////////////////////////////////////////////////////////////////////////
  /////OBJ
  function loadOBJ(path, obj){
    fetch(path + obj)
    .then(response => response.text())
    .then((text) => {
     getOBJdata(text)
    })
  }

  function getOBJdata(obj){
    normals = (obj.search('vn ') == -1 ? false : true)
    texture = (obj.search('vt ') == -1 ? false : true)
    if(texture) objHasTextures = true;
    if(unloadTexture) texture = false;
    let fixOBJ = (obj.search('usemtl') == -1 ? false : true)
    if(fixOBJ) obj.replace('usemtl None', '');
    if(unloadNormals) normals = false;
    njaMode = (normals ? "CnkV_VN" : "CnkV")
    let vertVectorsXYZ, normalVectorsXYZ, textureCoordsVectorsXY, triangleStrips
    if(texture){
      vertVectorsXYZ = populateObjectVectors(objX, objY, objZ, "v ", "vt ", "vertex", obj)
      populateObjectVectors(objXN, objYN, objZN, "vn ", "s ", "normals" ,obj)
      populateObjectVectors(objXT, objYT, [], "vt ", "vn ", "texture", obj)
    }else{
      if(normals){
        vertVectorsXYZ = populateObjectVectors(objX, objY, objZ, "v ", "vn ", "vertex", obj)
        populateObjectVectors(objXN, objYN, objZN, "vn ", "s ", "normals" ,obj)
      }else{
        if(objHasTextures){
          vertVectorsXYZ = populateObjectVectors(objX, objY, objZ, "v ", "vt ", "vertex", obj)
        }else{
          vertVectorsXYZ = populateObjectVectors(objX, objY, objZ, "v ", "vn ", "vertex", obj)
        }
      }
    }

    triangleStrips = getOBJTriangleData(obj)
    objVertCount = objX.length
    normalVectorsXYZ = reorderNormals()
    textureCoordsVectorsXY = reorderTexture()

    vlistChunk = (normals ? (objVertCount*6)+1 : (objVertCount*3)+1)
    vlistOffnbIdx = objVertCount
    let vlistInfo = []
    vlistInfo.push(vlistChunk)
    vlistInfo.push(vlistOffnbIdx)

    bandwidth = 1 //Slot for strips total count
    for(tri in triangleStrips){
      bandwidth+=triangleStrips[tri].length
    }
    bandwidth += triangleStrips.length
    bandwidth += 1 //for padding
    if(texture){
      for(texCoordXY in textureCoordsVectorsXY[0]){
        bandwidth+=2
      }
    }

    bandwidthOffset = 80 // Might be vertcount * 10
    for(i = 0; i < bandwidth-1; i++){
      bandwidthOffset += 2
    }
    if(flashNJ){
      if(unloadNormals || unloadTexture || objXN[0] == undefined){
        document.getElementById("output").innerHTML += "Error: unloadNormals() and unloadTextures() only supported for NJA output."
      }
      njPatch([bandwidth, bandwidthOffset], texture_comment, njatColours, [vertVectorsXYZ, normalVectorsXYZ, textureCoordsVectorsXY, triangleStrips], vlistInfo)
    }else{
      getNJAT()
    }
  }

  function reorderTexture(){
    let tempXT=[]
    let tempYT=[]
    let njaStripOrder=[]
    let njaTexOrder=[]
    for(strip in njaOptimizedTriList){
      for(vert in njaOptimizedTriList[strip]){
          njaStripOrder.push(njaOptimizedTriList[strip][vert])
        if(texture){
          njaTexOrder.push(njaOptimizedTexList[strip][vert])
        }
      }
    }
    let checkedVertMap = []
    for(vert in objVertexOrder){
      checkedVertMap.push(false)
    }
    let loadVal = false
    let bitX, bitY;
    for(vert in njaTexOrder){
      tempXT.push(objXT[njaTexOrder[vert]])
      tempYT.push(objYT[njaTexOrder[vert]])
    }
    let reverseXT = []
    let reverseYT = []
    for(texcoord in tempXT){

    }
    objXT = tempXT
    objYT = tempYT
    if(forcedTextures){
      for(texCoord in objXT){
        objXT[texCoord] = parseInt(forcedTextures[0])
        objYT[texCoord] = parseInt(forcedTextures[1])
      }
    }
    return [objXT, objYT]
  }
  function reorderNormals(){
    let tempXN=[]
    let tempYN=[]
    let tempZN=[]
    let checkedVertMap = []
    for(vert in objVertexOrder){
      checkedVertMap.push(false)
    }
    for(i in objXN){
      tempXN.push(0)
      tempYN.push(0)
      tempZN.push(0)
    }
    for(vert in objVertexOrder){
      if(checkedVertMap[objVertexOrder[vert]] != true){
        if(!forcedNormals){
          tempXN[objVertexOrder[vert]] = objXN[objNormalsOrder[vert]]
          tempYN[objVertexOrder[vert]] = objYN[objNormalsOrder[vert]]
          tempZN[objVertexOrder[vert]] = objZN[objNormalsOrder[vert]]
        }else{
          tempXN[objVertexOrder[vert]] = valueToFloatingPointHex(forcedNormals[0])
          tempYN[objVertexOrder[vert]] = valueToFloatingPointHex(forcedNormals[1])
          tempZN[objVertexOrder[vert]] = valueToFloatingPointHex(forcedNormals[2])
        }
          checkedVertMap[objVertexOrder[vert]] = true
      }
    }
    objXN = tempXN
    objYN = tempYN
    objZN = tempZN
    return [objXN, objYN, objZN]
  }
  function searchString(string, value){
    let stopSearchAt = string.search(value)
    let stopSeachAtWithOffset = string.search(value) + value.length
    return stopSeachAtWithOffset
  }
  function isolateOBJValues(obj, from, to){
    let cutText = [from, to]
    let s = searchString(obj, cutText[0]) // start
    let e = searchString(obj, cutText[1]) // end
    return obj.substring(s-cutText[0].length, e-cutText[1].length)
  }

  function populateObjectVectors(x, y, z, from, to, type, obj){
    let objIsolate = isolateOBJValues(obj, from, to)
    var tempString = ""
    for(i = 0; i < objIsolate.length; i++){
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
  function cyclePushXYZConfig(x, y, z, string, convertToFloatingPoint, type, maxLen){
    if(string.charAt(0) == '-' && string.length == maxLen){
      cyclePushXYZ(x, y, z, string, convertToFloatingPoint, type)
    }else if(string.charAt(0) != '-' && string.length == maxLen-1){
      cyclePushXYZ(x, y, z, string, convertToFloatingPoint, type)
    }
  }
  function cyclePushXYZ(x, y, z, string, convertToFloatingPoint, type){
    if(type == "normals"){ // Not sure about scaling normals yet, will test it later
      if(convertToFloatingPoint){
        let objRepositionVertex = parseInt(string).toPrecision(7)
        let tempString = []
        for(i in string.length){
          tempString.push() = objRepositionVertex[i]
        }
        string*=1
        string=string.toString()
        string = valueToFloatingPointHex(string)
      }else{
        let objRepositionVertex = parseInt(string).toPrecision(7)
        let tempString = []
        for(i in string.length){
          tempString.push() = objRepositionVertex[i]
        }
        string*=1
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
        string = valueToFloatingPointHex(string)
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
  function cyclePushXY(x, y, string){
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
  function valueToFloatingPointHex(string){
    //function retrieved from:
    //https://stackoverflow.com/questions/47164675/convert-float-to-32bit-hex-string-in-javascript/47187116#47187116
    const getHex = i => ('00' + i.toString(16)).slice(-2)
    var view = new DataView(new ArrayBuffer(4)), result
    view.setFloat32(0, string)
    result = Array
        .apply(null, { length: 4 })
        .map((_, i) => getHex(view.getUint8(i)))
        .join('')
        //console.log(result)
    return "0x" + result;
  }

  function getNJAT(){
    let template = (texture ? "/templates/njaTemplateTexture.txt" : "/templates/njaTemplate.txt" )
    fetch(template)
    .then(response => response.text())
    .then(text => patchNJAT(text))
  }

  ////////////////////////////////////////////////////////////////////////////////
  /////TRIANGLE
  let lookAheadAsStrip = []
  let lookAheadAsStripTexture = []
  let checkedTriangleMap = []
  function getOBJTriangleData(obj){
    let cutFrom = obj.search("f ")
    let objTriangleIsolate = obj.substring(cutFrom)
    let tempTriIndexArray = []
    let tempTexIndexArray = []
    let addToArray = true
    let tempTriString = ""
    let tempNormalsString = ""
    let tempTextureString = ""
    //Will replace this with regex search later
    //Check for quad
    let cfq = 0;
    for(i = 0; i < objTriangleIsolate.length; i++){
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
          if(tempTriString != ""){
            tempTriString = parseInt(tempTriString)-1
            tempTriIndexArray.push(tempTriString)
            objVertexOrder.push(tempTriString)
            tempTriString = "";
            if(tempTriIndexArray.length == 3){
              objTriIndices.push(tempTriIndexArray);
              tempTriIndexArray = []
            }
          }
          addToArray = false
        }else{
          tempTriString += objTriangleIsolate.charAt(i)
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
          tempNormalsString += objTriangleIsolate.charAt(i)
        }else if(tempNormalsString != ""){
            tempNormalsString = parseInt(tempNormalsString)-1
            objNormalsOrder.push(tempNormalsString)
            tempNormalsString = "";
            addToArray = false
        }
      }
    }
    /*
    for(i = 0; i < objTriangleIsolate.length; i++){
      if(addToArray){
        if(objTriangleIsolate.charAt(i) == 'f' || objTriangleIsolate.charAt(i) == ' '){
          if(tempNormalsString != ""){
            tempNormalsString = parseInt(tempNormalsString)-1
            objNormalsOrder.push(tempNormalsString)
            tempNormalsString = "";
          }
          addToArray = false
        }else if(objTriangleIsolate.charAt(i) != "/"){
          tempNormalsString += objTriangleIsolate.charAt(i)
        }
      }
      if(texture){
        if(objTriangleIsolate.charAt(i) == '/'){
          slashCounter+=1
        }
        if(slashCounter == 2){
          addToArray = true
          slashCounter = 0
        }
      }else{
        if(objTriangleIsolate.charAt(i) == '/' && objTriangleIsolate.charAt(i-2) == '/'){
          addToArray = true
        }else if(objTriangleIsolate.charAt(i) == '/' && objTriangleIsolate.charAt(i-1) == '/'){
          addToArray = true
        }
      }
    }
    */
    //Hacky, but need to add last index.
    tempNormalsString = parseInt(tempNormalsString)-1
    objNormalsOrder.push(tempNormalsString)
    tempNormalsString = "";

    //Textures index
    addToArray = false
    for(i = 0; i < objTriangleIsolate.length; i++){
      if(objTriangleIsolate.charAt(i) == '/'){
        addToArray = !addToArray
        if(tempTextureString != ""){
          tempTextureString = parseInt(tempTextureString)-1
          tempTexIndexArray.push(tempTextureString)
          objTextureOrder.push(tempTextureString)
          tempTextureString = ""
          if(tempTexIndexArray.length == 3){
            objTexIndices.push(tempTexIndexArray);
            tempTexIndexArray = []
          }
        }
      }
      if(addToArray && objTriangleIsolate.charAt(i) != '/'){
        tempTextureString += objTriangleIsolate.charAt(i)
      }
    }
    let indexSortOrder = ["original_order", "single_shift_l", "double_shift_l", "switch_first_and_last", "switch_middle_and_last", "complete_reverse_order"]
    let lookAheadTotalStripSize = 0
    let tempOptimizedTriangleStrips = []
    let tempOptimizedTextureStrips = []
    let stripOptimizationResults = [0, 0, 0, 0, 0, 0]
    let buildingFromOptimized = false;

    let tempMap = []
    for(triangle in objTriIndices){
      checkedTriangleMap.push(false)
      tempMap.push(checkedTriangleMap[triangle])
    }

    if(optimizeTriangleStripDetermination){
      chooseBestStrip()
    }else{
      buildTriangleStrip(true, 0)
    }
    function chooseBestStrip(){
      buildingFromOptimized = false
      let strips = tempOptimizedTriangleStrips
      let textures = tempOptimizedTextureStrips
      let sortResult;
      for(sortType in indexSortOrder){
        tempOptimizedTriangleStrips = [];
        tempOptimizedTextureStrips = [];
        buildTriangleStrip(true, sortType)
        for(triangle in objTriIndices) checkedTriangleMap[triangle] = tempMap[triangle];
      }
      let bestOptimizedSort = Math.min(...stripOptimizationResults);
      sortResult = stripOptimizationResults.indexOf(bestOptimizedSort)
      tempOptimizedTriangleStrips = strips
      tempOptimizedTextureStrips = textures
      stripOptimizationResults = [0, 0, 0, 0, 0, 0]
      //document.getElementById("output").innerHTML += `\nSort order: ` + indexSortOrder[sortResult]
      //console.log(`Sort order: ` + indexSortOrder[sortResult])
      buildingFromOptimized = true
      buildTriangleStrip(true, sortResult)
    }
    function buildTriangleStrip(newStrip, sortBy){
      //Recursive condition: lookAheadAsStripLengthPrevious
      let lookAheadAsStripLengthPrevious = lookAheadAsStrip.length
      for(let objTriangles in objTriIndices){
        if(checkedTriangleMap[objTriangles]){
          continue
        }
        if(!newStrip){
          if(texture){
            generateTriangleStrip(objTexIndices, objTriangles)
          }else{
            generateTriangleStrip(objTriIndices, objTriangles)
          }
        }
        if(newStrip){
          setTriangleStripOrigin(objTriIndices, objTriangles, indexSortOrder[sortBy])
        }
      }
      areAllTriangleStripsGenerated(newStrip, lookAheadAsStripLengthPrevious);
      function setTriangleStripOrigin(triangles, triangle, vertIndexOrder){
        let storeVerts = []
        let storeTex = []
        if(checkedTriangleMap[triangle] == false){
          switch(vertIndexOrder){
            case "original_order":
                storeVerts[0] = [triangles[triangle][0],triangles[triangle][1],triangles[triangle][2]]
                if(texture){storeTex[0] = [objTexIndices[triangle][0],objTexIndices[triangle][1],objTexIndices[triangle][2]]}
              stripDirectionText()
            break;
            case "single_shift_l":
              storeVerts[0] = [triangles[triangle][1],triangles[triangle][2],triangles[triangle][0]]
              if(texture){storeTex[0] = [objTexIndices[triangle][1],objTexIndices[triangle][2],objTexIndices[triangle][0]]}
              stripDirectionText()
            break;
            case "double_shift_l":
              storeVerts[0] = [triangles[triangle][2],triangles[triangle][0],triangles[triangle][1]]
              if(texture){storeTex[0] = [objTexIndices[triangle][2],objTexIndices[triangle][0],objTexIndices[triangle][1]]}
              stripDirectionText()
            break;
            case "switch_first_and_last":
              storeVerts[0] = [triangles[triangle][1],triangles[triangle][0],triangles[triangle][2]]
              if(texture){storeTex[0] = [objTexIndices[triangle][1],objTexIndices[triangle][0],objTexIndices[triangle][2]]}
              stripDirectionText()
            break;
            case "switch_middle_and_last":
              storeVerts[0] = [triangles[triangle][0],triangles[triangle][2],triangles[triangle][1]]
              if(texture){storeTex[0] = [objTexIndices[triangle][0],objTexIndices[triangle][2],objTexIndices[triangle][1]]}
              stripDirectionText()
            break;
            case "complete_reverse_order":
              storeVerts[0] = [triangles[triangle][2],triangles[triangle][1],triangles[triangle][0]]
              if(texture){storeTex[0] = [objTexIndices[triangle][2],objTexIndices[triangle][1],objTexIndices[triangle][0]]}
              stripDirectionText()
            break;
          }
          for(let vert in triangles[triangle]){
            if(texture){
              lookAheadAsStripTexture.push(storeVerts[0][vert])
              lookAheadAsStrip.push(storeTex[0][vert])
            }else{
              lookAheadAsStrip.push(storeVerts[0][vert])
            }
            checkedTriangleMap[triangle] = true
            newStrip = false
          }
        }
        function stripDirectionText(){
          if(vertIndexOrder == "original_order" || vertIndexOrder == "single_shift_l" || vertIndexOrder == "double_shift_l"){
            stripDirectionAsText.push("StripL")
          }else{
            stripDirectionAsText.push("StripR")
          }
        }
      }
      function generateTriangleStrip(triangles, triangle){
        let storeNonCountedVert = []
        let storeNonCountedTex = []
        let countMatchingTriangleIndices = 0
        for(let vert in triangles[triangle]){
          if(triangles[triangle][vert] == lookAheadAsStrip[lookAheadAsStrip.length-1] || triangles[triangle][vert] == lookAheadAsStrip[lookAheadAsStrip.length-2]){
            countMatchingTriangleIndices += 1;
          }else{
            if(texture){
              storeNonCountedVert.push(triangles[triangle][vert])
              storeNonCountedTex.push(objTriIndices[triangle][vert])
            }else{
              storeNonCountedVert.push(triangles[triangle][vert])
            }
          }
          if(countMatchingTriangleIndices == 2 && vert == 2){
            if(checkedTriangleMap[triangle] != true){
              lookAheadAsStrip.push(storeNonCountedVert[0])
              lookAheadAsStripTexture.push(storeNonCountedTex[0])
              checkedTriangleMap[triangle] = true
            }
          }
        }
      }
      //If length of strip is 0 (unchanged), no triangles can be further added to the strip,
      //therefore the process can be stopped, unless there are still other strips to be generated.
      //buildTriangleStrip() should use false parameter if the strip isn't fininshed
      function areAllTriangleStripsGenerated(newStrip, lAASLP){
        if(lAASLP != lookAheadAsStrip.length){
          buildTriangleStrip(false, sortBy)
        }else{
          let stripsEnded = true; // Avoiding max call error, strips are not always ended YET though.
          tempOptimizedTriangleStrips.push(lookAheadAsStrip)
          tempOptimizedTextureStrips.push(lookAheadAsStripTexture)
          lookAheadAsStrip = []
          lookAheadAsStripTexture = []
          if(buildingFromOptimized){
            tempMap = []
          }
          for(let triangle in checkedTriangleMap){
            if(checkedTriangleMap[triangle] == false && !newStrip){
              stripsEnded = false
            }
            if(buildingFromOptimized){
              tempMap.push(checkedTriangleMap[triangle])
            }
          }
          if(!stripsEnded && !buildingFromOptimized){
            stripOptimizationResults[sortBy] = (tempOptimizedTriangleStrips.length+1)
            buildTriangleStrip(true, sortBy)
          }
        }
      }
      let stripsEnded = true
      for(let triangle in checkedTriangleMap){
        if(checkedTriangleMap[triangle] == false){
          stripsEnded = false
        }
        if(buildingFromOptimized){
          tempMap.push(checkedTriangleMap[triangle])
        }
      }
      if(!stripsEnded && buildingFromOptimized) chooseBestStrip();
    }
    if(texture){
      njaOptimizedTriList = tempOptimizedTextureStrips
      njaOptimizedTexList = tempOptimizedTriangleStrips
    }else{
      njaOptimizedTriList = tempOptimizedTriangleStrips
    }
    return njaOptimizedTriList
  }
  ///////////////////////////////////////////////////////////////////////////////
  /////NJAT
  function patchNJAT(njat){
    let njatAfterVerts = njat
    let startVertsAt = njat.search("Cadd_vert_and_normC")
    let endVertsAt = njat.search("Cend_vert_and_normC")
    //Start patch, order of patching is significant
    njat = njat.slice(0, startVertsAt)
    njat = customDiffuseColor(njat, [255, 255, 255, 255])
    njat = addOBJVertsToNJAT(njat)
    njatAfterVerts = njatAfterVerts = njatAfterVerts.slice(endVertsAt)
    njatAfterVerts = njatAfterVerts.replace("Cend_vert_and_normC", "")
    njat += njatAfterVerts
    njat = addNameToNJAT(njat, name)
    njat = njat.replace("Ctexture_commentC", texture_comment)
    njat = njat.replace("Cnja_modeC", njaMode)
    //Below line seems arbitrary, but every NJA I've seen does these calcs (Cvert_count_multiC)
    njat = njat.replace("Cvert_count_multiC", vlistChunk)
    njat = njat.replace("Cvert_count_maxC", objVertCount)
    njat = njat.replace("Ccustom_commentC", custom_comment)
    njat = njat.replace("Cnja_patcher_versionC", version)
    njat = addTriangleStripsToNJAT(njat)
    flatShading = (njat.search("undefined") == -1 ? false : true)
    if(!quadFaces){
      document.getElementById("output").innerHTML += njat
    }else if(flatShading){
      document.getElementById("output").innerHTML = "Error: Model most likely flat shaded, please 'smooth shade' your OBJ before exporting!"
    }
    //End of program
  }

  function customDiffuseColor(njat, colours){
    njat = njat.replace("Cd_col_rC", colours[0])
    njat = njat.replace("Cd_col_gC", colours[1])
    njat = njat.replace("Cd_col_bC", colours[2])
    njat = njat.replace("Cd_col_aC", colours[3])
    return njat
  }

  function addOBJVertsToNJAT(njat){
    //console.log(`verts total: ${objVertCount}`)
    //console.log(`verts: X-${objX.length}, Y-${objY.length}, Z-${objZ.length}`)
    //console.log(`norms: X-${objXN.length}, Y-${objYN.length}, Z-${objZN.length}`)
    for(i = 0; i < objVertCount; i++){
      if(i == 0){
        njat = njat + (njaMode == "CnkV_VN" ?
        `VERT(${objX[i]}, ${objY[i]}, ${objZ[i]}),\n    NORM(${objXN[i]}, ${objYN[i]}, ${objZN[i]}),\n` :
        `VERT(${objX[i]}, ${objY[i]}, ${objZ[i]}),\n`)
      }else if(i < objVertCount - 1){
        njat = njat + (njaMode == "CnkV_VN" ?
        `    VERT(${objX[i]}, ${objY[i]}, ${objZ[i]}),\n    NORM(${objXN[i]}, ${objYN[i]}, ${objZN[i]}),\n` :
        `    VERT(${objX[i]}, ${objY[i]}, ${objZ[i]}),\n`)
      }else{
        njat = njat + (njaMode == "CnkV_VN" ?
        `    VERT(${objX[i]}, ${objY[i]}, ${objZ[i]}),\n    NORM(${objXN[i]}, ${objYN[i]}, ${objZN[i]}),` :
        `    VERT(${objX[i]}, ${objY[i]}, ${objZ[i]}),`)
      }
    }
    return njat
  }
  function addNameToNJAT(njat, name){
    njat = njat.replace("object_CnameC", "object_" + name)
    njat = njat.replace("object_CnameC", "object_" + name)
    njat = njat.replace("object_CnameC", "object_" + name)
    njat = njat.replace("strip_CnameC", "strip_" + name)
    njat = njat.replace("strip_CnameC", "strip_" + name)
    njat = njat.replace("vertex_CnameC", "vertex_" + name)
    njat = njat.replace("vertex_CnameC", "vertex_" + name)
    njat = njat.replace("model_CnameC", "model_" + name)
    njat = njat.replace("model_CnameC", "model_" + name)
    if(texture){
      njat = njat.replace("textures_CnameC", "textures_" + name)
      njat = njat.replace("textures_CnameC", "textures_" + name)
      njat = njat.replace("texlist_CnameC", "texlist_" + name)
      njat = njat.replace("texlist_CnameC", "texlist_" + name)
      njat = njat.replace("texlist_CnameC", "texlist_" + name)
    }
    return njat
  }

  function addTriangleStripsToNJAT(njat){
    //Not sure strip_memory is actually memory (might be defined as model bandwidth),
    //but it does function in a similar way, higher values seem to give more allowance
    //to long lists of strips and UVs. This value can be tweaked in notepad before making NJ,
    //but be careful since too low values might not load/convert the model
    if(texture){
      //Strip memory implementation is kind of arbitrary, it's hard to tell exactly what the value is based on
      //but it should increase exponentially based on how many strips and UVs there are.
      njat = njat.replace("Cstrip_memoryC", bandwidth)
    }else{
      njat = njat.replace("Cstrip_memoryC", bandwidth)
    }
    njat = njat.replace("Cstrip_amountC", njaOptimizedTriList.length)
    njat = njat.replace("Ctriangle_stripC", function(){
      let stripEntry = ""
      let stripFormat = ""
      let countForTex = 0
      let countForFormat = 0
      for(strip in njaOptimizedTriList){
        for(vert in njaOptimizedTriList[strip]){
          if(texture){
            if(vert == 0){
              stripFormat+= `\n\t` + njaOptimizedTriList[strip][vert] + `, Uvn( ${objXT[countForTex]} , ${objYT[countForTex]} ),\n`
            }else if(vert == 1){
              stripFormat+=`\t`+njaOptimizedTriList[strip][vert] + `, Uvn( ${objXT[countForTex]} , ${objYT[countForTex]} ),\n`
            }else if(strip == njaOptimizedTriList.length){
              stripFormat+=`\t`+njaOptimizedTriList[strip][vert] + `, Uvn( ${objXT[countForTex]} , ${objYT[countForTex]} ),`
            }else{
              stripFormat+=`\t`+njaOptimizedTriList[strip][vert] + `, Uvn( ${objXT[countForTex]} , ${objYT[countForTex]} ),\n`
            }
          }else{
            if(vert == njaOptimizedTriList[strip].length-1){
              countForFormat = 0
            }
            if(vert == 0){
              stripFormat+=njaOptimizedTriList[strip][vert] + `, `
            }else if(vert == 1){
              stripFormat+=njaOptimizedTriList[strip][vert]
            }else if(countForFormat == 10){
              stripFormat+=`,\n\t\t\t`+njaOptimizedTriList[strip][vert]
              countForFormat = 0
            }else{
              stripFormat+=", "+njaOptimizedTriList[strip][vert]
            }
          }
          countForTex+=1
          countForFormat+=1
        }
        if(strip==0 || !texture){
          stripEntry += `${stripDirectionAsText[strip]}(${njaOptimizedTriList[strip].length}), ` +
          stripFormat
        }else{
          stripEntry += `\t${stripDirectionAsText[strip]}(${njaOptimizedTriList[strip].length}), ` +
          stripFormat
        }
        if(!texture){
          if(strip != njaOptimizedTriList.length-1){
            stripEntry += `,\n\t`
          }else{
            stripEntry += `,`
          }
        }
        stripFormat = []
      }
      return stripEntry
    });
    return njat
  }

  this.objPath = objPath
  return{
    loadOBJ : function(objFile){
      loadOBJ(objPath, objFile);
    },

    details : function(passName, passHeaderComment) {
      name = passName
      custom_comment = passHeaderComment
      texture_comment = "dirbox"//passPermanentComment
    },

    hideHex : () => {
      showVertsAsFloatingPoint = false
      document.getElementById("output").innerHTML = "Warning: hideHex() does not generate usable NJA or NJ files \n\n"
    },

    optimizeStrips : () => {
      optimizeTriangleStripDetermination = true
    },

    unloadNormals : () => {
      unloadNormals = true
    },

    unloadTextures : () => {
      unloadTexture = true
    },

    forceTextureCoords : (x, y) => {
      forceTextureCoords = true
      forcedTextures = []
      forcedTextures.push(x)
      forcedTextures.push(y)
    },

    objScale : (scalar) => {
      objDefaultFaceScale = scalar
    },

    forceNormals : (x, y, z) => {
      forceNormals = true
      forcedNormals = []
      forcedNormals.push(x)
      forcedNormals.push(y)
      forcedNormals.push(z)
    },

    flashNJ : () => {
      flashNJ = true
    }
  }
}
