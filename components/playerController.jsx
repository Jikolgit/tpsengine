import { AudioManage } from "./audioComponents";

export function movePlayer(objArg)

{   //EX Move to x = 1.5

if(objArg.moveDirection.value == 'LEFT')
{   //playerPositionOnMap est déja actualisée
objArg.getPlayerPosition.value = objArg.playerCursorRef.current.position.x;
objArg.getCameraPOsition.value = objArg.camRef.current.position.x;
objArg.getorbitPosition.value = objArg.orbitRef.current.target.x
objArg.getPlayerPosition.value += objArg.playerSpeed;
objArg.getCameraPOsition.value += objArg.playerSpeed;
objArg.getorbitPosition.value += objArg.playerSpeed;

}
else if(objArg.moveDirection.value == 'RIGHT')
{
objArg.getPlayerPosition.value = objArg.playerCursorRef.current.position.x;
objArg.getCameraPOsition.value = objArg.camRef.current.position.x;
objArg.getorbitPosition.value = objArg.orbitRef.current.target.x
objArg.getPlayerPosition.value -= objArg.playerSpeed;
objArg.getCameraPOsition.value -= objArg.playerSpeed
objArg.getorbitPosition.value -= objArg.playerSpeed

}
else if(objArg.moveDirection.value == 'FRONT')
{
  objArg.getPlayerPosition.value = objArg.playerCursorRef.current.position.z;
  objArg.getCameraPOsition.value = objArg.camRef.current.position.z;
  objArg.getorbitPosition.value = objArg.orbitRef.current.target.z
  objArg.getPlayerPosition.value += objArg.playerSpeed;
  objArg.getCameraPOsition.value += objArg.playerSpeed;
  objArg.getorbitPosition.value += objArg.playerSpeed

}
else if(objArg.moveDirection.value == 'BACK')
{
  objArg.getPlayerPosition.value = objArg.playerCursorRef.current.position.z;
  objArg.getCameraPOsition.value = objArg.camRef.current.position.z;
  objArg.getorbitPosition.value = objArg.orbitRef.current.target.z
  objArg.getPlayerPosition.value -= objArg.playerSpeed;
  objArg.getCameraPOsition.value -= objArg.playerSpeed;
  objArg.getorbitPosition.value -= objArg.playerSpeed;

}
objArg.playerDistance.value += objArg.playerSpeed;
objArg.getPlayerPosition.value = Math.round(objArg.getPlayerPosition.value * 100) / 100;
objArg.getorbitPosition.value = Math.round(objArg.getorbitPosition.value * 100) / 100;
objArg.getCameraPOsition.value = Math.round(objArg.getCameraPOsition.value * 100) / 100;
objArg.playerDistance.value = Math.round(objArg.playerDistance.value * 100) / 100;
if(objArg.moveDirection.value == 'LEFT' || objArg.moveDirection.value == 'RIGHT')
{
objArg.playerCursorRef.current.position.x = objArg.getPlayerPosition.value

for(let i =0;i<objArg.bulletRef.current.length;i++)
{
  if(!objArg.bulletRefInfo.current[i].isShooted)
  {
      objArg.bulletRef.current[i].position.x = objArg.getPlayerPosition.value
  }
  
}
objArg.orbitRef.current.target.x = objArg.getorbitPosition.value
objArg.camRef.current.position.x = objArg.getCameraPOsition.value

}
if(objArg.moveDirection.value == 'FRONT' || objArg.moveDirection.value == 'BACK')
{
objArg.playerCursorRef.current.position.z = objArg.getPlayerPosition.value;
for(let i =0;i<objArg.bulletRef.current.length;i++)
{
  if(!objArg.bulletRefInfo.current[i].isShooted)
  {
      objArg.bulletRef.current[i].position.z = objArg.getPlayerPosition.value
  }
}
objArg.orbitRef.current.target.z = objArg.getorbitPosition.value
objArg.camRef.current.position.z = objArg.getCameraPOsition.value;


}

if(objArg.objectCanMove.current.active) 
{
    objArg.itemController.value[objArg.objectCanMove.current.index]('MOVE-BOMB',{direction:objArg.moveDirection.value,speed:objArg.playerSpeed})
}

if(objArg.playerDistance.value == objArg.playerDistanceTarget.value)
{
//Le déplacement est terminé
//Mais avant de vérifier si la clé est appuyée on doit verifier les ordres de priorité
// est ce qu'il y a un objet ? est ce que la case est vide ?
//Sera vérifié une seule fois dans le addEventListener avant de declencher le move
objArg.playerDistance.value = 0;
objArg.playerMoveIsActive.current = false;

if(objArg.objectCanMove.current.active)
{
    if(objArg.objectCanMove.current.objInfo.objectName == 'bomb_item')
    {
        objArg.itemController.value[objArg.objectCanMove.current.index]('ROLL-STOP',null)
    }
    
    effectAfterMoveFinished(objArg);
}
objArg.objectCanMove.current.active = false;
objArg.objectCanMove.current.index = null;
objArg.objectCanMove.current.objInfo = null;

objArg.takeObjectOnPlayerPosition()
// getCurrentPlatformInfo();
// objArg._appContext.mobCallBackAfterPlayerMove.current();
for(let i = 0; i<objArg.mobObjectIdArr.value.length;i++ )
{
    objArg.mobUpdateFunc.current[objArg.mobObjectIdArr.value[i]]('CHECK-AREA')
}

objArg.getNextPlatformInfo(objArg.playerDirection,'AfterMove');
if(objArg.aKeyisPressed.current)
{
  //Le mouvement doit continuer
 

  
  preparePlayerMove(objArg)
  
}
else
{
  
  
  // playerMoveIsActive.current = false;
}

}

}
export function preparePlayerMove(objArg)
    {
        objArg.objetDirection.current = [false,false,false,false];
        let index = 0;
        objArg.moveDirection.value = objArg.directionToGo.value ; 
         // INFORMATION SUR LA PLATEFORME SUR LA QUELLE ONT VA MONTER OU PAS
            
         let checkResult = checkifElemCanMoveNextPlatform(objArg)
                if(checkResult)
                {
                    if(objArg.directionToGo.value == 'LEFT'){index = 0}
                    if(objArg.directionToGo.value == 'RIGHT'){index = 1}
                    if(objArg.directionToGo.value == 'FRONT'){index = 2}
                    if(objArg.directionToGo.value == 'BACK'){index = 3}

                   
                        
                    updatePlayerPositionOnMap(objArg)
                    AudioManage.play('walk')
                      
                    objArg.playerMoveIsActive.current = true
                    objArg.aKeyisPressed.current = true 
                    
                    
                }
                else{objArg.playerMoveIsActive.current = false}
        
        
    }
function updatePlayerPositionOnMap(objArg)
    {   
        if(objArg.directionToGo.value == 'LEFT'){ objArg.playerPositionOnMap.x += objArg.playerDistanceTarget.value;}
        else if(objArg.directionToGo.value == 'RIGHT'){ objArg.playerPositionOnMap.x -= objArg.playerDistanceTarget.value;}
        else if(objArg.directionToGo.value == 'FRONT'){ objArg.playerPositionOnMap.z += objArg.playerDistanceTarget.value;}
        else if(objArg.directionToGo.value == 'BACK'){ objArg.playerPositionOnMap.z -= objArg.playerDistanceTarget.value;}
    }
function updateObjectPositionOnMap(objArg,objectInfo)
    {   
        let currentObjectPlatformIndex=objectInfo.id;
        let nextPlatformPose;
        let findNextPlatform;
        if(objArg.directionToGo.value == 'FRONT'){nextPlatformPose = {x:objectInfo.xPose,z:objectInfo.zPose+ objArg.playerDistanceTarget.value}}
        if(objArg.directionToGo.value == 'BACK'){nextPlatformPose = {x:objectInfo.xPose,z:objectInfo.zPose- objArg.playerDistanceTarget.value}}
        if(objArg.directionToGo.value == 'LEFT'){nextPlatformPose = {x:objectInfo.xPose+ objArg.playerDistanceTarget.value,z:objectInfo.zPose} }
        if(objArg.directionToGo.value == 'RIGHT'){nextPlatformPose = {x:objectInfo.xPose- objArg.playerDistanceTarget.value,z:objectInfo.zPose} }
        
       
        let getNextPlatform = (elem)=>
        {
            return elem.xPose == nextPlatformPose.x && elem.zPose == nextPlatformPose.z
        }
        findNextPlatform = objArg.GameMap.find(getNextPlatform);
        if(objArg.GameMap[findNextPlatform.id]?.primaryObject)
        {   
            objArg.objectCanMove.current.portalModelID = objArg.GameMap[findNextPlatform.id].primaryObject.objectId;
            
        }

        objArg.GameMap[findNextPlatform.id].object = true
        objArg.GameMap[findNextPlatform.id].isOnScene = true
        objArg.GameMap[findNextPlatform.id].objectType = structuredClone(objArg.GameMap[currentObjectPlatformIndex].objectType)
        objArg.GameMap[findNextPlatform.id].objectId = structuredClone(objArg.GameMap[currentObjectPlatformIndex].objectId)
        objArg.GameMap[findNextPlatform.id].objectDesc = structuredClone(objArg.GameMap[currentObjectPlatformIndex].objectDesc);
        // console.log(objectInfo.objectDesc.objectName)
        if(objArg.GameMap[findNextPlatform.id]?.primaryObject)
        {
                if(objArg.GameMap[findNextPlatform.id].primaryObject.name == 'portal_item' && objectInfo.objectDesc.objectName=='battery_item')
                {       
                    if(objArg.GameMap[findNextPlatform.id].primaryObject.portalID == objectInfo.objectDesc.dObjectID )
                    {
                        objArg.GameMap[findNextPlatform.id].objectDesc.canMove = false;
                        objArg.objectCanMove.current.effectAfterMove = 'PLACE-BATTERY'
                    }
        
                    
                }
                else
                {
                    console.log('non')
                }
        }


        objArg.GameMap[currentObjectPlatformIndex].object = false
        objArg.GameMap[currentObjectPlatformIndex].isOnScene = false
        objArg.GameMap[currentObjectPlatformIndex].objectType = "none"
        objArg.GameMap[currentObjectPlatformIndex].objectId = "none"
        objArg.GameMap[currentObjectPlatformIndex].objectDesc = null
        

        
    }
function checkIfObjectCanMoveNextPlatform(objArg,objectInfo,directionToGo)
{
        let nextPlatformInfo={x:objectInfo.xPose,z:objectInfo.zPose};
        let findPlatform;
        let checkPlatform = (elem)=>
        {
            return elem.xPose == nextPlatformInfo.x && elem.zPose == nextPlatformInfo.z
        }

        if(directionToGo == 'FRONT'){nextPlatformInfo.z = objectInfo.zPose + objArg.playerDistanceTarget.value }
        if(directionToGo == 'BACK'){nextPlatformInfo.z = objectInfo.zPose - objArg.playerDistanceTarget.value }
        if(directionToGo == 'LEFT'){nextPlatformInfo.x = objectInfo.xPose + objArg.playerDistanceTarget.value }
        if(directionToGo == 'RIGHT'){nextPlatformInfo.x = objectInfo.xPose - objArg.playerDistanceTarget.value }

        findPlatform = objArg.GameMap.find(checkPlatform);
        
        if(findPlatform.object || findPlatform.objectLimit)
        {
            
            if(!findPlatform.objectLimit && findPlatform.objectDesc.objectName == 'portal_item')
            {
                // if(findPlatform.objectDesc.objectName == 'portal_item')
                // {   
                //     objArg.objectCanMove.current.effectAfterMove = 'STOP-MOVING'
                // }
                return true;
            }
            else
            {
                return false
            }
            
        }
        else
        {
            return true
        }
        
}

function effectAfterMoveFinished(objArg)
{   
    if(objArg.objectCanMove.current.effectAfterMove == 'PLACE-BATTERY')
    {   
        objArg.itemController.value[objArg.objectCanMove.current.portalModelID]('BLUE')   
        objArg.managePlayerBattery();
        objArg.objectCanMove.current.effectAfterMove = 'none'
    }
    
    // let checkPlatform = (elem)=>
    // {
    //     return elem.xPose == objArg.objectCanMove.current.objInfo.xPose && elem.zPose == objArg.objectCanMove.current.objInfo.zPose 
    // }
    // let _result = objArg.GameMap.find(checkPlatform);
    // console.log(_result)
}
function checkifElemCanMoveNextPlatform(objArg)
        {
            
            let checkPlatform = (elem)=>
                {
                    return elem.xPose == objArg.playerPositionOnMap.x && elem.zPose == objArg.playerPositionOnMap.z 
                }

            let _result
            // if(_direction == 'LEFT')
            // {
                // On vérifie d'abord si on est devant un block dans ce cas on suit le block
                        if(objArg.directionToGo.value == 'LEFT'){objArg.playerPositionOnMap.x += (objArg.playerDistanceTarget.value);}
                        if(objArg.directionToGo.value == 'RIGHT'){objArg.playerPositionOnMap.x -= (objArg.playerDistanceTarget.value);}
                        if(objArg.directionToGo.value == 'FRONT'){objArg.playerPositionOnMap.z += (objArg.playerDistanceTarget.value);}
                        if(objArg.directionToGo.value == 'BACK'){objArg.playerPositionOnMap.z -= (objArg.playerDistanceTarget.value);}
                    
                    _result = objArg.GameMap.find(checkPlatform);
                    
                    // objectOnMapRef.current = _result

                        if(objArg.directionToGo.value == 'LEFT'){objArg.playerPositionOnMap.x -= (objArg.playerDistanceTarget.value);}
                        if(objArg.directionToGo.value == 'RIGHT'){objArg.playerPositionOnMap.x += (objArg.playerDistanceTarget.value);}
                        if(objArg.directionToGo.value == 'FRONT'){objArg.playerPositionOnMap.z -= (objArg.playerDistanceTarget.value);}
                        if(objArg.directionToGo.value == 'BACK'){objArg.playerPositionOnMap.z += (objArg.playerDistanceTarget.value);}
                        
                    
                    // objArg.getNextPlatformInfo(objArg.playerDirection,'BeforeMove')
                    if(_result === undefined)
                    {
                        return false
                    }
                    else
                    {
                        if(_result.active)
                        {   
                            
                            // On vérifie si c'est un joueur ou un objet qui a fait la vérification
                            

                                if(_result.object)
                                {
                                    if(_result.isOnScene)
                                    {

                                        if(_result.objectType == 'bomb')
                                        {
                                            if(objArg.directionToGo.value == 'LEFT'){objetDirection.current[0]=true}
                                            if(objArg.directionToGo.value == 'RIGHT'){objetDirection.current[1]=true}
                                            if(objArg.directionToGo.value == 'FRONT'){objetDirection.current[2]=true}
                                            if(objArg.directionToGo.value == 'BACK'){objetDirection.current[3]=true}
                                            return true;
                                        }
                                        else if(_result.objectType == 'wall')
                                        {
                                            if(_result.objectType == 'wall' && !_result.objectDesc.destructible)
                                            {
                                                return false
                                            } 
                                            else
                                            {
                                                return true
                                            }
                                        }
                                        else if(_result.objectType == 'decor')
                                        {
                                            return false;
                                        }
                                        else if(_result.objectType == 'barier')
                                        {
                                            if(_result.objectDesc.pass)
                                            {
                                                return true
                                            }
                                            else
                                            {
                                                return false
                                            }
                                        }
                                        else if(_result.objectType == 'item')
                                        {
                                           
                                            if(_result.objectDesc.objectName == 'bomb_item' || _result.objectDesc.objectName == 'battery_item')
                                            {
                                                if(_result.objectDesc.canMove)
                                                {
                                                    let objectCanMove = checkIfObjectCanMoveNextPlatform(objArg,_result,objArg.moveDirection.value);
                                                
                                                    if(objectCanMove)
                                                    {
                                                        objArg.objectCanMove.current.active = true;
                                                        objArg.objectCanMove.current.objInfo = _result;
                                                        objArg.objectCanMove.current.index = _result.objectId;
                                                        
                                                        if(_result.objectDesc.objectName == 'bomb_item' && _result.objectDesc.skin == 'bomb_item_1')
                                                        {
                                                            objArg.itemController.value[_result.objectId]('ROLL-BOMB',objArg.moveDirection.value)
                                                        }
                                                        
                                                        updateObjectPositionOnMap(objArg,_result)
                                                        return true;
                                                    }
                                                    else
                                                    {
                                                        if(_result.objectDesc.objectName == 'bomb_item' && _result.objectDesc.skin == 'bomb_item_1')
                                                        {
                                                            objArg.itemController.value[_result.objectId]('ROLL-STOP',null) 
                                                        }
                                                        
                                                        return false;
                                                    }
                                                }
                                                else
                                                {
                                                    return false;
                                                }
                                                
                                                
                                            }
                                            else if(_result.objectDesc.objectName == 'coin_item')
                                            {
                                                return true;
                                            }
                                            else if(_result.objectDesc.objectName == 'portal_item')
                                            {
                                                return true;
                                            }
                                            else
                                            {
                                                return false;
                                            }
                                            
                                            
                                            
                                        }
                                        else if(_result.objectType == 'dynamic_object')
                                            {
                                               
                                                if(_result.objectDesc.canMove)
                                                {
                                                    let objectCanMove = checkIfObjectCanMoveNextPlatform(objArg,_result,objArg.moveDirection.value);
                                                
                                                    if(objectCanMove)
                                                    {
                                                        objArg.objectCanMove.current.active = true;
                                                        objArg.objectCanMove.current.objInfo = _result;
                                                        objArg.objectCanMove.current.index = _result.objectId;
                                                        if(_result.objectDesc.objectName == 'bomb_item' && _result.objectDesc.skin == 'bomb_item_1')
                                                        {
                                                            objArg.itemController.value[_result.objectId]('ROLL-BOMB',objArg.moveDirection.value)
                                                        }
                                                        
                                                        updateObjectPositionOnMap(objArg,_result)
                                                        return true;
                                                    }
                                                    else
                                                    {
                                                        if(_result.objectDesc.objectName == 'bomb_item' && _result.objectDesc.skin == 'bomb_item_1')
                                                        {
                                                            objArg.itemController.value[_result.objectId]('ROLL-STOP',null) 
                                                        }
                                                        
                                                        return false;
                                                    }
                                                }
                                                else
                                                {
                                                    return false
                                                }
                                                
                                            }
                                        else if(_result.objectType == 'Exitdoor' || _result.objectType == 'Exitdoor_Area')
                                        {
                                            return false
                                        }
                                    }
                                    else
                                    {
                                        return true;
                                    } 
                                    
                                    
                                }
                                else
                                {
                                    if(_result.hasEnemy)
                                    {   
                                        return false
                                    }
                                    else
                                    {
                                        if(_result.objectLimit && objArg._appContext.setMapWall.current)
                                        {
                                            return false;
                                        }
                                        else
                                        {
                                            return true;
                                        }
                                        
                                    }
                                    
                                }
                                
                            
                                
                        }
                        else
                        {
                            
                            return false
                        }
                        
                        
                    }
                

        }

export let rotateCam = (gloBalObject)=>
    {

            if(gloBalObject.camRotateInfo.left.xCamValue > gloBalObject.camRotateInfo.left.x){gloBalObject.camRotateInfo.left.xCamValue -= 0.1;}
            else{gloBalObject.camRotateInfo.left.xCamValue += 0.1;}
            if(gloBalObject.camRotateInfo.left.zCamValue > gloBalObject.camRotateInfo.left.z){gloBalObject.camRotateInfo.left.zCamValue -= 0.1;}
            else{gloBalObject.camRotateInfo.left.zCamValue += 0.1;}

           
            
            gloBalObject.camRotateInfo.left.xCamValue  = Math.round(gloBalObject.camRotateInfo.left.xCamValue*100)/100;
            gloBalObject.camRotateInfo.left.zCamValue  = Math.round(gloBalObject.camRotateInfo.left.zCamValue*100)/100;
            
            gloBalObject.orbitRef.current.target.x = gloBalObject.camRotateInfo.left.xCamValue
            gloBalObject.orbitRef.current.target.z = gloBalObject.camRotateInfo.left.zCamValue
            if(gloBalObject.camRotateInfo.left.xCamValue == gloBalObject.camRotateInfo.left.x)
            {
                gloBalObject.spearScale(1)
                rotateCam_CallBack(gloBalObject);
            }
        
        
    }
function rotateCam_CallBack(gloBalObject)
    {
        if(gloBalObject.playerDirection.value == 'LEFT')
        {
            gloBalObject.playerCursorRef.current.rotation.y = Math.PI*0.5
            
            for(let i =0;i<gloBalObject.bulletRef.current.length;i++)
            {
                if(!gloBalObject.bulletRefInfo.current[i].isShooted)
                {
                    gloBalObject.bulletRef.current[i].rotation.y = Math.PI*0.5
                }
                
            }
        }
        else if(gloBalObject.playerDirection.value == 'BACK')
        {
            gloBalObject.playerCursorRef.current.rotation.y = Math.PI*1
            for(let i =0;i<gloBalObject.bulletRef.current.length;i++)
            {
                if(!gloBalObject.bulletRefInfo.current[i].isShooted)
                {
                    gloBalObject.bulletRef.current[i].rotation.y = Math.PI*1
                }
                
            }
        }
        else if(gloBalObject.playerDirection.value == 'RIGHT')
        {
            gloBalObject.playerCursorRef.current.rotation.y = Math.PI*1.5
            for(let i =0;i<gloBalObject.bulletRef.current.length;i++)
            {
                if(!gloBalObject.bulletRefInfo.current[i].isShooted)
                {
                    gloBalObject.bulletRef.current[i].rotation.y = Math.PI*1.5
                }
                
            }
        }
        else if(gloBalObject.playerDirection.value == 'FRONT')
        {
            gloBalObject.playerCursorRef.current.rotation.y = Math.PI*2
            for(let i =0;i<gloBalObject.bulletRef.current.length;i++)
            {
                if(!gloBalObject.bulletRefInfo.current[i].isShooted)
                {
                    gloBalObject.bulletRef.current[i].rotation.y = Math.PI*2
                }
                
            }
        }

        

        gloBalObject.getNextPlatformInfo(gloBalObject.playerDirection,'AfterMove')
        gloBalObject.camRotateStart.current = false;
        // playerCursorRef.current.position.x = camRotateInfo.left.x;
        // playerCursorRef.current.position.z = camRotateInfo.left.z;

        gloBalObject.playerMoveIsActive.current = false
    }
