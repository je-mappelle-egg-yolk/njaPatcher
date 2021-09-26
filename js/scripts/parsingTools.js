export function isolateStringRange(string, from, to, includeStart){
  let cutText = [from, to]
  let s = searchString(string, cutText[0]) // start
  let e = searchString(string, cutText[1]) // end
  if(includeStart){
    let includedString = string.substring(s-cutText[0].length, e-cutText[1].length)
    return includedString
  }else{
    let excludedString = string.substring(s, e-cutText[1].length)
    return excludedString
  }
}

function searchString(string, value){
  let stopSearchAt = string.search(value)
  let stopSeachAtWithOffset = string.search(value) + value.length
  return stopSeachAtWithOffset
}

export function isLetter(string){
  return string.length === 1 && string.match(/[a-z]/i);
}
