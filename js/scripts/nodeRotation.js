//Will simplify this another time, it's an extremely time consuming process to test
//so will wait until NJ can be exported with nodes.

//Fomarl rotation and armature (commented out in njaArmature) does work, but doesn't support
//unloadNormals() for now, and requires some code to be changed in objParser.js
export function hucastRotation(objID, vertVector, normalVector){
  if(objID == 0 || objID == 9){
    vertVector = rotateModel(90, "x", vertVector)
    normalVector = rotateModel(90, "x", normalVector)
    vertVector = rotateModel(90, "x", vertVector)
    normalVector = rotateModel(90, "x", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
  }
  if(objID == 1 || objID == 4 || objID == 5 || objID == 8 || objID == 17){
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
  }
  if(objID == 2 || objID == 3 || objID == 6 || objID == 7 || objID == 15 || objID == 12 || objID == 14 || objID == 11){
    vertVector = rotateModel(-90, "x", vertVector)
    normalVector = rotateModel(-90, "x", normalVector)
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
  }
  if(objID == 10 || objID == 13){
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(-90, "z", vertVector)
    normalVector = rotateModel(-90, "z", normalVector)
  }
  if(objID == 16){
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
  }
  return [vertVector, normalVector]
}

export function hucastRotationNoNormals(objID, vertVector){
  if(objID == 0 || objID == 9){
    vertVector = rotateModel(90, "x", vertVector)
    vertVector = rotateModel(90, "x", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
  }
  if(objID == 1 || objID == 4 || objID == 5 || objID == 8 || objID == 17){
    vertVector = rotateModel(90, "z", vertVector)
    vertVector = rotateModel(90, "z", vertVector)
  }
  if(objID == 2 || objID == 3 || objID == 6 || objID == 7 || objID == 15 || objID == 12 || objID == 14 || objID == 11){
    vertVector = rotateModel(-90, "x", vertVector)
    vertVector = rotateModel(90, "z", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(90, "z", vertVector)
    vertVector = rotateModel(90, "z", vertVector)
  }
  if(objID == 10 || objID == 13){
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(-90, "z", vertVector)
  }
  if(objID == 16){
    vertVector = rotateModel(90, "z", vertVector)
    vertVector = rotateModel(90, "z", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
  }
  return vertVector
}

export function fomarlRotation(objID, vertVector, normalVector){
  if(objID == 0 || objID == 11){
    vertVector = rotateModel(90, "x", vertVector)
    normalVector = rotateModel(90, "x", normalVector)
    vertVector = rotateModel(90, "x", vertVector)
    normalVector = rotateModel(90, "x", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
  }
  if(objID == 2 || objID == 7){
    vertVector = rotateModel(90, "x", vertVector)
    vertVector = rotateModel(90, "y", vertVector)
    vertVector = rotateModel(-90, "z", vertVector)
  }

  if(objID == 1 || objID == 6 || objID == 5 || objID == 10 || objID == 19){
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
  }
  if(objID == 13 || objID == 16 || objID == 14 || objID == 17 || objID == 3 || objID == 8 || objID == 4 || objID == 9){
    vertVector = rotateModel(-90, "x", vertVector)
    normalVector = rotateModel(-90, "x", normalVector)
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
  }
  if(objID == 12 || objID == 15){
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(-90, "z", vertVector)
    normalVector = rotateModel(-90, "z", normalVector)
  }
  if(objID == 18){
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
    vertVector = rotateModel(90, "z", vertVector)
    normalVector = rotateModel(90, "z", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
    vertVector = rotateModel(90, "y", vertVector)
    normalVector = rotateModel(90, "y", normalVector)
  }
  return [vertVector, normalVector]
}

function rotateModel(degrees, axis, inputVectors){
  let calcMatrix = []
  calcMatrix[0] = []
  calcMatrix[1] = []
  calcMatrix[2] = []
  calcMatrix[3] = []
  let outputVectors = []
  if(axis == "x"){
    let transformMatrix = createTransformMatrix(degrees)
    for(let vert in inputVectors[0]){
      calcMatrix[0].push(inputVectors[0][vert]*transformMatrix[0][0])
      calcMatrix[1].push(inputVectors[2][vert]*transformMatrix[0][1])
      calcMatrix[2].push(inputVectors[0][vert]*transformMatrix[1][0])
      calcMatrix[3].push(inputVectors[2][vert]*transformMatrix[1][1])
    }

    outputVectors[0] = []
    outputVectors[1] = []
    outputVectors[2] = []

    for(let vert in calcMatrix[0]){
      outputVectors[2].push(inputVectors[1][vert])
      outputVectors[0].push((calcMatrix[0][vert]+calcMatrix[2][vert]).toString())
      outputVectors[1].push((calcMatrix[1][vert]+calcMatrix[3][vert]).toString())
    }
  }
  if(axis == "y"){
    let transformMatrix = createTransformMatrix(-degrees)
    for(let vert in inputVectors[0]){
      calcMatrix[0].push(inputVectors[0][vert]*transformMatrix[0][0])
      calcMatrix[1].push(inputVectors[2][vert]*transformMatrix[0][1])
      calcMatrix[2].push(inputVectors[0][vert]*transformMatrix[1][0])
      calcMatrix[3].push(inputVectors[2][vert]*transformMatrix[1][1])
    }

    outputVectors[0] = []
    outputVectors[1] = []
    outputVectors[2] = []

    for(let vert in calcMatrix[0]){
      outputVectors[0].push(inputVectors[1][vert])
      outputVectors[1].push((calcMatrix[0][vert]+calcMatrix[2][vert]).toString())
      outputVectors[2].push((calcMatrix[1][vert]+calcMatrix[3][vert]).toString())
    }
  }
  if(axis == "z"){
    let transformMatrix = createTransformMatrix(-degrees)
    for(let vert in inputVectors[0]){
      calcMatrix[0].push(inputVectors[0][vert]*transformMatrix[0][0])
      calcMatrix[1].push(inputVectors[2][vert]*transformMatrix[0][1])
      calcMatrix[2].push(inputVectors[0][vert]*transformMatrix[1][0])
      calcMatrix[3].push(inputVectors[2][vert]*transformMatrix[1][1])
    }

    outputVectors[0] = []
    outputVectors[1] = []
    outputVectors[2] = []

    for(let vert in calcMatrix[0]){
      outputVectors[1].push(inputVectors[1][vert])
      outputVectors[2].push((calcMatrix[0][vert]+calcMatrix[2][vert]).toString())
      outputVectors[0].push((calcMatrix[1][vert]+calcMatrix[3][vert]).toString())
    }
  }
  return outputVectors
}

function createTransformMatrix(degrees){
  degrees = degToRad(degrees)
  let transformMatrix=[]
  transformMatrix[0]=[]
  transformMatrix[1]=[]
  transformMatrix[0].push(Math.cos(degrees))
  transformMatrix[0].push(Math.sin(-degrees))
  transformMatrix[1].push(Math.sin(degrees))
  transformMatrix[1].push(Math.cos(degrees))
  for(let row in transformMatrix){
    for(let val in transformMatrix[row]){
      let tempVal = transformMatrix[row][val].toString()
      if(tempVal.includes("e-")){
        transformMatrix[row][val] = 0
      }
    }
  }
  return transformMatrix
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

//backface culling
function reverseVertAndNormVectorOrder(vectors){
  for(let vector in vectors){
    vectors[vector] = vectors[vector].reverse()
  }
  return vectors
}
