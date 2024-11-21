import * as THREE from "three"
import { createContext, useContext, useEffect, useRef } from "react"
import { gameAppContext } from "./GameApp"
import { useFrame } from "@react-three/fiber";
import { MobLifeBar } from "./GameUI";
import { ItemType1Model, EnemyBullet, Mob_1_model, ItemType2Model } from "./Game3DAssets";
import { appContext } from "../src/App";
import { AudioManage } from "./audioComponents";
export let mobContext = createContext(null)
//MOB_2
//NE BOUGE PAS MAIS TIRE LORSQU'ON SE RETROUVE SUR SON AXE PAR INTERVALLE
export function Mob_2(props)
{
    let _appContext = useContext(appContext);
    let _gameAppContext = useContext(gameAppContext);
    
    const GameMap = _gameAppContext.GameMap;
    let enemyPositionOnMap = {x:props.x,y:0,z:props.z};
    let itemController = {value:[]};
    let enemyController = useRef(null);
    let bulletGroupRef = useRef(null);
    let lifeBarFunc = useRef(null);
    let lifeBarController = useRef(null);
    let mobShootAnimationOver = useRef(false);
    let checkOnce = true;
    let distanceInscrementation=0;
    let playerIsAlreadyOnAxis = {front:false,back:false,left:false,right:false};
    
    let bulletSpeed = 0.1*5;  //2 | 5
    let mobBulletRef = useRef([]);
    let mobBulletInfo = [];
    let mobBulletModel = [];
    let playerDirectionToMob = 'none';
    let mobState = 'Alive';
    let mobEffectCounterStart = false;
    let mobEffectCounter = 100;
    let mobDeadCallBack; 
    let mobSpec = useRef({shootSpeed:40})

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
            // mobEffectCounter --;
            // if(mobEffectCounter == 0)
            // {
                
                enemyController.current('REMOVE-MOB');
                bulletGroupRef.current.visible = false;
                if(_appContext.devMode.current)
                {
                    lifeBarController.current("REMOVE");
                }
                if(props.hasObject)
                {
                    itemController.value[0]('SHOW-ITEM')
                    
                    
                }
                // mobDeadCallBack();
           // }
        }
    for(let i =0; i< 10;i++)
    {
        mobBulletInfo[i] = {index:i,checkOnce:false,isShooted:false,bulletNextMove:'none',bulletDirection:'none',bulletDistance:2,
                            posX:enemyPositionOnMap.x,posZ:enemyPositionOnMap.z,count:0,countBeforeShootOver:false
                            }
        mobBulletModel[i] = 
                                <EnemyBullet key={i} _i={i} _ref={(val)=>mobBulletRef.current[i] = val}
                                _position={[enemyPositionOnMap.x,0.5,enemyPositionOnMap.z]}  />
                            
    }

    let updateMobInfo = (state,_numb)=>
        {
            if(state == 'dead')
            {
                mobState = 'Dead';
                enemyController.current('PLAY-MOB-DEAD-ANIMATION',()=>{_numb();startMobEffectCounter();})
                // mobEffectCounterStart = true;
                // mobDeadCallBack = _numb
                

            }
            else if(state == 'Update-Mob-Life')
            {  
                enemyController.current('MOB-TOUCHED')
                // lifeBarFunc.current(_numb)
                if(_appContext.devMode.current)
                {
                    lifeBarController.current('UPDATE-MOB-LIFE')
                }
                
            }
            else if(state == 'Remove-Object')
            {
                
                itemController.value[0]('REMOVE-ITEM')
                // keyRef.current.visible = false
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
                // freeBulletElem.count = Math.floor((Math.random()*10)+81)
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
                    
                    AudioManage.play('playerhit')
                    mobShootAnimationOver.current = false;
                    mobBulletRef.current[index].material.visible = false;
                    mobBulletRef.current[index].position.x = enemyPositionOnMap.x
                    mobBulletRef.current[index].position.z = enemyPositionOnMap.z
                    mobBulletInfo[index] = {index:index,checkOnce:false,isShooted:false,bulletNextMove:'none',bulletDirection:'none',bulletDistance:2,
                        posX:enemyPositionOnMap.x,posZ:enemyPositionOnMap.z,count:0,countBeforeShootOver:false};
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
                    mobBulletRef.current[index].position.x = enemyPositionOnMap.x
                    mobBulletRef.current[index].position.z = enemyPositionOnMap.z
                   
                    mobBulletInfo[index] = {index:index,checkOnce:false,isShooted:false,bulletNextMove:'none',bulletDirection:'none',bulletDistance:2,
                        posX:enemyPositionOnMap.x,posZ:enemyPositionOnMap.z,count:0,countBeforeShootOver:false};
                    if(mobState=='Alive')
                    {
                        checkIfPlayerIsOnMobAxis('LEFT')
                        checkIfPlayerIsOnMobAxis('RIGHT')
                        checkIfPlayerIsOnMobAxis('FRONT')
                        checkIfPlayerIsOnMobAxis('BACK')
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
                            findResult = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z + distanceInscrementation })
                        }
                        if(checkDirection == 'BACK')
                        {
                            findResult = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z - distanceInscrementation })
                        }
                        else if(checkDirection == 'LEFT')
                        {
                            findResult = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x + distanceInscrementation && elem.zPose == enemyPositionOnMap.z })
                        }
                        else if(checkDirection == 'RIGHT')
                        {
                            findResult = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x - distanceInscrementation && elem.zPose == enemyPositionOnMap.z })
                        }
                    }
                
                getPlatformInfo()
                 
                
                if(findResult)
                {
                    
                    if(_gameAppContext.playerPositionOnMap.x == findResult.xPose && _gameAppContext.playerPositionOnMap.z == findResult.zPose)
                    {
                        // EST SUR L'AXIS
                        
                        if(checkDirection == 'FRONT'){playerDirectionToMob = "FRONT";  enemyController.current('MOB-ROTATE-FRONT')}
                        else if(checkDirection == 'BACK'){playerDirectionToMob = "BACK"; enemyController.current('MOB-ROTATE-BACK')}
                        else if(checkDirection == 'LEFT'){playerDirectionToMob = "LEFT"; enemyController.current('MOB-ROTATE-LEFT')}
                        else if(checkDirection == 'RIGHT'){playerDirectionToMob = "RIGHT"; enemyController.current('MOB-ROTATE-RIGHT')}
                        
                        if(playerDirectionToMob == "FRONT")
                        {
                            if(!playerIsAlreadyOnAxis.front)
                            {
                                playerIsAlreadyOnAxis.front = true;
                                prepareBulletAnimation();
                            }
                        }
                        else if(playerDirectionToMob == "BACK")
                        {
                            if(!playerIsAlreadyOnAxis.back)
                            {
                                playerIsAlreadyOnAxis.back = true;
                                prepareBulletAnimation();
                            }
                        }
                        else if(playerDirectionToMob == "LEFT")
                        {
                            if(!playerIsAlreadyOnAxis.left)
                            {
                                playerIsAlreadyOnAxis.left = true;
                                prepareBulletAnimation();
                            }
                        }
                        else if(playerDirectionToMob == "RIGHT")
                        {
                            if(!playerIsAlreadyOnAxis.right)
                            {
                                playerIsAlreadyOnAxis.right = true;
                                prepareBulletAnimation();
                            }
                        }
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
                    
                }
                
            }
            checkMapPlatform()
            
            

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
                    if(mobState=='Alive')
                    {
                            // if(props._attack)
                            // {
                                if(!_gameAppContext.playerMoveIsActive.current)
                                    {
                                        if(checkOnce)
                                        {
                                            
                                            checkIfPlayerIsOnMobAxis('LEFT')
                                            checkIfPlayerIsOnMobAxis('RIGHT')
                                            checkIfPlayerIsOnMobAxis('FRONT')
                                            checkIfPlayerIsOnMobAxis('BACK')
                                            checkOnce = false;
                                        }
                                    }
                                    else
                                    {
                                        checkOnce = true;
                                    }
                            // }
                            
                            
                    }
                    if(props._attack)
                    {
                        shootMobBulletAnimation()
                    }
            } 
            
        })
    useEffect(()=>
        {
           
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
                                            x={enemyPositionOnMap.x} z={enemyPositionOnMap.z}
                                        >
                                        </Mob_1_model>
            }
            {props._attack && 
                              <>
                                   
                                        <Mob_1_model
                                        _context={mobContext}
                                        name="ENEMY-ACTIVE"
                                        x={enemyPositionOnMap.x} z={enemyPositionOnMap.z}
                                        customModel={props.mobCustomModel} />
                                    
                              </>

            }
            {props.hasObject? 
                    <>
                    {props.itemCustomModel == 'none' ?
                        
                            <>
                                {props.objectSkin == 'coin_item_1'? 
                                
                                <ItemType1Model controller={{itemController,index:0}} skin={props.objectSkin} _visible={false} x={enemyPositionOnMap.x} z={enemyPositionOnMap.z} />
                                :
                                <ItemType2Model objectName={props.hasObject} customModel = {props.itemCustomModel} controller={{itemController,index:0}} skin={props.objectSkin} _visible={false} x={enemyPositionOnMap.x} z={enemyPositionOnMap.z} />
                                
                                }
                            </>
                            :
                            <>
                                <ItemType2Model objectName={props.hasObject} customModel = {props.itemCustomModel} controller={{itemController,index:0}} skin={props.objectSkin} _visible={false} x={enemyPositionOnMap.x} z={enemyPositionOnMap.z} />
                            </>
                        
                    }
                    
                    </>
                    :null
            }
            {_appContext.devMode.current && <MobLifeBar _context={mobContext} x={enemyPositionOnMap.x} z={enemyPositionOnMap.z} maxMobLife={props.maxMobLife} mobLife={props.mobLife} />}
            
            
            <group
                ref={bulletGroupRef}
            >
                {mobBulletModel}
            </group>
            </mobContext.Provider>
            </>
    )
}
