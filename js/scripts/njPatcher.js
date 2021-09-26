export function njPatch(bandwidthVals, textureComment, colours, njaFinalData, njaVlistInfo){
  let nj = ""
  let njtlEnd = false

  let vertVectorsXYZ = njaFinalData[0]
  let normalVectorsXYZ = njaFinalData[1]
  let textureCoordsVectorsXY = njaFinalData[2]
  let triangleStrips = njaFinalData[3]

  let bandwidth = bandwidthVals[0]
  let bandwidthOffset = bandwidthVals[1]

  let njcmDataSize = 78 + 10 + 24 //Summation of static byte blocks
  njcmDataSize+= (bandwidth+1)*2
  for(let vector in vertVectorsXYZ){
    for(let vert in vertVectorsXYZ[vector]){
      njcmDataSize += 8 // should be + 4 for no normals
    }
  }
  if(bandwidth % 2 == 0){
    njcmDataSize += 2
  }

  if(!njtlEnd){
    [nj, njtlEnd] = generateNJTL(textureComment, njtlEnd)
  }
  if(njtlEnd){
    nj = generateNJCM(nj, bandwidth, bandwidthOffset, njcmDataSize, colours, vertVectorsXYZ, normalVectorsXYZ, textureCoordsVectorsXY, triangleStrips, njaVlistInfo)
    document.getElementById("output").innerHTML += nj.toUpperCase()
  }
}

function generateNJTL(textureComment, njtlEnd){
  //Since NJTL is replaceable for a single texture I haven't bothered to write it yet
  //will implement it when multi texture support is added
  /*
  while(!njtlEnd){
    nj = "NJTL@" //23 ..
    nj = convertToHex(nj)
    nj = padWithDec0(nj, 3)
    nj = nj + "08" + " " //Hmm think this is verts
    nj = padWithDec0(nj, 3)
    nj = nj + "01" + " " //Hmm think this is textures
    nj = padWithDec0(nj, 3)
    nj = nj + "14" + " " //Hmm I don't know what this is yet
    nj = padWithDec0(nj, 11)
    nj = addTextureComment(nj, textureComment)
    nj = padWithDec0(nj, 3)
    nj = addPointerOffsetListType0(nj)
    nj = padWithDec0(nj, 3)
    nj = nj + "40 42 " //Hmm Okay
    nj = padWithDec0(nj, 2)
    njtlEnd = true;
  }
  */
  let nj = "4E 4A 54 4C 1C 00 00 00 08 00 00 00 01 00 00 00 14 00 00 00 00 00 00 00 00 00 00 00 64 69 72 62 6F 78 00 00 50 4F 46 30 04 00 00 00 40 42 00 00 "
  njtlEnd = true
  return [nj, njtlEnd]
}
function generateNJCM(nj, bandwidth, bandwidthOffset, njcmDataSize, colours, vvXYZ, nvXYZ, tcvXY, ts, njaVli){
  //There is a tonne of refactoring to be done here, mostly at checks for < 255 : But it can wait for a future update
  let tsStripLengths = []
  for(let s in ts){
    tsStripLengths.push(ts[s].length)
  }
  let njcm = ""
  njcm += "NJCM"
  njcm = convertToHex(njcm)
  njcm += convertTo2Bytes(njcmDataSize) //Offset after "NJCM"
  njcm = padWithDec0(njcm, 2)
  njcm += "00 00 00 00 " //Points to start of tri strips, always the same - Not sure when this activates - old "17 00 00 00"
  njcm += convertTo2Bytes(njcmDataSize-24) //Offset following previous one
  njcm = padWithDec0(njcm, 26)
  njcm += "00 00 80 3F 00 00 80 3F 00 00 80 3F " //Temp scale, not sure if will be supported, can change scale in more stable ways
  njcm = padWithDec0(njcm, 8)
  njcm += "17 25 06 00 " //static var
  for(let colourType in colours){
    let revColour = colours[colourType].reverse()
    for(let colour in colours[colourType]){
      njcm += padHex16(revColour[colour], false)
    }
  }
  njcm += "08 04 00 40 41 00 " //Not sure
  if(bandwidth<255){
    njcm += padHex16(bandwidth)
  }else{
    njcm += convertTo2Bytes(bandwidth)
  }
  if(tsStripLengths.length < 255){
    njcm += padHex16(tsStripLengths.length)
  }else{
    njcm += convertTo2Bytes(tsStripLengths.length)
  }
  let countForTex = 0
  for(let s in ts){
    njcm+= padHex16(ts[s].length)
    for(let v in ts[s]){
      if(ts[s][v] < 256){
        njcm+= padHex16(ts[s][v])
      }else{
        njcm+= convertTo2Bytes(ts[s][v])
      }
      if(tcvXY[0][countForTex] < 256){
        njcm+= padHex16(tcvXY[0][countForTex])
      }else{
        njcm+= convertTo2Bytes(tcvXY[0][countForTex])
      }
      if(tcvXY[1][countForTex] < 256){
        njcm+= padHex16(tcvXY[1][countForTex])
      }else{
        njcm+= convertTo2Bytes(tcvXY[1][countForTex])
      }
      countForTex+=1
    }
  }
  njcm += "00 00 "
  //The below "29" value needs to exist at a specific point after the next FF, 2 bytes away if bandwidth is odd, and 4 if bandwidth is even
  if(bandwidth % 2 == 1){
    njcm += "FF 00 "
  }else{
    bandwidthOffset+=2
    njcm += "FF 00 00 00 "
  }
  njcm += "29 00 " //Seems like another static var, "29" referred to above
  for(let info in njaVli){
    if(info == 0){
      if(njaVli[info]<255){
        njcm+=padHex16(njaVli[info])+"00 00 "
      }else{
        njcm+=convertTo2Bytes(njaVli[info])+"00 00 "
      }
    }else{
      if(njaVli[info]<255){
        njcm+=padHex16(njaVli[info])
      }else{
        njcm+=convertTo2Bytes(njaVli[info])
      }
    }
  }
  countForTex = 0
  for(let i = 0; i < njaVli[1]; i++){
    for(let vector in vvXYZ){
      njcm += fpc754conv2Hex16(vvXYZ[vector][countForTex])
    }
    for(let vector in nvXYZ){
      njcm += fpc754conv2Hex16(nvXYZ[vector][countForTex])
    }
    countForTex+=1
  }
  njcm+= "FF 00 00 00 " // end of vert/norm
  if(bandwidthOffset<255){
    njcm+= padHex16(bandwidthOffset) + "00 00 "
  }else{
    njcm+= convertTo2Bytes(bandwidthOffset) + "00 00 "
  }
  njcm+= "34 00 " // 34 is second pointer offset from above
  njcm = padWithDec0(njcm, 14)
  njcm+= "D9 B3 DD 3F " //pretty certain these are static
  njcm = addPointerOffsetListType0(njcm)
  njcm+= "00 00 00 "
  njcm+= modelBandwidthOut(bandwidth, njaVli[0])
  nj += njcm
  nj = appendNJM(nj)
  return nj
}
//For models to work in PSOBB, this is almost always necessary, I got this NJM from a PSOBB weapon IIRC, it doesn't animate the new object
function appendNJM(nj){
  let njm = "4E 4D 44 4D 7C 00 00 00 0C 00 00 00 65 00 00 00 03 00 02 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 50 4F 46 30 10 00 00 00 40 43 41 43 41 43 41 43 41 43 41 43 41 43 41 00 00 00"
  nj += njm
  return nj
}
//Assuming these vars are a return statement of some kind, denoted as "AxxA" at the end of NJCM files
//Not sure what this type of byte formation is called, this isn't finalized for extremely small models (0-3 verts)
function modelBandwidthOut(triStripBandwidth ,vlistBandwidth){
  let unknown_var_name0 = 0//128
  let unknown_var_name1 = 0//64 ^ [] when CnkV_VN(0x0, 43)
  for(let i = 0; i < vlistBandwidth; i++){
    if(i == 43){
      unknown_var_name0 = 128
      unknown_var_name1 = 64
      break;
    }
  }
  vlistBandwidth-=43
  for(let i = 0; i < vlistBandwidth; i++){
    if(unknown_var_name1 < 255){
      unknown_var_name1 += 1
    }else{
      unknown_var_name1 = 0
      unknown_var_name0 += 1
    }
  }
  for(let i = 0; i < triStripBandwidth/2; i++){
    if(unknown_var_name1 < 255){
      unknown_var_name1 += 1
    }else{
      unknown_var_name1 = 0
      unknown_var_name0 += 1
    }
  }
  if(triStripBandwidth % 2 == 1){
    unknown_var_name1 -= 1
  }
  return "41 " + unknown_var_name0.toString(16) + " " + unknown_var_name1.toString(16) + " 41 "
}
//Conversion to 2 bytes for decimal vals over 255 [FF]
function convertTo2Bytes(integer){
  integer = integer.toString(16)
  let b1
  let b2
  if(integer.length == 3){
    b1 = integer.slice(1,3)
    b2 = "0" + integer.slice(0,1)
  }
  if(integer.length == 4){
    b1 = integer.slice(2,4)
    b2 = integer.slice(0,2)
  }
  integer = b1 + " " + b2 + " "
  return integer
}
//Conversion for floating point hex to hex16 bytes
function fpc754conv2Hex16(fpc754val){
  //fpc754val always len 8
  let byteBlock = []
  let tempString = fpc754val.slice(2)
  byteBlock.push(tempString.slice(6,8))
  byteBlock.push(tempString.slice(4,6))
  byteBlock.push(tempString.slice(2,4))
  byteBlock.push(tempString.slice(0,2))
  tempString = ""
  for(let byte in byteBlock){
    tempString += byteBlock[byte] + " "
  }
  return tempString
}
//For values that will be less than 255 [FF] but are 2 byte length
function padHex16(string, expand = true){
  let endPad
  if(expand){
    endPad = " 00 "
  }else{
    endPad = " "
  }
  string = string.toString(16)
  if(string.length == 1){
    string = "0" + string + endPad
  }else if(string.length == 2){
    string = string + endPad
  }else if(string.length == 3){
    string = string.substring(0, 1) + " 0" + string.charAt(3)
  }
  return string
}
//Convert string literal to bytes
function convertToHex(string){
  let hexString = ""
  for(let char in string){
    hexString += string.charCodeAt(char).toString(16).toUpperCase() + " "
  }
  return hexString
}
//Pad with 00's for amount
function padWithDec0(origString, amount){
  let string = ""
  for(let i = 0; i < amount; i++){
    string += "00" + " "
  }
  return origString + string
}
//Add string literal into bin
function addTextureComment(string, textureComment){
  let tempString = ""
  for(let char in textureComment){
    tempString += textureComment[char]
  }
  tempString = convertToHex(tempString)
  return string += tempString
}
//Pointer offset list type 0 definition - need to implement trailing 0s to clean up code
function addPointerOffsetListType0(string){
  let p0f0 = "50 4F 46 30 04 "
  return string + p0f0
}
