import * as parsingTools from './parsingTools.js';

export function parseExMldNetScan(scan){
  let scanInfo = reformatScan(scan)
  let nodePositions = extractNodePositionFromScan(scanInfo[0], scanInfo[1])
  return parseNodeObjects(scanInfo[0], scanInfo[1], nodePositions)
}

function extractNodePositionFromScan(scan, nodeCount){
  let nodePositions = []
  let nodePositionsMod = []
  let tempPos = ""
  let exSkipText = 3
  for(let nodeID = 0; nodeID < nodeCount; nodeID++){
    if(nodeID > 9){
      exSkipText = 4
    }
    let startAt = scan.indexOf(`@${nodeID} `)+exSkipText
    for(let i = startAt; i < startAt+10; i++){
      tempPos += scan.charAt(i)
    }
    nodePositions.push((tempPos-8).toString(16))
    tempPos = ""
  }
  for(let pos in nodePositions){
    let tempString = ""
    while(tempString.length < (10-nodePositions[pos].length)){
      if(tempString.length < 2){
        tempString += "0x"
      }else{
        tempString += "0"
      }
    }
    tempString += nodePositions[pos].toUpperCase()
    nodePositionsMod.push(tempString)
    tempString = ""
  }
  return nodePositionsMod
}

function parseNodeObjects(scan, nodeCount, nodePositions){
  let node = ""
  let parsedNodes = []
  for(let nodeID = 0; nodeID < nodeCount; nodeID++){
    let nodeDataTypes = ["EvalFlags", "ModelData", "Translate", "Rotation", "Scale", "ChildNode", "SiblingNode", "Center", "Radius"]
    if(nodeID == nodeCount-1){
      node = parsingTools.isolateStringRange(scan, `@${nodeID}`, `##`, false)
    }else{
      node = parsingTools.isolateStringRange(scan, `@${nodeID}`, `@${nodeID+1}`, false)
    }
    scan = scan.slice(node.length)
    node = node.slice(11, node.length-2).split(' ').join('').replace('\n', '')
    if(node.includes("ModelData@")){
      let nodeSec0 = node.slice(0, node.search("ModelData@"))
      let nodeSec1 = node.slice(node.search("Center"))
      node = nodeSec0+nodeSec1
    }
    let parsedNode = parseExMldNetListDesign(node, nodeDataTypes)
    parsedNode = cleanNodeObject(parsedNode, nodePositions, nodeID)
    parsedNodes.push(parsedNode)
  }
  return parsedNodes
}

function parseExMldNetListDesign(objectType, dataTypes){
  let parsedList = []
  let nodeData = ""
  let addChar = false
  let tempData = ""
  for(let dataType in dataTypes){
    nodeData = objectType.replace(dataTypes[dataType]+"=", "$")
    let startAt = nodeData.toString().indexOf('\$')
    if(dataType == 0 || dataType == 1 || dataType == 5 || dataType == 6){
      for(let i = startAt; i < startAt+11; i++){
        tempData+=nodeData[i]
      }
      parsedList.push(tempData)
      tempData = ""
      addChar = false
    }else if(dataType == 2 || dataType == 3 || dataType == 4 || dataType == 7 || dataType == 8){
      for(let i = 0; i < nodeData.length; i++){
        if(nodeData.charAt(i) == "$"){
          addChar = true
        }
        if(addChar){
          if(nodeData.charAt(i) != 'x' && parsingTools.isLetter(nodeData.charAt(i))){
            parsedList.push(tempData)
            tempData = "";
            addChar = false
          }else{
            if(nodeData.charAt(i) != '\r' && nodeData.charAt(i) != '\n'){
              tempData += nodeData[i]
            }
          }
        }
        if(i == nodeData.length-1 && dataType == dataTypes.length-1){
          parsedList.push(tempData)
        }
      }
    }

    for(let value in parsedList){
      parsedList[value] = parsedList[value].replace('$', '')
    }
  }
  return parsedList
}

function cleanNodeObject(nodeObjectData, nodePositions, nodeID){
  let cleanedData = []
  let tempNodeObjectData = []
  let childData = ""
  let siblingData = ""
  cleanedData.push(nodeObjectData[0])
  for(let value in nodeObjectData){
    if(value == 1){
      cleanedData.push(offsetIsNotNull(nodeObjectData[value]))
    }
    if(value == 2 || value == 3 || value == 4){
      tempNodeObjectData.push(nodeObjectData[value])
    }
  }
  cleanedData.push(convertVectorStringToAL(tempNodeObjectData, true))
  tempNodeObjectData = []

  for(let value in nodeObjectData){
    if(value == 5 || value == 6){
      cleanedData.push(offsetIsNotNull(nodeObjectData[value]))
      if(value == 6){
        childData = nodeObjectData[value-1]
        cleanedData.push(childData)
        siblingData = nodeObjectData[value]
        cleanedData.push(siblingData)
        cleanedData.push(nodePositions[nodeID])
      }
    }
    if(nodeObjectData[1] != "0x00000000"){
      if(value == 7){
        tempNodeObjectData.push(nodeObjectData[value])
      }
      if(value == 8){
        cleanedData.push(nodeObjectData[value])
      }
    }
  }
  return cleanedData
}

function convertVectorStringToAL(strings, fromNode){
  let dimensionArr = []
  let tempValue = ""
  let tempNodeObjectDataValue = []
  for(let value in strings){
    for(let i = 0; i < strings[value].length; i++){
      if(strings[value].charAt(i) == ","){
        tempNodeObjectDataValue.push(tempValue)
        tempValue = ""
      }else{
        tempValue += strings[value].charAt(i)
      }
      if(i == strings[value].length-1){
        tempNodeObjectDataValue.push(tempValue)
      }
    }
    tempValue = ""
  }
  let ta = tempNodeObjectDataValue
  if(fromNode){
    dimensionArr = [ta[0], ta[1], ta[2], ta[3], ta[4], ta[5], ta[6], ta[7], ta[8]]
  }else{
    dimensionArr = [ta[0], ta[1], ta[2]]
  }
  return dimensionArr
}

function reformatScan(scan){
  let countComplete = false
  let tempNodeCount = 0
  let tempModelCount = 0
  while(!countComplete){
    if(!scan.includes("Node Data @")){
      countComplete = true
    }else{
      scan = scan.replace("Node Data @", "@"+tempNodeCount)
      tempNodeCount+=1
    }
  }
  scan = scan + "##"
  return [scan, tempNodeCount]
}

function offsetIsNotNull(value){
  let isNotNull = (value == "0x00000000" ? false : true)
  return isNotNull
}
