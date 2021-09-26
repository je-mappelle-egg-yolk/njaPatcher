let optimizeTriangleStripDetermination = false
let tempStripDirectionAsText = []
let stripDirectionAsText = []

export function optimizeTriangleStrips(){
  return optimizeTriangleStripDetermination = !optimizeTriangleStripDetermination 
}

export function getStripDirectionAsText(){
  return stripDirectionAsText
}

export function generateNJATriangleStrip(objVertsAsTri, objTexAsTri, texture){
  let njaOptimizedTriList = []
  let njaOptimizedTexList = []
  let indexSortOrder = ["original_order", "single_shift_l", "double_shift_l", "switch_first_and_last", "switch_middle_and_last", "complete_reverse_order"]
  let lookAheadTotalStripSize = 0
  let tempOptimizedTriangleStrips = []
  let tempOptimizedTextureStrips = []
  let stripOptimizationResults = [0, 0, 0, 0, 0, 0]
  let buildingFromOptimized = false;

  let lookAheadAsStrip = []
  let lookAheadAsStripTexture = []
  let checkedTriangleMap = []
  let tempMap = []
  for(let triangle in objVertsAsTri){
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
    for(let sortType in indexSortOrder){
      tempOptimizedTriangleStrips = [];
      tempOptimizedTextureStrips = [];
      buildTriangleStrip(true, sortType)
      for(let triangle in objVertsAsTri) checkedTriangleMap[triangle] = tempMap[triangle];
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
    for(let objTriangles in objVertsAsTri){
      if(checkedTriangleMap[objTriangles]){
        continue
      }
      if(!newStrip){
        if(texture){
          generateTriangleStrip(objTexAsTri, objTriangles)
        }else{
          generateTriangleStrip(objVertsAsTri, objTriangles)
        }
      }
      if(newStrip){
        setTriangleStripOrigin(objVertsAsTri, objTriangles, indexSortOrder[sortBy])
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
              if(texture){storeTex[0] = [objTexAsTri[triangle][0],objTexAsTri[triangle][1],objTexAsTri[triangle][2]]}
            stripDirectionText()
          break;
          case "single_shift_l":
            storeVerts[0] = [triangles[triangle][1],triangles[triangle][2],triangles[triangle][0]]
            if(texture){storeTex[0] = [objTexAsTri[triangle][1],objTexAsTri[triangle][2],objTexAsTri[triangle][0]]}
            stripDirectionText()
          break;
          case "double_shift_l":
            storeVerts[0] = [triangles[triangle][2],triangles[triangle][0],triangles[triangle][1]]
            if(texture){storeTex[0] = [objTexAsTri[triangle][2],objTexAsTri[triangle][0],objTexAsTri[triangle][1]]}
            stripDirectionText()
          break;
          case "switch_first_and_last":
            storeVerts[0] = [triangles[triangle][1],triangles[triangle][0],triangles[triangle][2]]
            if(texture){storeTex[0] = [objTexAsTri[triangle][1],objTexAsTri[triangle][0],objTexAsTri[triangle][2]]}
            stripDirectionText()
          break;
          case "switch_middle_and_last":
            storeVerts[0] = [triangles[triangle][0],triangles[triangle][2],triangles[triangle][1]]
            if(texture){storeTex[0] = [objTexAsTri[triangle][0],objTexAsTri[triangle][2],objTexAsTri[triangle][1]]}
            stripDirectionText()
          break;
          case "complete_reverse_order":
            storeVerts[0] = [triangles[triangle][2],triangles[triangle][1],triangles[triangle][0]]
            if(texture){storeTex[0] = [objTexAsTri[triangle][2],objTexAsTri[triangle][1],objTexAsTri[triangle][0]]}
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
          tempStripDirectionAsText.push("StripL")
        }else{
          tempStripDirectionAsText.push("StripR")
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
            storeNonCountedTex.push(objVertsAsTri[triangle][vert])
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
  stripDirectionAsText.push(tempStripDirectionAsText)
  tempStripDirectionAsText = []
  if(texture){
    njaOptimizedTriList = tempOptimizedTextureStrips
    njaOptimizedTexList = tempOptimizedTriangleStrips
  }else{
    njaOptimizedTriList = tempOptimizedTriangleStrips
  }
  return [njaOptimizedTriList, njaOptimizedTexList]
}
