//Can reduce browser memory massively here
export function bindModelDataWithExMldNetScan(modelData, exMLDTemplate){
  let bindedModelData = [...modelData]
  exMLDTemplate = exMLDTemplate.reverse()
  let originalModelDataCount = 0
  for(let node in exMLDTemplate){
    if(exMLDTemplate[node].length != 9){
      bindedModelData[node] = [...modelData[0]]
      bindedModelData[node][8] = false
    }else if(exMLDTemplate[node].length == 9){
      bindedModelData[node] = modelData[originalModelDataCount]
      originalModelDataCount+=1
    }
    bindedModelData[node][7] = exMLDTemplate[node][2]
  }
  return bindedModelData
}


export function bindDataLength(arr, exMLDTemplate){
  let bindedData = [...arr]
  let originalModelDataCount = 0
  for(let node in exMLDTemplate){
    if(exMLDTemplate[node].length != 9){
      bindedData[node] = [...arr[0]]
    }else if(exMLDTemplate[node].length == 9){
      bindedData[node] = arr[originalModelDataCount]
      originalModelDataCount+=1
    }
  }
  return bindedData
}
