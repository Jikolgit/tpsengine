import * as THREE from "three"
import { createContext, useContext, useEffect, useRef } from "react"
import { gameAppContext } from "./GameApp"
import { useFrame } from "@react-three/fiber";
import { MobLifeBar } from "./GameUI";
import { ItemType1Model, EnemyBullet, Mob_1_model, ItemType2Model } from "./Game3DAssets";
import { appContext } from "../src/App";
import { AudioManage } from "./audioComponents";
import { CustomCounter } from "./utils";
export let mobContext = createContext(null)
//MOB_2
//NE BOUGE PAS MAIS TIRE LORSQU'ON SE RETROUVE SUR SON AXE PAR INTERVALLE
export function Mob_3(props)
{
    let _appContext = useContext(appContext);
    let _gameAppContext = useContext(gameAppContext);
    
    const GameMap = _gameAppContext.GameMap;
    let mobPositionOnMap = {x:props.x,y:0,z:props.z};
    let itemController = {value:[]};
    let enemyController = useRef(null);
    let bulletGroupRef = useRef(null);
    let lifeBarFunc = useRef(null);
    let lifeBarController = useRef(null);
    let mobShootAnimationOver = useRef(false);
    let keyRef = useRef(null);
    let checkOnce = true;
    let distanceInscrementation=0;
    let playerIsAlreadyOnAxis = {front:false,back:false,left:false,right:false};
    
    let bulletSpeed = 0.1*5;  //2 | 5
    let locatePlayer = false;
    let mobBulletRef = useRef([]);
    let mobBulletInfo = [];
    let mobBulletModel = [];
    let playerDirectionToMob = 'none';
    let mobState = 'Alive';
    let mobEffectCounterStart = false;
    let mobEffectCounter = 100;
    let mobSpec = useRef({shootSpeed:40})
    let mobDeadCallBack; 

    if(props.mobDifficulty == 'hard')
    { 
        mobSpec.current.shootSpeed = 10
    }
    else if(props.mobDifficulty == 'medium')
    {
        mobSpec.current.shootSpeed = 40
    }
    let startMobEffectCounter = ()=>
        {
            mobEffectCounter --;
            if(mobEffectCounter == 0)
            {
                
                enemyController.current('REMOVE-MOB');
                bulletGroupRef.current.visible = false;
                
                _appContext.devMode.current && lifeBarController.current("REMOVE");
                if(props.hasObject)
                {
                    itemController.value[0]('SHOW-ITEM')
                    // keyRef.current.visible = true;
                    
                }
                mobDeadCallBack();
            }
        }
    for(let i =0; i< 10;i++)
    {
        mobBulletInfo[i] = {index:i,checkOnce:false,isShooted:false,bulletNextMove:'none',bulletDirection:'none',bulletDistance:2,
                            posX:mobPositionOnMap.x,posZ:mobPositionOnMap.z,count:0,countBeforeShootOver:false
                            }
        mobBulletModel[i] = 
                                <EnemyBullet key={i} _i={i} _ref={(val)=>mobBulletRef.current[i] = val}
                                _position={[mobPositionOnMap.x,0.5,mobPositionOnMap.z]}  />
                            
    }

    let updateMobInfo = (state,_numb)=>
        {
            if(state == 'dead')
            {
                mobState = 'Dead';
                mobEffectCounterStart = true;
                mobDeadCallBack = _numb
                

            }
            else if(state == 'Update-Mob-Life')
            {  
                
                if(!locatePlayer)
                {
                    locatePlayer = true;
                    gotToPlayerAxe(GameMap.find(getPlayerIndexPosition).id);
                }
                enemyController.current('MOB-TOUCHED')
                // lifeBarFunc.current(_numb)
                
                _appContext.devMode.current &&  lifeBarController.current('UPDATE-MOB-LIFE')
            }
            else if(state == 'Remove-Object')
            {
                
                itemController.value[0]('REMOVE-ITEM')
                // keyRef.current.visible = false
            }
            else if(state == 'CHECK-AREA')
            {
                if(!locatePlayer)
                {
                        if(mobState=='Alive')
                        {   
                            checkIfPlayerIsOnMobArea();
                        }
                }
            }
            
        }
    let lookForFreeMobBullet = ()=>
        {
            let checkForFreeMobBullet = (elem)=>
            {
                return !elem.isShooted; 
            }
            let result = mobBulletInfo.find(checkForFreeMobBullet);
            return result;
        }
    let prepareBulletAnimation = ()=>
        {
            if(props._attack)
            {
                let freeBulletElem = lookForFreeMobBullet();
            
                freeBulletElem.isShooted = true;
                freeBulletElem.bulletDirection = playerDirectionToMob;
                freeBulletElem.count = mobSpec.current.shootSpeed
            }

            
        }
    let beforeBulletAnimation = (index,bulletDirection)=> //AVANT Chaque animation de la balle
        {
            // CHECK NEXT PLATFORM RETURN TRUE OR FALSE
            if(bulletDirection == 'FRONT')
            {
                mobBulletInfo[index].posZ += mobBulletInfo[index].bulletDistance
            }
            if(bulletDirection == 'BACK')
            {
                mobBulletInfo[index].posZ -= mobBulletInfo[index].bulletDistance
            }
            if(bulletDirection == 'LEFT')
            {
                mobBulletInfo[index].posX += mobBulletInfo[index].bulletDistance
            }
            if(bulletDirection == 'RIGHT')
            {
                mobBulletInfo[index].posX -= mobBulletInfo[index].bulletDistance
            }

            if(_gameAppContext.playerPositionOnMap.x ==  mobBulletInfo[index].posX && _gameAppContext.playerPositionOnMap.z ==  mobBulletInfo[index].posZ)
            {
                return 'GO-PLAYER';
            }
            else
            {
                let findNextBulletPlatform = GameMap.find((elem)=> {return elem.xPose == mobBulletInfo[index].posX && elem.zPose == mobBulletInfo[index].posZ});

                if(findNextBulletPlatform)
                {   
                    if(findNextBulletPlatform.object)
                    {   
                        if(findNextBulletPlatform.isOnScene)
                        {   
                            if(findNextBulletPlatform.objectType == 'wall')
                            {  
                                if(findNextBulletPlatform.objectType == 'wall' && findNextBulletPlatform.objectDesc.haswall)
                                {
                                    return 'STOP'
                                } 
                                else
                                {
                                    return 'GO'
                                }
                                
                            }
                            else if(findNextBulletPlatform.objectType == 'door'){return 'STOP'}
                            else if(findNextBulletPlatform.objectType == 'decor'){return 'STOP'}
                            else
                            {
                                return 'GO'
                            }
                        }
                        else
                        {
                            return 'GO'
                        }
                    }
                    else
                    {
                        return 'GO'
                    }
                }
                else
                {
                    return 'STOP'
                }
            }
            
        }
    let afterBulletAnimation = (index)=>
        {
            if(mobBulletInfo[index].bulletNextMove == 'GO')
                {
                    mobBulletInfo[index].checkOnce = false;
                    mobBulletInfo[index].bulletDistance = 2;
                }
                else if(mobBulletInfo[index].bulletNextMove == 'GO-PLAYER')
                {   
                    
                    AudioManage.play('playerhit');
                    mobShootAnimationOver.current = false;
                    mobBulletRef.current[index].material.visible = false;
                    mobBulletRef.current[index].position.x = mobPositionOnMap.x
                    mobBulletRef.current[index].position.z = mobPositionOnMap.z
                    mobBulletInfo[index] = {index:index,checkOnce:false,isShooted:false,bulletNextMove:'none',bulletDirection:'none',bulletDistance:2,
                        posX:mobPositionOnMap.x,posZ:mobPositionOnMap.z,count:0,countBeforeShootOver:false};
                    _gameAppContext.reducePlayerLife(1);
                    if(mobState=='Alive')
                    {
                        if(playerIsAlreadyOnAxis.left || playerIsAlreadyOnAxis.right || playerIsAlreadyOnAxis.front || playerIsAlreadyOnAxis.back)
                        {
                            prepareBulletAnimation();
                        }
                        else
                        {
                            checkIfPlayerIsOnMobAxis('LEFT')
                            checkIfPlayerIsOnMobAxis('RIGHT')
                            checkIfPlayerIsOnMobAxis('FRONT')
                            checkIfPlayerIsOnMobAxis('BACK')
                        }
                        
                    }
                    
                    // resetBullet(i);
                }
                else if(mobBulletInfo[index].bulletNextMove == 'STOP')
                {   
                    mobShootAnimationOver.current = false;
                    mobBulletRef.current[index].material.visible = false;
                    mobBulletRef.current[index].position.x = mobPositionOnMap.x
                    mobBulletRef.current[index].position.z = mobPositionOnMap.z
                    
                    mobBulletInfo[index] = {index:index,checkOnce:false,isShooted:false,bulletNextMove:'none',bulletDirection:'none',bulletDistance:2,
                    posX:mobPositionOnMap.x,posZ:mobPositionOnMap.z,count:0,countBeforeShootOver:false};
                    if(mobState=='Alive')
                    { 
                        let playerPositionInfo = GameMap.find(getPlayerIndexPosition);
                        gotToPlayerAxe(playerPositionInfo.id);
                    }
                    // resetBullet(i);
                }
        }
    let shootMobBulletAnimation = ()=>
        {
            for(let i =0; i< mobBulletInfo.length ;i++)
            {
                if(mobBulletInfo[i].isShooted)
                {
                    if(mobBulletInfo[i].countBeforeShootOver)
                    {
                        if(mobShootAnimationOver.current)
                        {
                                if(!mobBulletInfo[i].checkOnce)
                                {
                                    //Avant que la balle ne bouge
                                    mobBulletInfo[i].checkOnce = true;
                                    mobBulletInfo[i].bulletNextMove = beforeBulletAnimation(i,mobBulletInfo[i].bulletDirection); //GO | GO-PLAYER | STOP
                                    mobBulletRef.current[i].material.visible = true;
                                }
                                else
                                {
                                    if(mobBulletInfo[i].bulletDistance > 0)
                                    {
                                        mobBulletInfo[i].bulletDistance -= Math.round(bulletSpeed * 100) / 100;
                                        if(mobBulletInfo[i].bulletDirection == 'FRONT')
                                        {
                                           
                                            mobBulletRef.current[i].position.z += Math.round(bulletSpeed * 100) / 100;
                                            mobBulletRef.current[i].position.z = Math.round(mobBulletRef.current[i].position.z * 100) / 100;
                                        }
                                        if(mobBulletInfo[i].bulletDirection == 'BACK')
                                        {
                                            
                                            mobBulletRef.current[i].position.z -= Math.round(bulletSpeed * 100) / 100;
                                            mobBulletRef.current[i].position.z = Math.round(mobBulletRef.current[i].position.z * 100) / 100;
                                        }
                                        if(mobBulletInfo[i].bulletDirection == 'LEFT')
                                        {
                                            
                                            mobBulletRef.current[i].position.x += Math.round(bulletSpeed * 100) / 100;
                                            mobBulletRef.current[i].position.x = Math.round(mobBulletRef.current[i].position.x * 100) / 100;
                                        }
                                        if(mobBulletInfo[i].bulletDirection == 'RIGHT')
                                        {
                                            
                                            mobBulletRef.current[i].position.x -= Math.round(bulletSpeed * 100) / 100;
                                            mobBulletRef.current[i].position.x = Math.round(mobBulletRef.current[i].position.x * 100) / 100;
                                        }
                                    }
                                    else
                                    {
                                        
                                        afterBulletAnimation(i)
                                    }
                                }
                        }
                            
                    
                        
                    }
                    else
                    {
                        if(mobState=='Alive')
                        {
                                if(mobBulletInfo[i].count>0)
                                {
                                    mobBulletInfo[i].count --;
                                }
                                else
                                {   
                                    if(props.mobCustomModel == 'none')
                                    {
                                        enemyController.current('PLAY-MOB-ATTACK-ANIMATION');
                                    }
                                    else
                                    {
                                        mobShootAnimationOver.current = true;
                                    }
                                    mobBulletInfo[i].countBeforeShootOver = true;
                                    // enemyController.current('PLAY-MOB-ATTACK-ANIMATION');
                                    // mobBulletInfo[i].countBeforeShootOver = true;
                                    
                                }
                        }
                        
                    }
                    

                    
                }
            }
            
        }
    let checkIfPlayerIsOnMobAxis = (checkDirection)=>
        {
            let findResult;
            let checkMapPlatform = ()=>
            {   
                distanceInscrementation += 2

                let getPlatformInfo = ()=>
                    {
                        if(checkDirection == 'FRONT')
                        {
                            findResult = GameMap.find((elem)=>{return elem.xPose == mobPositionOnMap.x && elem.zPose == mobPositionOnMap.z + distanceInscrementation })
                        }
                        if(checkDirection == 'BACK')
                        {
                            findResult = GameMap.find((elem)=>{return elem.xPose == mobPositionOnMap.x && elem.zPose == mobPositionOnMap.z - distanceInscrementation })
                        }
                        else if(checkDirection == 'LEFT')
                        {
                            findResult = GameMap.find((elem)=>{return elem.xPose == mobPositionOnMap.x + distanceInscrementation && elem.zPose == mobPositionOnMap.z })
                        }
                        else if(checkDirection == 'RIGHT')
                        {
                            findResult = GameMap.find((elem)=>{return elem.xPose == mobPositionOnMap.x - distanceInscrementation && elem.zPose == mobPositionOnMap.z })
                        }
                    }
                
                getPlatformInfo()
                 
                
                if(findResult)
                {
                    
                    if(_gameAppContext.playerPositionOnMap.x == findResult.xPose && _gameAppContext.playerPositionOnMap.z == findResult.zPose)
                    {
                        // EST SUR L'AXIS
                        locatePlayer = true;
                        if(checkDirection == 'FRONT'){playerDirectionToMob = "FRONT";  enemyController.current('MOB-ROTATE-FRONT')}
                        else if(checkDirection == 'BACK'){playerDirectionToMob = "BACK"; enemyController.current('MOB-ROTATE-BACK')}
                        else if(checkDirection == 'LEFT'){playerDirectionToMob = "LEFT"; enemyController.current('MOB-ROTATE-LEFT')}
                        else if(checkDirection == 'RIGHT'){playerDirectionToMob = "RIGHT"; enemyController.current('MOB-ROTATE-RIGHT')}
                        
                        if(playerDirectionToMob == "FRONT")
                        {
                            if(!playerIsAlreadyOnAxis.front)
                            {
                                playerIsAlreadyOnAxis.front = true;
                                // prepareBulletAnimation();
                            }
                        }
                        else if(playerDirectionToMob == "BACK")
                        {
                            if(!playerIsAlreadyOnAxis.back)
                            {
                                playerIsAlreadyOnAxis.back = true;
                                // prepareBulletAnimation();
                            }
                        }
                        else if(playerDirectionToMob == "LEFT")
                        {
                            if(!playerIsAlreadyOnAxis.left)
                            {
                                playerIsAlreadyOnAxis.left = true;
                                // prepareBulletAnimation();
                            }
                        }
                        else if(playerDirectionToMob == "RIGHT")
                        {
                            if(!playerIsAlreadyOnAxis.right)
                            {
                                playerIsAlreadyOnAxis.right = true;
                                // prepareBulletAnimation();
                            }
                        }
                        
                        // prepareBulletAnimation();
                        // return true;
                    }
                    else
                    {

                        
                        checkMapPlatform();
                    }
                    
                }
                else
                {
                    
                    if(checkDirection == "FRONT")
                    {
                        
                            playerIsAlreadyOnAxis.front = false;
                            
                    }
                    else if(checkDirection == "BACK")
                    {
                        
                            playerIsAlreadyOnAxis.back = false;
                            
                    }
                    else if(checkDirection == "LEFT")
                    {
                        
                            playerIsAlreadyOnAxis.left = false;
                            
                    }
                    else if(checkDirection == "RIGHT")
                    {
                        
                            playerIsAlreadyOnAxis.right = false;
                            
                    }
                        
                    
                    distanceInscrementation -= 2;
                    getPlatformInfo();
                    
                    distanceInscrementation = 0;
                    
                  
                    // return false
                    
                }
                
            }
            return checkMapPlatform()
            
            

        }
    let getIndexPosition = (elem)=>
        {
            return elem.xPose == mobPositionOnMap.x && elem.zPose == mobPositionOnMap.z
        }
    let getPlayerIndexPosition = (elem)=>
        {
            return elem.xPose == _gameAppContext.playerPositionOnMap.x && elem.zPose == _gameAppContext.playerPositionOnMap.z
        }


    let checkIfPlayerIsOnMobArea = ()=>
        {
            
            let playerIsInMobArea = false;
            let mobPositionInfo = GameMap.find(getIndexPosition);
            let mobPositionIndex = structuredClone(mobPositionInfo.id);
            let playerPositionInfo = GameMap.find(getPlayerIndexPosition);
            let mobIndexArea = []
            
            //GET MOB AREA
            for(let i = mobPositionIndex; i<mobPositionIndex+(_appContext.mapWidth.current*5);i+=_appContext.mapWidth.current)
            {
                    if(GameMap[i])
                    {
                        for(let i1 = i; i1<i+5;i1++)
                            {
                                if(i1!=mobPositionIndex)
                                {
                                    
                                    if(!GameMap[i1].objectLimit)
                                    {
                                        
                                        mobIndexArea.push(GameMap[i1].id)
                                    }
                                    else
                                    {
                                        break;
                                    }
                                    
                                }
        
                            }
                            for(let i1 = i; i1>i-5;i1--)
                            {
                                if(i1!=mobPositionIndex)
                                {
                                    
                                    if(!GameMap[i1].objectLimit)
                                    {
                                        mobIndexArea.push(GameMap[i1].id)
                                    }
                                    else
                                    {
                                        break;
                                    }
                                    
                                }
        
                            }
                    }
                    else
                    {
                        break;
                    }
                    
            }
            for(let i = mobPositionIndex; i>mobPositionIndex-(_appContext.mapWidth.current*5);i-=_appContext.mapWidth.current)
            {
                if(GameMap[i])
                {
                    for(let i1 = i; i1<i+5;i1++)
                        {
                            if(i1!=mobPositionIndex)
                            {
                                
                                if(!GameMap[i1].objectLimit)
                                {
                                    mobIndexArea.push(GameMap[i1].id)
                                }
                                else
                                {
                                    break;
                                }
                                
                            }
    
                        }
                        for(let i1 = i; i1>i-5;i1--)
                        {
                            if(i1!=mobPositionIndex)
                            {
                                
                                if(!GameMap[i1].objectLimit)
                                {
                                    mobIndexArea.push(GameMap[i1].id)
                                }
                                else
                                {
                                    break;
                                }
                                
                            }
    
                        }
                }
                else
                {
                    break;
                }
                
            }
         

            for(let i = 0;i<mobIndexArea.length;i++)
            {
                if(playerPositionInfo.id == mobIndexArea[i] )
                {
                    playerIsInMobArea = true;
                    break;
                }
            }

            if(playerIsInMobArea)
            {  
                
                locatePlayer = true;
                gotToPlayerAxe(playerPositionInfo.id);
            }
        }
    
    let switchMobPosition = (nextPosIndex)=>
        {
            
            let currentMobPositionInfo = GameMap.find(getIndexPosition);
            if(mobState=='Alive')
            {
                    if(nextPosIndex != currentMobPositionInfo.id)
                    {      
                        GameMap[nextPosIndex].hasEnemy = true
                        GameMap[nextPosIndex].isOnScene = true
                        GameMap[nextPosIndex].object = true
                        GameMap[nextPosIndex].objectId = structuredClone(GameMap[currentMobPositionInfo.id].objectId);
                        GameMap[nextPosIndex].objectType = structuredClone(GameMap[currentMobPositionInfo.id].objectType);
                        GameMap[nextPosIndex].objectDesc = structuredClone(GameMap[currentMobPositionInfo.id].objectDesc);
                        mobPositionOnMap.x = GameMap[nextPosIndex].xPose
                        mobPositionOnMap.z = GameMap[nextPosIndex].zPose
                        for(let i =0;i<mobBulletRef.current.length;i++)
                        {
                            mobBulletInfo[i].posX =  mobPositionOnMap.x
                            mobBulletInfo[i].posZ =  mobPositionOnMap.z
                            mobBulletRef.current[i].position.x = mobPositionOnMap.x
                            mobBulletRef.current[i].position.z = mobPositionOnMap.z
                        }
                        if(props.hasObject)
                        {
                            itemController.value[0]('MOVE-ITEM',{x:mobPositionOnMap.x,z:mobPositionOnMap.z})
                        }
                        
                        //
                        GameMap[currentMobPositionInfo.id].hasEnemy = false
                        GameMap[currentMobPositionInfo.id].isOnScene = false;
                        GameMap[currentMobPositionInfo.id].object = false;
                        GameMap[currentMobPositionInfo.id].objectType = "none";
                        GameMap[currentMobPositionInfo.id].objectId = "none";
                        GameMap[currentMobPositionInfo.id].objectDesc = null;
            
            
            
                        enemyController.current('MOVE-MOB',{x:GameMap[nextPosIndex].xPose,z:GameMap[nextPosIndex].zPose})
                        
                        _appContext.devMode.current &&  lifeBarController.current("MOVE",{x:GameMap[nextPosIndex].xPose,z:GameMap[nextPosIndex].zPose});
         
                        checkIfPlayerIsOnMobAxis('LEFT')
                        checkIfPlayerIsOnMobAxis('RIGHT')
                        checkIfPlayerIsOnMobAxis('FRONT')
                        checkIfPlayerIsOnMobAxis('BACK')
                        
                        if(!playerIsAlreadyOnAxis.left && !playerIsAlreadyOnAxis.right && !playerIsAlreadyOnAxis.front && !playerIsAlreadyOnAxis.back && locatePlayer)
                        {   //ON RECHERCHE LE MOB
                           
                            gotToPlayerAxe(GameMap.find(getPlayerIndexPosition).id);
                        }
                        else
                        {
                            prepareBulletAnimation();
                        }
                        
                    }
            }
            
            
            
         
        }
    let gotToPlayerAxe = (playerIndex)=>
        {

            let checkZIDStep = _appContext.mapWidth.current;
            let checkZIDStepIncr = 1;
            let playerFreeAxeArea = [];
            let playerAreaForMob = [];
            let randomMobArea = null;
            let getPlayerFrontAxeArea = ()=>
                {
                    while (!GameMap[playerIndex+(checkZIDStep*checkZIDStepIncr)].objectLimit) 
                    {
                        playerFreeAxeArea.push(GameMap[playerIndex+(checkZIDStep*checkZIDStepIncr)].id)
                        checkZIDStepIncr ++;
                    }
                    checkZIDStepIncr = 1;
                }
            let getPlayerBackAxeArea = ()=>
                {
                    while (!GameMap[playerIndex-(checkZIDStep*checkZIDStepIncr)].objectLimit) 
                    {
                        playerFreeAxeArea.push(GameMap[playerIndex-(checkZIDStep*checkZIDStepIncr)].id)
                        checkZIDStepIncr ++;
                    }
                    checkZIDStepIncr = 1;
                }
            let getPlayerLeftAxeArea = ()=>
                {
                    while (!GameMap[playerIndex+checkZIDStepIncr].objectLimit) 
                    {
                        playerFreeAxeArea.push(GameMap[playerIndex+checkZIDStepIncr].id)
                        checkZIDStepIncr ++;
                    }
                    checkZIDStepIncr = 1;

                }
            let getPlayerRightAxeArea = ()=>
                {
                    while (!GameMap[playerIndex-checkZIDStepIncr].objectLimit) 
                    {
                        playerFreeAxeArea.push(GameMap[playerIndex-checkZIDStepIncr].id)
                        checkZIDStepIncr ++;
                    }
                    checkZIDStepIncr = 1;
                    
                }
            let checkPlayerAxeAreaForMob = ()=>
            {
                for(let i =0;i<playerFreeAxeArea.length;i++)
                {
                    
                        if(GameMap[playerFreeAxeArea[i]].isOnScene || GameMap[playerFreeAxeArea[i]].hasEnemy){}
                        else
                        {
                            playerAreaForMob.push(GameMap[playerFreeAxeArea[i]].id)
                        }
                    
                }

            }
            getPlayerFrontAxeArea()
            getPlayerBackAxeArea()
            getPlayerLeftAxeArea();
            getPlayerRightAxeArea();
            checkPlayerAxeAreaForMob();

            randomMobArea = playerAreaForMob[Math.floor(Math.random() * playerAreaForMob.length)]
            let customCounter = new CustomCounter(50,0,()=>{!_appContext.gamePause.current && switchMobPosition(randomMobArea) ;return true;},null);
            customCounter.start();
        }

    useFrame((clock)=>
        {
            if(!_appContext.gamePause.current)
            {

           
                    if(mobEffectCounterStart)
                    {
                        startMobEffectCounter();
                    }
                    if(props.hasObject)
                    {
                            // keyRef.current.rotation.y += 0.05;
                    }
                    
                    if(props._attack)
                    {
                        shootMobBulletAnimation()
                    }
            } 
            
        })
    useEffect(()=>
        {
            
            // checkIfPlayerIsOnMobArea();
            GameMap[GameMap.find(getIndexPosition).id].objectDesc.itemCustomModel = 'none'
            GameMap[GameMap.find(getIndexPosition).id].objectDesc.mobCustomModel = 'none'
            GameMap[GameMap.find(getIndexPosition).id].objectDesc.bulletCustomModel = 'none'
            _appContext.mobCallBackAfterPlayerMove.current = ()=>
                {
                    if(!locatePlayer)
                    {
                            if(mobState=='Alive')
                            {   
                                checkIfPlayerIsOnMobArea();
                            }
                    }

                    
                }
          _gameAppContext.mobObjectIdArr.value.push(props.mobObjectId);
          _gameAppContext.mobUpdateFunc.current[props.mobObjectId]   = updateMobInfo;
        },[])
    
    return(
            <>
                    <mobContext.Provider
                        value={{lifeBarFunc,lifeBarController,enemyController,mobShootAnimationOver}}
                    >
                    
                    
                        
                    
                    {props._attack == false && <Mob_1_model
                                                    _context={mobContext}
                                                    name="ENEMY"
                                                    x={mobPositionOnMap.x} z={mobPositionOnMap.z}
                                                >
                                                </Mob_1_model>
                    }
                    {props._attack && <Mob_1_model
                                        _context={mobContext}
                                        name="ENEMY-ACTIVE"
                                        x={mobPositionOnMap.x} z={mobPositionOnMap.z}
                                        customModel={props.mobCustomModel}
                                        >
                                    </Mob_1_model>
                    }
                    {props.hasObject? 
                            <>
                                {props.itemCustomModel == 'none' ?
                                    <>
                                    {props.objectSkin == 'coin_item_1'? <ItemType1Model controller={{itemController,index:0}} skin={props.objectSkin} _visible={false} x={mobPositionOnMap.x} z={mobPositionOnMap.z} />
                                    :
                                    <ItemType2Model objectName={props.hasObject}l customModel = {props.itemCustomModel} controller={{itemController,index:0}} skin={props.objectSkin} _visible={false} x={mobPositionOnMap.x} z={mobPositionOnMap.z} />
                                    }
                                    </>
                                    :
                                    <ItemType2Model objectName={props.hasObject} customModel = {props.itemCustomModel} controller={{itemController,index:0}} skin={props.objectSkin} _visible={false} x={mobPositionOnMap.x} z={mobPositionOnMap.z} />
                                }
                            </>
                            
                            
                            :null
                    }
                    {_appContext.devMode.current && <MobLifeBar _context={mobContext} x={mobPositionOnMap.x} z={mobPositionOnMap.z} maxMobLife={props.maxMobLife} mobLife={props.mobLife} />}
                    <group
                        ref={bulletGroupRef}
                    >
                        {mobBulletModel}
                    </group>
                    </mobContext.Provider>
            </>
    )
}
