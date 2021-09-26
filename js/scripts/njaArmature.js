export function hucastArmature(){
  this.mirror = false
  this.default

  this.neck
  this.leftHand
  this.leftElbow
  this.leftShoulder
  this.leftShoulder2
  this.rightHand
  this.rightElbow
  this.rightShoulder
  this.rightShoulder2
  this.chest
  this.leftFoot
  this.leftKnee
  this.leftHip
  this.rightFoot
  this.rightKnee
  this.rightHip
  this.stomach
  this.nadir
  return{
    directionalArmatureView : function(){
      this.neck = "0.obj"
      this.leftHand = "1.obj"
      this.leftElbow = "2.obj"
      this.leftShoulder = "3.obj"
      this.leftShoulder2 = "4.obj"
      this.rightHand = "5.obj"
      this.rightElbow = "6.obj"
      this.rightShoulder = "7.obj"
      this.rightShoulder2 = "8.obj"
      this.chest = "9.obj"
      this.leftFoot = "10.obj"
      this.leftKnee = "11.obj"
      this.leftHip = "12.obj"
      this.rightFoot = "13.obj"
      this.rightKnee = "14.obj"
      this.rightHip = "15.obj"
      this.stomach = "16.obj"
      this.nadir = "17.obj"
    },
    fillArmature : function(){
      this.neck=""
      this.leftHand=""
      this.leftElbow=""
      this.leftShoulder=""
      this.leftShoulder2=""
      this.rightHand=""
      this.rightElbow=""
      this.rightShoulder=""
      this.rightShoulder2=""
      this.chest=""
      this.leftFoot=""
      this.leftKnee=""
      this.leftHip=""
      this.rightFoot=""
      this.rightKnee=""
      this.rightHip=""
      this.stomach=""
      this.nadir=""
      this.default=""
    },
    mirrorArmature : function(){
      this.mirror = true
    },
    useArmature : function(){//objFilePath, objPathList, objPosList){
      let objPathList = []
      let objPosList = []
      if(!this.mirror){
        objPathList = [
          this.neck,
          this.leftHand,
          this.leftElbow,
          this.leftShoulder,
          this.leftShoulder2,
          this.rightHand,
          this.rightElbow,
          this.rightShoulder,
          this.rightShoulder2,
          this.chest,
          this.leftFoot,
          this.leftKnee,
          this.leftHip,
          this.rightFoot,
          this.rightKnee,
          this.rightHip,
          this.stomach,
          this.nadir
        ]
      }else{
        objPathList = [
          this.neck,
          this.leftHand,
          this.leftElbow,
          this.leftShoulder,
          this.leftShoulder2,
          this.leftHand,
          this.leftElbow,
          this.leftShoulder,
          this.leftShoulder2,
          this.chest,
          this.leftFoot,
          this.leftKnee,
          this.leftHip,
          this.leftFoot,
          this.leftKnee,
          this.leftHip,
          this.stomach,
          this.nadir
        ]
      }
      for(let part in objPathList){
        if(objPathList[part] == ""){
          if(this.default != ""){
            objPathList[part] = this.default
          }else{
            objPathList[part] = "0.obj"
          }
        }
        objPosList.push(["0.000000","0.000000","0.000000"])
      }
      return [objPathList, objPosList]
    }
  }
}
/*
export function fomarlArmature(){
  this.mirror = false
  this.default

  this.neck
  this.leftHand
  this.leftElbow
  this.leftShoulder
  this.leftShoulder2
  this.rightHand
  this.rightElbow
  this.rightShoulder
  this.rightShoulder2
  this.chest
  this.leftFoot
  this.leftKnee
  this.leftHip
  this.rightFoot
  this.rightKnee
  this.rightHip
  this.stomach
  this.nadir

  this.unknown1
  this.unknown2
  return{
    directionalArmatureView : function(){
      this.neck = "0.obj"
      this.leftHand = "1.obj"
      this.leftHand2 = "2.obj"
      this.leftElbow = "3.obj"
      this.leftShoulder = "4.obj"
      this.leftShoulder2 = "5.obj"
      this.rightHand = "6.obj"
      this.rightHand2 = "7.obj"
      this.rightElbow = "8.obj"
      this.rightShoulder = "9.obj"
      this.rightShoulder2 = "10.obj"
      this.chest = "11.obj"
      this.leftFoot = "12.obj"
      this.leftKnee = "13.obj"
      this.leftHip = "14.obj"
      this.rightFoot = "15.obj"
      this.rightKnee = "16.obj"
      this.rightHip = "17.obj"
      this.stomach = "1.obj"
      this.nadir = "0.obj"
    },
    fillArmature : function(){
      this.neck=""
      this.leftHand=""
      this.leftHand2=""
      this.leftElbow=""
      this.leftShoulder=""
      this.leftShoulder2=""
      this.rightHand=""
      this.rightHand2=""
      this.rightElbow=""
      this.rightShoulder=""
      this.rightShoulder2=""
      this.chest=""
      this.leftFoot=""
      this.leftKnee=""
      this.leftHip=""
      this.rightFoot=""
      this.rightKnee=""
      this.rightHip=""
      this.stomach=""
      this.nadir=""
      this.default=""
    },
    mirrorArmature : function(){
      this.mirror = true
    },
    useArmature : function(objFilePath, objPathList, objPosList){
      objPathList = []
      objPosList = []
      if(!this.mirror){
        objPathList = [
          this.neck,
          this.leftHand,
          this.leftHand2,
          this.leftElbow,
          this.leftShoulder,
          this.leftShoulder2,
          this.rightHand,
          this.rightHand2,
          this.rightElbow,
          this.rightShoulder,
          this.rightShoulder2,
          this.chest,
          this.leftFoot,
          this.leftKnee,
          this.leftHip,
          this.rightFoot,
          this.rightKnee,
          this.rightHip,
          this.stomach,
          this.nadir
        ]
      }else{
        objPathList = [
          this.neck,
          this.leftHand,
          this.leftHand2,
          this.leftElbow,
          this.leftShoulder,
          this.leftShoulder2,
          this.leftHand,
          this.leftHand2,
          this.leftElbow,
          this.leftShoulder,
          this.leftShoulder2,
          this.chest,
          this.leftFoot,
          this.leftKnee,
          this.leftHip,
          this.leftFoot,
          this.leftKnee,
          this.leftHip,
          this.stomach,
          this.nadir
        ]
      }
      for(let part in objPathList){
        if(objPathList[part] == ""){
          if(this.default != ""){
            objPathList[part] = this.default
          }else{
            objPathList[part] = "0.obj"
          }
        }
        objPosList.push(["0.000000","0.000000","0.000000"])
      }
      return [objPathList, objPosList]
    }
  }
}
*/
