import * as THREE from 'three'
import { useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { createContext, useContext, useEffect, useRef } from "react";
import {  PlayerCursor, BulletModel, PlayerDirection } from "./Game3DAssets";
import { appContext } from "../App";
import { PlatformIndex } from "./DevHelp";
import { movePlayer,preparePlayerMove,rotateCam } from './playerController';
import { moveBullet, prepareNextBullet } from './bulletController';
import { placeModelOnScene } from './placeModelOnScene';
import { AudioManage } from './audioComponents';
import {  storyText } from './gameStory';
import { CustomCounter } from './utils';

export let gameAppContext = createContext(null);
export function GameApp(props)
{

    let _appContext = useContext(appContext);
    // let level = useRef(_appContext.gameState.current.level);
    const GameMap =  _appContext.gameMap.current;
    let gameMapInfo = _appContext.levelInfo.current; //WIN CONDITION
    let moveDirection={value:'none'};
    let getPlayerPosition = {value:0};
    let getCameraPOsition = {value:0};
    let getorbitPosition = {value:0};
    let playerSpeed = _appContext.playerStats.current.moveSpeed;
    let bulletSpeed = 0.1*5; // 1 2 5
    let playerDistance = {value:0};
    let playerDistanceTarget = {value:2};
    let enemyLifePoint = {value:1};
    let playerPoseVar = {x:structuredClone(GameMap[_appContext.gameState.current.playerPosition].xPose),y:0.8,z:structuredClone(GameMap[_appContext.gameState.current.playerPosition].zPose)};
    let playerPositionOnMap = {x:playerPoseVar.x,y:0,z:playerPoseVar.z}
    let bulletPositionOnMap = [];
    let camRotateStart = useRef(false);
    let camRotateInfo = {left:{x:3,xCamValue:0,z:1,zCamValue:0,counter:0}};
    let bulletContainer = [];
    let playerDirection = {value:'BACK'};
    let objectContainer = useRef([]);
    let bulletRef = useRef([]);
    let bulletRefInfo = useRef([]);
    let objectRef = useRef([]);
    let mobObjectIdArr = {value:[]};
    let mobUpdateFunc = useRef([]);
    let keyPressedName = useRef(null);
    let aKeyisPressed = useRef(false); // si ça vaut true on ne peut plus appuyer une autre clé tant qu'on a pas laissé l'autre
    let playerMoveIsActive = useRef(false);
    let playerCursorRef = useRef(null)
    let camRef = useRef(null);
    let orbitRef = useRef(null);
    let objetDirection = useRef([false,false,false,false]);
    let bulletGroupRef = useRef(null);
    let itemController = {value:[]};
    let wallController = {value:[]};
    let mapGroundController = useRef([]);
    let exitDoorController = {value:[]};
    let bulletModelController = {value:[]};
    let exitDoorModelIndexArr = {value:[]};
    let exitDoorMapIndexArr = {value:[]};
    let mobIndexArr = {value:[]};
    let barierMapIndexArr = {value:[]};
    let barierModelIndexArr = {value:[]};
    let objectCanMove = useRef({active:false,index:null,objInfo:null,effectAfterMove:'none',portalModelID:null});
    let movableObjectIndexArr = {value:[]};
    let playerCanShoot = true;
    // let playerCanShoot = _appContext.gameState.current.level == 1? false : true;
    let currentObjectInFront={effect:'none',objectInfo:null};
    let passedTime = 0;
    let walkEffectTimer = {value:0};
    let totalBullet = {value:20};
    let weaponReload = {time:0,timeLimite:_appContext.playerStats.current.shootInterval,start:false};
    let nextBulletToShoot={value:null};
    let exitDoorVisible={value:false};
    let showWeapon3DModel = {value:_appContext.playerStats.current.showWeapon}
    let directionToGo = {value:'FRONT'};
    let gloBalObject;
    let platformModelContainer = useRef([]);
    let wallModelContainer = useRef([]);





    let checkWinCondition = ()=>
        {
            let totalwincondition = 0;
           
            if(gameMapInfo._KeyNumber != 0){totalwincondition++}
            if(gameMapInfo._MobToKillNumber != 0){totalwincondition++}
            if(gameMapInfo._battery != 0){totalwincondition++}
            
            // IF _KeyNumber > 0 PLAYER MUST COLLECT ALL THE KEY IN THE AREA BEFORE GOING TO THE NEXT LEVEL
            
            // console.log(totalwincondition)
            if(totalwincondition>0)
            {       
                    if(gameMapInfo._KeyNumber != 0)
                    {   
                        
                        if(_appContext.playerStats.current.keyCollected == gameMapInfo._KeyNumber )
                        {   
                            totalwincondition --
                            gameMapInfo._KeyNumber=0
                            // console.log(_appContext.playerStats.current.keyCollected)
                        }
        
                    }
                    if(gameMapInfo._MobToKillNumber != 0)
                    {   
                        
                        if(_appContext.playerStats.current.importantMobKilled == gameMapInfo._MobToKillNumber )
                        {   
                            totalwincondition --
                            gameMapInfo._MobToKillNumber = 0
                        }
        
                    }
                    if(gameMapInfo._battery != 0)
                    {   
                        
                        if(_appContext.playerStats.current.batteryPlaced == gameMapInfo._battery )
                        { 
                            totalwincondition --
                            gameMapInfo._battery = 0;
                            
                        }
        
                    }

                    if(totalwincondition == 0)
                    {
                        openExitDoor();
                    }
            }
            removeBarier();
            // if(gameMapInfo.barrierBattery !=0 && _appContext.playerStats.current.batteryPlaced == gameMapInfo.barrierBattery )
            // {       
            //     removeBarier();
                
            // }
            // else
            // {
            //     // PLAYER MUST KILL ALL THE MOB IN THE AREA BEFORE GOING TO THE NEXT LEVEL
            //     if(_appContext.playerStats.current.importantMobKilled == gameMapInfo._MobToKillNumber )
            //         {
                      
            //             openExitDoor();

            //         }
            // }
        }
    let checkBarierCondition = ()=>
        {
            if(barierMapIndexArr.value.length>0)
            {
                for(let i =0; i< barierMapIndexArr.value.length;i++)
                {
                    let conditions = 0;
                    if(GameMap[barierMapIndexArr.value[i]].objectDesc.keyToCollect == 0 || GameMap[barierMapIndexArr.value[i]].objectDesc.mobToKill == 0)
                    {conditions = 1}
                    else{conditions = 2}
                    
                    if(conditions == 1)
                    {
                        if(GameMap[barierMapIndexArr.value[i]].objectDesc.keyToCollect != 0)
                        {
                            if(GameMap[barierMapIndexArr.value[i]].objectDesc.keyToCollect == _appContext.playerStats.current.keyCollectedr){GameMap[barierMapIndexArr.value[i]].isOnScene = false;barierModelIndexArr.value[i].modelController("hide");}
                        }
                        else if(GameMap[barierMapIndexArr.value[i]].objectDesc.mobToKill != 0)
                        {   
                            if(GameMap[barierMapIndexArr.value[i]].objectDesc.mobToKill == _appContext.playerStats.current.importantMobKilled){GameMap[barierMapIndexArr.value[i]].isOnScene = false;barierModelIndexArr.value[i].modelController("hide");}
                        }
                    }
                    else if(conditions == 2)
                    {
                        if(GameMap[barierMapIndexArr.value[i]].objectDesc.keyToCollect ==  _appContext.playerStats.current.keyCollected &&
                            GameMap[barierMapIndexArr.value[i]].objectDesc.mobToKill ==  _appContext.playerStats.current.importantMobKilled
                            )
                        {
                            GameMap[barierMapIndexArr.value[i]].isOnScene = false;
                            barierModelIndexArr.value[i].modelController("hide")
                        }
                    }
                    
                    
                }
            }
            
        }
    let removeBarier = ()=>
        {
            for(let i =0; i< barierMapIndexArr.value.length;i++)
                {
                    if(GameMap[barierMapIndexArr.value[i]].isOnScene && GameMap[barierMapIndexArr.value[i]].objectDesc.batteryNeeded == _appContext.playerStats.current.batteryPlaced)
                    {
                        GameMap[barierMapIndexArr.value[i]].isOnScene = false;
                        GameMap[barierMapIndexArr.value[i]].object = false;
                        barierModelIndexArr.value[i].modelController("hide")
                    }

                    
                    
                }
        }
    let openExitDoor = ()=>
        {
            for(let i = 0; i< exitDoorController.value.length;i++)
            {
                if(exitDoorController.value[i])
                {
                    exitDoorController.value[i]('OPEN-DOOR')
                }

            }
            for(let i = 0; i< exitDoorMapIndexArr.value.length;i++)
            {

                GameMap[exitDoorMapIndexArr.value[i]].objectDesc.open = true;
            }

        }
    let gameEnding = ()=>
        {
            ;
            storyText.value = ['none'] 
            
            _appContext.gamePause.current = true;
            if(_appContext.transitionBetweenScreen.current)
            {
                _appContext.GameUIController.current({arg1:'SWITCH-TO',arg2:'ENDING-SCREEN'});
            }
            else
            {
                
                _appContext.setGameVueActive(false);
                _appContext.GameUIController.current({arg1:'DIRECT',arg2:'ENDING-SCREEN'});
            }
            
           
        }
    let managePlayerBattery = ()=>
        {
            _appContext.playerStats.current.batteryPlaced ++;
            
            checkWinCondition();
        }
    let managePlayerKey = ()=>
        {
            _appContext.playerStats.current.keyCollected ++;
            
            // checkBarierCondition();
            checkWinCondition();
        }
    let reducePlayerLife = (_number)=>
        {
            _appContext.ScreenHaloCOntroller.current('GLOW-RED');
            _appContext.playerStats.current.life -= _number;
            _appContext.lifeBarFunc.current(_appContext.playerStats.current.life);
            if(_appContext.playerStats.current.life == 0)
            {
                _appContext.setGameOver()
            }

        }
    let increasePlayerLife = (_number)=>
        {
            _appContext.playerStats.current.life += _number;
            if(_appContext.playerStats.current.life > _appContext.playerStats.current.maxLife)
            {
                _appContext.playerStats.current.life = _appContext.playerStats.current.maxLife
            }
            _appContext.lifeBarFunc.current(_appContext.playerStats.current.life);

        }
    let managePlayerMoney = (_number,operation)=>
        {
            if(operation == 'add')
            {
                _appContext.playerStats.current.coinCollected += _number;
            }
            else
            {
                _appContext.playerStats.current.coinCollected -= _number;
            }

            _appContext.playerMoneyContainerRef.current.innerText = _appContext.playerStats.current.coinCollected;
           
        }
    let getCurrentBulletPlatform = (bulletIndex)=>
        {
            let result = GameMap.find((elem)=>{return elem.xPose == bulletPositionOnMap[bulletIndex].x && elem.zPose == bulletPositionOnMap[bulletIndex].z })

            return result;
        }

    let upgradePlayerState = (args)=>
        {
            if(args == 'upgrade_shoot_speed_item')
            {   
                if(_appContext.playerStats.current.shootInterval == 20)
                {
                    _appContext.gameNotifFunc.current('Shoot speed is max !','player')
                }
                else
                {
                    _appContext.playerStats.current.shootInterval -= 10;
               
                    weaponReload.timeLimite = _appContext.playerStats.current.shootInterval;
                    _appContext.gameNotifFunc.current('Faster shoot !','player')
                }

            }
            else if(args == 'upgrade_shoot_power_item')
            {
                if( _appContext.playerStats.current.shootPower == 3)
                {
                    _appContext.gameNotifFunc.current('Damage is maxed','player')
                }
                else
                {
                    _appContext.playerStats.current.shootPower ++;
                    _appContext.gameNotifFunc.current('You make more damage !','player')
                }
               
            }
            else if(args == 'upgrade_life_item')
            {
                _appContext.playerStats.current.maxLife ++;
                _appContext.playerStats.current.life = structuredClone(_appContext.playerStats.current.maxLife);
                _appContext.lifeBarFunc.current(_appContext.playerStats.current.life);
                _appContext.gameNotifFunc.current('Max life + 1','player')
            }
        }
    let resetBullet = (_index)=>
        {

            bulletRefInfo.current[_index] = {_index:_index,isShooted:false,prepareMove:false,move:"none",direction:'none',hasCheckNextPlatform:false,moveDistance:0};
            bulletRef.current[_index].position.x = playerPositionOnMap.x
            bulletRef.current[_index].position.z = playerPositionOnMap.z
            
            bulletModelController.value[_index]('HIDE-BULLET')
            prepareNextBullet(gloBalObject);
        }
    let checkCurrentPlayerPlatform = (elem)=>
        {
            return elem.xPose == playerPositionOnMap.x && elem.zPose == playerPositionOnMap.z
        }
    let takeObjectOnPlayerPosition = ()=>
        {
            let result = GameMap.find(checkCurrentPlayerPlatform);
            
            if(result.object)
            {
                if(result.objectDesc.objectName == 'coin_item')
                {
                    takeCoinOnPlayerPoition(result);
                }
            }
        }
    let getNextPlatformInfo = (_playerDirection,_when)=>
        {


                if(_playerDirection.value == 'LEFT'){playerPositionOnMap.x += (playerDistanceTarget.value);}
                if(_playerDirection.value == 'RIGHT'){playerPositionOnMap.x -= (playerDistanceTarget.value);}
                if(_playerDirection.value == 'FRONT'){playerPositionOnMap.z += (playerDistanceTarget.value);}
                if(_playerDirection.value == 'BACK'){playerPositionOnMap.z -= (playerDistanceTarget.value);}


                let result = GameMap.find(checkCurrentPlayerPlatform);

                if(_playerDirection.value == 'LEFT'){playerPositionOnMap.x -= (playerDistanceTarget.value);}
                if(_playerDirection.value == 'RIGHT'){playerPositionOnMap.x += (playerDistanceTarget.value);}
                if(_playerDirection.value == 'FRONT'){playerPositionOnMap.z -= (playerDistanceTarget.value);}
                if(_playerDirection.value == 'BACK'){playerPositionOnMap.z += (playerDistanceTarget.value);}


                // if(_when == 'AfterMove')
                // {
                    if(result)
                    {   
                        if(result.objectType=='item')
                        {
                            if(result.objectDesc.objectName=='weapon_item'){setActionButtonEffect('TAKE-SPEAR',result)}
                            else if(result.objectDesc.objectName=='heal_item'){setActionButtonEffect('TAKE-HEAL',result)}
                            else if(result.objectDesc.objectName=='coin_item'){setActionButtonEffect('TAKE-CAURIS',result)}
                            else if(result.objectDesc.objectName=='key_item'){setActionButtonEffect('TAKE-KEY',result)}
                            else if(result.objectDesc.objectName=='box_item' && result.objectDesc.objectLife==0)
                            {
                                if(result.objectDesc.hasChildObject=='heal_item'){setActionButtonEffect('TAKE-HEAL',result)}
                                else if(result.objectDesc.hasChildObject=='coin_item'){setActionButtonEffect('TAKE-CAURIS',result)}
                                else if(result.objectDesc.hasChildObject=='key_item'){setActionButtonEffect('TAKE-KEY',result)}   
                                else if(result.objectDesc.hasChildObject=='upgrade_life_item' || result.objectDesc.hasChildObject=='upgrade_shoot_power_item' || result.objectDesc.hasChildObject=='upgrade_shoot_speed_item')
                                {  
                                    setActionButtonEffect('TAKE-UPGRADE',result)
                                }
                            }
                            else if(result.objectDesc.objectName=='upgrade_life_item' || result.objectDesc.objectName=='upgrade_shoot_power_item' || result.objectDesc.objectName=='upgrade_shoot_speed_item')
                            {  
                                setActionButtonEffect('TAKE-UPGRADE',result)
                            }
                            

                        }
                        else if(result.objectType=='Exitdoor')
                        {
                            setActionButtonEffect('Exit',result)
                        }
                        else if(result.object && result.objectType=='dynamic_object')
                        {
                            if(result.objectDesc.objectName=='bomb_item' && result.objectDesc.activable)
                            {   
                                setActionButtonEffect('bomb',result)
                            }
                        }
                        else
                        {
                            //BULLET
                            setActionButtonEffect('none',result)
                        }
                    }

                // }

            

        }
    let setActionButtonEffect = (effect,objectInfo)=>
        {
            if(effect == 'TAKE-SPEAR')
            {
                if(objectInfo.isOnScene)
                {
                    
                    _appContext.toggleActionIcon('INTERACT');
                    currentObjectInFront.effect = 'SPEAR';
                }
                else
                {
                    
                    _appContext.toggleActionIcon('SHOOT');
                    currentObjectInFront.effect ='none';
                }


            }
            else if(effect == 'TAKE-CAURIS')
            {
                if(objectInfo.isOnScene)
                {
                    
                    _appContext.toggleActionIcon('INTERACT');
                    currentObjectInFront.effect = 'CAURIS';
                }
                else
                {
                    
                    _appContext.toggleActionIcon('SHOOT');
                    currentObjectInFront.effect ='none';
                }


            }
            else if(effect == 'TAKE-UPGRADE')
            {
                if(objectInfo.isOnScene)
                {
                    
                    _appContext.toggleActionIcon('INTERACT');
                    currentObjectInFront.effect = 'UPGRADE';
                }
                else
                {
                    
                    _appContext.toggleActionIcon('SHOOT');
                    currentObjectInFront.effect ='none';
                }


            }
            else if(effect == 'TAKE-HEAL')
            {
                if(objectInfo.isOnScene)
                {
                    
                    _appContext.toggleActionIcon('INTERACT');
                    currentObjectInFront.effect = 'HEAL';
                }
                else
                {
                    
                    _appContext.toggleActionIcon('SHOOT');
                    currentObjectInFront.effect ='none';
                }


            }
            else if(effect == 'TAKE-KEY')
            {
                if(objectInfo.isOnScene)
                {
                    
                    _appContext.toggleActionIcon('INTERACT');
                    currentObjectInFront.effect = 'KEY';
                }
                else
                {
                    
                    _appContext.toggleActionIcon('SHOOT');
                    currentObjectInFront.effect ='none';
                }


            }
            else if(effect =='bomb')
            {
                
                _appContext.toggleActionIcon('INTERACT');
                currentObjectInFront.effect ='bomb';
            }
            else if(effect =='Exit')
            {
                
                _appContext.toggleActionIcon('INTERACT');
                currentObjectInFront.effect ='Exit';
            }
            else if(effect =='none')
            {
                
                _appContext.toggleActionIcon('SHOOT');
                currentObjectInFront.effect ='none';
            }
            currentObjectInFront.objectInfo = objectInfo;
        }



    let spearScale = (value)=>
        {
            for(let i =0;i<bulletRef.current.length;i++)
            {
                if(!bulletRefInfo.current[i].isShooted)
                {
                    bulletRef.current[i].scale.set(value,value,value)
                }

            }
        }
    let rotatePlayer = (rotateFrom,rotateTo)=>
        {
            let turnPlayerDirection ='+';
            let turnValue = 5;
            let bulletRotationValue;
            let turnPlayer = ()=>
                {
                   if(turnValue <= 0)
                   {
                      getNextPlatformInfo(playerDirection,'AfterMove');
                      
                        for(let i =0;i<bulletRef.current.length;i++)
                        {
                            if(!bulletRefInfo.current[i].isShooted)
                            {
                                bulletRef.current[i].rotation.y = bulletRotationValue
                            }
                            
                        }
                      return true;
                   }
                   else
                   {
                      turnValue --;
                      
                    if(turnPlayerDirection == '+')
                    {
                        playerCursorRef.current.rotation.y += Math.PI*0.1;
                    }
                    else
                    {
                        playerCursorRef.current.rotation.y -= Math.PI*0.1;
                    }
                      
                      return false;
                   }
            
                }
            let customCounter = new CustomCounter(2,0,turnPlayer,null)

            if(rotateTo == 'LEFT')
            {
                    if(rotateFrom == 'FRONT')
                    {
                        turnPlayerDirection ='+';
                        turnValue = 5
                        customCounter.start()
                    }
                    if(rotateFrom == 'BACK')
                    {
                        turnPlayerDirection ='-';
                        turnValue = 5
                        customCounter.start()
                    }
                    if(rotateFrom == 'RIGHT')
                    {
                        turnPlayerDirection ='+';
                        turnValue = 10
                        customCounter.start()
                    }
                    bulletRotationValue = Math.PI*0.5

                
            }
            else if(rotateTo == 'FRONT')
            {
                    if(rotateFrom == 'LEFT')
                    {
                        turnPlayerDirection ='-';
                        turnValue = 5
                        customCounter.start()
                    }
                    if(rotateFrom == 'BACK')
                    {
                        turnPlayerDirection ='-';
                        turnValue = 10
                        customCounter.start()
                    }
                    if(rotateFrom == 'RIGHT')
                    {
                        turnPlayerDirection ='+';
                        turnValue = 5
                        customCounter.start()
                    }
                    bulletRotationValue = 0

                
            }
            else if(rotateTo == 'RIGHT')
            {
                    if(rotateFrom == 'LEFT')
                    {
                        turnPlayerDirection ='-';
                        turnValue = 10
                        customCounter.start()
                    }
                    if(rotateFrom == 'BACK')
                    {
                        turnPlayerDirection ='+';
                        turnValue = 5
                        customCounter.start()
                    }
                    if(rotateFrom == 'FRONT')
                    {
                        turnPlayerDirection ='-';
                        turnValue = 5
                        customCounter.start()
                    }
                    bulletRotationValue = Math.PI*1.5

                
            }
            else if(rotateTo == 'BACK')
            {
                    if(rotateFrom == 'LEFT')
                    {
                        turnPlayerDirection ='+';
                        turnValue = 5
                        customCounter.start()
                    }
                    if(rotateFrom == 'RIGHT')
                    {
                        turnPlayerDirection ='-';
                        turnValue = 5
                        customCounter.start()
                    }
                    if(rotateFrom == 'FRONT')
                    {
                        turnPlayerDirection ='+';
                        turnValue = 10
                        customCounter.start()
                    }
                    bulletRotationValue = Math.PI

                
            }
        }
    let takeCoinOnPlayerPoition = (obj)=>
        {
            AudioManage.play('coin')

            if(obj.objectDesc.isImportant){managePlayerKey()}
            obj.object = false;
            obj.isOnScene = false;

            if(obj.objectDesc.fromMob)
            {
                managePlayerMoney(obj.objectDesc.objectValue,'add')
                mobUpdateFunc.current[obj.objectId]('Remove-Object',"none");
            }
            else
            {
                if(obj.objectDesc.hasChildObject)
                {
                    managePlayerMoney(obj.objectDesc.childObjectValue,'add')
                }
                else
                {
                    managePlayerMoney(obj.objectDesc.value,'add')
                }
                
                itemController.value[obj.objectId]('REMOVE-ITEM')
            }

            getNextPlatformInfo(playerDirection,'AfterMove');
        }
    let takeCoin = ()=>
        {
            AudioManage.play('coin')

            if(currentObjectInFront.objectInfo.objectDesc.isImportant){managePlayerKey()}
            currentObjectInFront.objectInfo.object = false;
            currentObjectInFront.objectInfo.isOnScene = false;

            if(currentObjectInFront.objectInfo.objectDesc.fromMob)
            {
                managePlayerMoney(currentObjectInFront.objectInfo.objectDesc.objectValue,'add')
                mobUpdateFunc.current[currentObjectInFront.objectInfo.objectId]('Remove-Object',"none");
            }
            else
            {
                if(currentObjectInFront.objectInfo.objectDesc.hasChildObject)
                {
                    managePlayerMoney(currentObjectInFront.objectInfo.objectDesc.childObjectValue,'add')
                }
                else
                {
                    managePlayerMoney(currentObjectInFront.objectInfo.objectDesc.value,'add')
                }
                
                itemController.value[currentObjectInFront.objectInfo.objectId]('REMOVE-ITEM')
            }

            getNextPlatformInfo(playerDirection,'AfterMove');
        }
    let checkBlastArea = (obj)=>
        {
            let blastAreaObj = []
            for(let i = 0;i<obj.objectDesc.blastArea+1;i++)
            {   
                if(i == 0)
                {
                    for(let i1 = 0;i1<obj.objectDesc.blastArea;i1++)
                    {
                        let areaL = GameMap.find((elem)=>{return elem.id == obj.id+(i1+1)});
                        let areaR = GameMap.find((elem)=>{return elem.id == obj.id-(i1+1)});
                        if(areaL && areaL.zPose == obj.zPose){blastAreaObj.push( areaL)}
                        if(areaR && areaR.zPose == obj.zPose){blastAreaObj.push( areaR)}
                    }
                }
                else
                {
                    for(let i2 = 0;i2<obj.objectDesc.blastArea+1;i2++)
                    {
                        if(i2 == 0)
                        {
                            let areaF =  GameMap.find((elem)=>{return elem.id == obj.id+(_appContext.mapWidth.current*(i))})
                            let areaB =  GameMap.find((elem)=>{return elem.id == obj.id-(_appContext.mapWidth.current*(i))})
                            if(areaF){blastAreaObj.push( areaF) }
                            if(areaB){blastAreaObj.push( areaB) }
                        }
                        else
                        {
                            for(let i3 = 0;i3<obj.objectDesc.blastArea;i3++)
                            {
                                let centralAreaF = GameMap.find((elem)=>{return elem.id == obj.id+(_appContext.mapWidth.current*(i))});
                                let centralAreaB = GameMap.find((elem)=>{return elem.id == obj.id-(_appContext.mapWidth.current*(i))});
                                let areaFL = GameMap.find((elem)=>{return elem.id == obj.id+(_appContext.mapWidth.current*(i))+(i3+1)})
                                let areaFR = GameMap.find((elem)=>{return elem.id == obj.id+(_appContext.mapWidth.current*(i))-(i3+1)})
                                let areaBL = GameMap.find((elem)=>{return elem.id == obj.id-(_appContext.mapWidth.current*(i))+(i3+1)})
                                let areaBR = GameMap.find((elem)=>{return elem.id == obj.id-(_appContext.mapWidth.current*(i))-(i3+1)})

                                if(centralAreaF)
                                {
                                    if(areaFL && areaFL.zPose == centralAreaF.zPose){blastAreaObj.push( areaFL)}
                                    if(areaFR && areaFR.zPose == centralAreaF.zPose){blastAreaObj.push( areaFR)}
                                }

                                if(centralAreaB)
                                {
                                    if(areaBL && areaBL.zPose == centralAreaB.zPose){blastAreaObj.push( areaBL)}
                                    if(areaBR && areaBR.zPose == centralAreaB.zPose){blastAreaObj.push( areaBR)}
                                }

                            }

                        }

                    }
                }

            }
           
            for(let i=0;i<blastAreaObj.length;i++)
            {
                mapGroundController.current[blastAreaObj[i].id]()
                if(blastAreaObj[i].object)
                {
                    if(blastAreaObj[i].objectType=="dynamic_object")
                    {
                        if(blastAreaObj[i].objectDesc.objectName=="bomb_item")
                        {   
                            itemController.value[blastAreaObj[i].objectId]('BOMB-DIRECT-EXPLOSION',blastAreaObj[i])
                        }
                    }
                    if(blastAreaObj[i].objectType=="wall")
                    {
                        if(blastAreaObj[i].objectDesc.destructible)
                        {
                            blastAreaObj[i].object = false;
                            blastAreaObj[i].isOnScene = false;
                            // console.log(wallController.value[blastAreaObj[i].objectId])
                            wallController.value[blastAreaObj[i].objectId]('REMOVE-WALL')
                        }
                       
                    }
                }
            } 
                   

        }
    let playerMovePressedEventHandler = (touchPressed)=>
    {
        if(!aKeyisPressed.current && !playerMoveIsActive.current && !camRotateStart.current
            && !weaponReload.start
          )
            {
                    keyPressedName.current = touchPressed;
                if(!_appContext.gamePause.current)
                {

                    if(touchPressed == 'ArrowLeft' || touchPressed == 'q')
                    {
                        // console.log(playerDirection.value)
                        playerDirection.value =='LEFT'? null : rotatePlayer(playerDirection.value,'LEFT');playerDirection.value ='LEFT';
                        // if(playerDirection.value =='LEFT'){}
                        // else
                        // {
                        //     playerDirection.value ='LEFT'
                        //     rotatePlayer('LEFT')
                        // }
                        directionToGo.value = 'LEFT'
                        preparePlayerMove(gloBalObject)


                        
                    }
                    else if(touchPressed == 'ArrowRight' || touchPressed == 'd')
                    {
                        playerDirection.value =='RIGHT'? null : rotatePlayer(playerDirection.value,'RIGHT');playerDirection.value ='RIGHT';
                        // playerDirection.value ='RIGHT'
                        directionToGo.value='RIGHT'
                        preparePlayerMove(gloBalObject)


                    }
                    else if(touchPressed == 'ArrowUp' || touchPressed == 'z')
                    {
                            playerDirection.value =='FRONT'? null : rotatePlayer(playerDirection.value,'FRONT');playerDirection.value ='FRONT';
                            // playerDirection.value ='FRONT'
                            directionToGo.value='FRONT'
                            preparePlayerMove(gloBalObject)


                    }
                    else if(touchPressed == 'ArrowDown' || touchPressed == 's')
                    {
                            playerDirection.value =='BACK'? null : rotatePlayer(playerDirection.value,'BACK');playerDirection.value ='BACK';
                            directionToGo.value='BACK'
                            preparePlayerMove(gloBalObject)

                    }
                    else if(touchPressed == 'a')
                    {
                        aKeyisPressed.current = true

                        camRotateInfo.left.xCamValue = orbitRef.current.target.x;
                        camRotateInfo.left.zCamValue = orbitRef.current.target.z;
                        camRotateStart.current = true;
                        // LEFT
                        if(playerDirection.value == 'FRONT'){playerDirection.value ='LEFT'}
                        else if(playerDirection.value == 'LEFT'){playerDirection.value ='BACK'}
                        else if(playerDirection.value == 'BACK'){playerDirection.value ='RIGHT'}
                        else if(playerDirection.value == 'RIGHT'){playerDirection.value ='FRONT'}
                        if(playerDirection.value == 'LEFT')
                        {
                            spearScale(0)
                            camRotateInfo.left.x = orbitRef.current.target.x+2;
                            camRotateInfo.left.z = orbitRef.current.target.z-2;
                        }
                        else if(playerDirection.value == 'BACK')
                        {
                            spearScale(0)
                            camRotateInfo.left.x = orbitRef.current.target.x-2;
                            camRotateInfo.left.z = orbitRef.current.target.z-2;
                        }
                        else if(playerDirection.value == 'RIGHT')
                        {
                            spearScale(0)
                            camRotateInfo.left.x = orbitRef.current.target.x-2;
                            camRotateInfo.left.z = orbitRef.current.target.z+2;
                        }
                        else if(playerDirection.value == 'FRONT')
                        {
                            spearScale(0)
                            camRotateInfo.left.x = orbitRef.current.target.x+2;
                            camRotateInfo.left.z = orbitRef.current.target.z+2;
                        }
                    }
                    else if(touchPressed == 'e')
                        {
                            aKeyisPressed.current = true

                            camRotateInfo.left.xCamValue = orbitRef.current.target.x;
                            camRotateInfo.left.zCamValue = orbitRef.current.target.z;
                            camRotateStart.current = true;
                            // RIGHT
                            if(playerDirection.value == 'FRONT'){playerDirection.value ='RIGHT'}
                            else if(playerDirection.value == 'RIGHT'){playerDirection.value ='BACK'}
                            else if(playerDirection.value == 'BACK'){playerDirection.value ='LEFT'}
                            else if(playerDirection.value == 'LEFT'){playerDirection.value ='FRONT'}
                            if(playerDirection.value == 'RIGHT')
                            {
                                spearScale(0)
                                camRotateInfo.left.x = orbitRef.current.target.x-2;
                                camRotateInfo.left.z = orbitRef.current.target.z-2;
                            }
                            else if(playerDirection.value == 'BACK')
                            {
                                spearScale(0)
                                camRotateInfo.left.x = orbitRef.current.target.x+2;
                                camRotateInfo.left.z = orbitRef.current.target.z-2;
                            }
                            else if(playerDirection.value == 'LEFT')
                            {
                                spearScale(0)
                                camRotateInfo.left.x = orbitRef.current.target.x+2;
                                camRotateInfo.left.z = orbitRef.current.target.z+2;
                            }
                            else if(playerDirection.value == 'FRONT')
                            {
                                spearScale(0)
                                camRotateInfo.left.x = orbitRef.current.target.x-2;
                                camRotateInfo.left.z = orbitRef.current.target.z+2;
                            }
                        }
                    else if(touchPressed == ' ')
                    {
                        aKeyisPressed.current = true;
                        if(currentObjectInFront.effect == 'none')
                            {
                                if(nextBulletToShoot.value)
                                {
                                    if(!weaponReload.start)
                                        {
                                            //SHOOT
                                            if(playerCanShoot)
                                            {

                                                AudioManage.play("shoot")
                                                // _appContext.BulletReloadIconController.current('RELOAD-START');
                                                for(let i =0;i<bulletRef.current.length;i++)
                                                {
                                                    if(!bulletRefInfo.current[i].isShooted)
                                                    {

                                                        bulletRef.current[i].position.x = playerPositionOnMap.x;
                                                        bulletRef.current[i].position.z = playerPositionOnMap.z;
                                                        bulletPositionOnMap[i].x = playerPositionOnMap.x;
                                                        bulletPositionOnMap[i].z = playerPositionOnMap.z;
                                                    }

                                                }

                                                if(!showWeapon3DModel.value)
                                                    {
                                                        bulletModelController.value[nextBulletToShoot.value._index]('SHOW-BULLET')
                                                        
                                                    }


                                                nextBulletToShoot.value.isShooted = true;
                                                nextBulletToShoot.value.prepareMove = true;
                                                nextBulletToShoot.value.direction = playerDirection.value;
                                                bulletRefInfo.current[nextBulletToShoot.value._index].direction = playerDirection.value;
                                                weaponReload.start = true
                                            }
                                            else
                                            {
                                                _appContext.gameNotifFunc.current('Take your Weapon !','player');
                                                
                                            }

                                        }
                                        else
                                        {
                                           // RELOAD
                                        }
                                }


                            }
                            else if (currentObjectInFront.effect == 'Exit')
                            {

                                if(currentObjectInFront.objectInfo.objectDesc.open)
                                {
                                    
                                    if(_appContext.levelInfo.current.finalLevel)
                                    {
                                        gameEnding()
                                    }
                                    else
                                    {
                                        _appContext.nextLevel()
                                    }
                                    

                                }
                                else
                                {
                                   
                                    if(_appContext.gameState.current.level == 1){_appContext.gameNotifFunc.current('Récuperez la lance pour avancer','player');}
                                    else{_appContext.gameNotifFunc.current('Closed !','player');}

                                }


                            }
                            else if (currentObjectInFront.effect == 'UPGRADE')
                            {
                                AudioManage.play('coin')
                                currentObjectInFront.objectInfo.object = false;
                                currentObjectInFront.objectInfo.isOnScene = false;

                                if(currentObjectInFront.objectInfo.objectDesc.fromMob)
                                {
                                    
                                    upgradePlayerState(currentObjectInFront.objectInfo.objectDesc.hasObject)
                                    mobUpdateFunc.current[currentObjectInFront.objectInfo.objectId]('Remove-Object',"none");
                                }
                                else
                                {
                                    if(currentObjectInFront.objectInfo.objectDesc.hasChildObject)
                                    {
                                        upgradePlayerState(currentObjectInFront.objectInfo.objectDesc.hasChildObject)
                                    }
                                    else
                                    {   
                                        upgradePlayerState(currentObjectInFront.objectInfo.objectDesc.objectName)
                                    }
                                    
                                    itemController.value[currentObjectInFront.objectInfo.objectId]('REMOVE-ITEM')
                                }

                                getNextPlatformInfo(playerDirection,'AfterMove');

                            }
                            else if (currentObjectInFront.effect == 'CAURIS')
                            {
                                // takeCoin();

                            }
                            else if (currentObjectInFront.effect == 'KEY')
                            {
                                AudioManage.play('coin')
                                currentObjectInFront.objectInfo.object = false;
                                currentObjectInFront.objectInfo.isOnScene = false;

                                if(currentObjectInFront.objectInfo.objectDesc.fromMob)
                                {
                                    if(currentObjectInFront.objectInfo.objectDesc.objectIsImportant){managePlayerKey()}
                                    mobUpdateFunc.current[currentObjectInFront.objectInfo.objectId]('Remove-Object',"none");
                                }
                                else
                                {
                                    if(currentObjectInFront.objectInfo.objectDesc.isImportant || 
                                       currentObjectInFront.objectInfo.objectDesc.childObjectIsImportant){managePlayerKey()}
                                    itemController.value[currentObjectInFront.objectInfo.objectId]('REMOVE-ITEM')
                                }

                                getNextPlatformInfo(playerDirection,'AfterMove');

                            }
                            else if (currentObjectInFront.effect == 'bomb')
                            {
                                AudioManage.play('coin')
                                

                                itemController.value[currentObjectInFront.objectInfo.objectId]('START-BOMB-COUNTER',currentObjectInFront.objectInfo)

                                getNextPlatformInfo(playerDirection,'AfterMove');

                            }
                            else if (currentObjectInFront.effect == 'HEAL')
                            {
                                AudioManage.play('heal');
                                _appContext.ScreenHaloCOntroller.current('GLOW-GREEN')
                                if(currentObjectInFront.objectInfo.objectDesc.isImportant){managePlayerKey()}
                                currentObjectInFront.objectInfo.object = false;
                                currentObjectInFront.objectInfo.isOnScene = false;
                                if(currentObjectInFront.objectInfo.objectDesc.fromMob)
                                {
                                    increasePlayerLife(currentObjectInFront.objectInfo.objectDesc.objectValue)
                                    mobUpdateFunc.current[currentObjectInFront.objectInfo.objectId]('Remove-Object',"none");
                                }
                                else
                                {
                                    increasePlayerLife(currentObjectInFront.objectInfo.objectDesc.value)
                                    itemController.value[currentObjectInFront.objectInfo.objectId]('REMOVE-ITEM')
                                }

                                getNextPlatformInfo(playerDirection,'AfterMove');

                            }
                            else if (currentObjectInFront.effect == 'SPEAR')
                            {
                                // AudioManage.play('grab');

                                if(currentObjectInFront.objectInfo.objectDesc.isImportant){managePlayerKey()}

                                currentObjectInFront.objectInfo.isOnScene = false
                                objectRef.current[currentObjectInFront.objectInfo.objectId].children[0].visible = false;
                                getNextPlatformInfo(playerDirection,'AfterMove');

                                if(_appContext.gameState.current.level == 1)
                                {
                                    playerCanShoot = true;
                                    bulletGroupRef.current.visible = true


                                }
                            }

                    }

                }
                else
                {
                        if(touchPressed == ' ')
                        {
                            aKeyisPressed.current = true;
                            if(_appContext.actualGameScreen.current == 'HELP-SCREEN' || _appContext.actualGameScreen.current == 'STORY-SCREEN')
                            {
                                
                                _appContext.KeyBoardManageStory.current()
                            }
                            else
                            {

                            }





                        }
                }


            }
    }

    let playerMoveUpEventHandler = (touchPressed)=>
    {
        if(keyPressedName.current == touchPressed )
            {
                aKeyisPressed.current = false;
            }
    }
    for(let i = 0;i<totalBullet.value;i++)
    {
        bulletContainer[i] = <mesh
                                key={i}
                                position={[playerPoseVar.x,0.6,playerPoseVar.z]}
                                rotation={[0,Math.PI,0]}
                                ref={(val)=> bulletRef.current[i] = val }
                                >
                                    <sphereGeometry args={[0.05,10,10]} />
                                    <meshBasicMaterial visible={false}  />

                                    <BulletModel controller={{bulletModelController:bulletModelController,index:i}} _rotation={[Math.PI*0.5,0,0]}  
                                    _visible={false} posX={0.298} posY={1.4} posZ={0.861}/>
                            </mesh>
        bulletRefInfo.current[i] = {_index:i,isShooted:false,prepareMove:false,move:"none",direction:'none',hasCheckNextPlatform:false,moveDistance:0};
        bulletPositionOnMap[i] = {x:playerPoseVar.x,y:0.6,z:playerPoseVar.z};
    }


    useFrame((clock)=>
        {
            if(!_appContext.gamePause.current)
            {


                if(camRotateStart.current)
                {
                    rotateCam(gloBalObject);
                }
                if(playerMoveIsActive.current)
                {

                    movePlayer(gloBalObject)

                }
                moveBullet(gloBalObject)
            }

        })
        
    useEffect(()=>
        {

            _appContext.GameUIController.current({arg1:'DIRECT',arg2:'STORY-SCREEN'});
            
        },[])
    useEffect(()=>
        {


            prepareNextBullet(gloBalObject);
            _appContext.playerStats.current.keyCollected = 0
            _appContext.playerStats.current.mobKilled = 0
            _appContext.playerStats.current.batteryPlaced = 0
            _appContext.playerMoneyContainerRef.current.innerText = _appContext.playerStats.current.coinCollected;
            let playerMovePressedEventHandlerCallB = (evt)=>
            {
                playerMovePressedEventHandler(evt.key)
            }
            let playerMoveUpEventHandlerCallB = (evt)=>
            {
                playerMoveUpEventHandler(evt.key)
            }
            _appContext.touchEventMFunc.current.center = ()=>{playerMovePressedEventHandler(' ')}
            _appContext.touchEventMFunc.current.left = ()=>{playerMovePressedEventHandler('ArrowLeft')}
            _appContext.touchEventMFunc.current.right = ()=>{playerMovePressedEventHandler('ArrowRight')}
            _appContext.touchEventMFunc.current.up = ()=>{playerMovePressedEventHandler('ArrowUp')}
            _appContext.touchEventMFunc.current.down = ()=>{playerMovePressedEventHandler('ArrowDown')}
            _appContext.touchEventMFunc.current.turnRight = ()=>{playerMovePressedEventHandler('e')}
            _appContext.touchEventMFunc.current.turnLeft = ()=>{playerMovePressedEventHandler('a')}

            _appContext.touchEventTouchEndFunc.current.center = ()=>{playerMoveUpEventHandler(' ')}
            _appContext.touchEventTouchEndFunc.current.left = ()=>{playerMoveUpEventHandler('ArrowLeft')}
            _appContext.touchEventTouchEndFunc.current.right = ()=>{playerMoveUpEventHandler('ArrowRight')}
            _appContext.touchEventTouchEndFunc.current.up = ()=>{playerMoveUpEventHandler('ArrowUp')}
            _appContext.touchEventTouchEndFunc.current.down = ()=>{playerMoveUpEventHandler('ArrowDown')}
            _appContext.touchEventTouchEndFunc.current.turnRight = ()=>{playerMoveUpEventHandler('e')}
            _appContext.touchEventTouchEndFunc.current.turnLeft = ()=>{playerMoveUpEventHandler('a')}

            window.addEventListener('keydown',playerMovePressedEventHandlerCallB,true)
            window.addEventListener('keyup',playerMoveUpEventHandlerCallB,true)



            return ()=>
            {
                
                window.removeEventListener('keydown',playerMovePressedEventHandlerCallB,true)
                window.removeEventListener('keyup',playerMoveUpEventHandlerCallB,true)
            }
        },[])
        gloBalObject = {moveDirection,getPlayerPosition,getCameraPOsition,getorbitPosition,playerCursorRef,
            camRef,orbitRef,playerSpeed,playerDistance,bulletRef,bulletRefInfo,walkEffectTimer,playerDistanceTarget,
            playerMoveIsActive,getNextPlatformInfo,playerDirection,aKeyisPressed,objetDirection,GameMap,playerPositionOnMap,
            directionToGo,camRotateInfo,camRotateStart,weaponReload,resetBullet,getCurrentBulletPlatform,objectRef,exitDoorModelIndexArr,
            gloBalObject,bulletSpeed,nextBulletToShoot,bulletPositionOnMap,mobUpdateFunc,checkWinCondition,objectContainer,exitDoorMapIndexArr,
            barierMapIndexArr,mobIndexArr,_appContext,spearScale,barierModelIndexArr,exitDoorVisible,itemController,
            wallController,exitDoorController,showWeapon3DModel,bulletModelController,platformModelContainer,wallModelContainer,mobObjectIdArr,
            checkBarierCondition,movableObjectIndexArr,objectCanMove,managePlayerKey,managePlayerBattery,checkCurrentPlayerPlatform,takeObjectOnPlayerPosition,
            mapGroundController

            }
        placeModelOnScene(gloBalObject)

    return <>
                <gameAppContext.Provider
                    value={{mapGroundController,GameMap,checkBlastArea,objectCanMove,playerPositionOnMap,playerMoveIsActive,enemyLifePoint,reducePlayerLife,mobUpdateFunc,mobObjectIdArr,barierModelIndexArr,exitDoorModelIndexArr}}
                >

                        {_appContext.devMode.current?
                            <>
                             <PerspectiveCamera position={[15,35,-2]} ref={camRef} makeDefault />
                             <OrbitControls target={[playerPoseVar.x+15,0.8,playerPoseVar.z]} ref={orbitRef} />
                            </>
                        :
                            <>
                            <PerspectiveCamera position={[playerPoseVar.x,10,playerPoseVar.z-7]} ref={camRef} makeDefault />
                            <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} target={[playerPoseVar.x,0.8,playerPoseVar.z+2]} ref={orbitRef} />
                            </>
                        }

                       
                        {_appContext.devMode.current && <axesHelper args={[15]} /> }
                        {platformModelContainer.current}
                        {wallModelContainer.current}
                        {objectContainer.current}
                        {/* <mesh
                            name="PLAYER"
                            ref={playerCursorRef}
                            rotation={[0,Math.PI*2,0]}
                            position={[playerPositionOnMap.x,0.6,playerPositionOnMap.z]}
                        >
                            <boxGeometry args={[0.5,0.5,0.5]}/>
                            <meshBasicMaterial color={'blue'} wireframe />

                            


                        </mesh> */}
                        <group ref={playerCursorRef} rotation={[0,Math.PI,0]} position={[playerPositionOnMap.x,0,playerPositionOnMap.z]} >
                                <PlayerDirection  />
                        </group>
                        
                        <group
                                ref={bulletGroupRef}
                                visible={true}
                        >
                            {bulletContainer}
                        </group>

                       
                        {_appContext.devMode.current && <PlatformIndex />}
                        <fog attach={'fog'} args={[gameMapInfo.fogColor,gameMapInfo.fogNear,gameMapInfo.fogFar]} />

                </gameAppContext.Provider>
            </>
}
