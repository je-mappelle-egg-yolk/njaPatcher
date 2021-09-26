let bandwidth, bandwidthOffset, vlistChunk, vlistOffnbIdx, objVertCount

export function generateMemoryInfo(vertCount, normal, texture, triangleStrips, textureCoords){
  objVertCount = vertCount

  vlistChunk = (normal ? (objVertCount*6)+1 : (objVertCount*3)+1)
  vlistOffnbIdx = objVertCount
  let vlistInfo = []
  vlistInfo.push(vlistChunk)
  vlistInfo.push(vlistOffnbIdx)

  //vlistInfo[1] and vert count always seem to be the same so might exclude later

  bandwidth = 1 //Slot for strips total count
  for(let tri in triangleStrips){
    bandwidth+=triangleStrips[tri].length
  }
  bandwidth += triangleStrips.length
  bandwidth += 1 //for padding || might not be necessary, requires more testing later
  if(texture){
    for(let texCoord in textureCoords[0]){
      bandwidth+=2
    }
  }

  bandwidthOffset = 80 // can get this result by putting bandwidth at 0 on a simple model
  for(let i = 0; i < bandwidth-1; i++){
    bandwidthOffset += 2
  }
  return [bandwidth, bandwidthOffset, vertCount, vlistInfo[0], vlistInfo[1]]
}
