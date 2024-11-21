import * as THREE from "three"
import { useContext, useEffect, useRef } from "react"
import { gameAppContext } from "./GameApp"
import { useFrame } from "@react-three/fiber";

export function EnemyComponent()
{
    let _gameAppContext = useContext(gameAppContext);
    const GameMap = _gameAppContext.GameMap;
    let playerMoveIsActive = _gameAppContext.playerMoveIsActive
    let playerPositiononMap = _gameAppContext.playerPositionOnMap;
    let enemyPositionOnMap = {x:GameMap[22].xPose,y:0,z:GameMap[22].zPose};
    let playerPositionOnMapCurrent = {x:0,y:0,z:0};
    let enemyMoving = {start:false,direction:'none',distance:0};
    let enemyMovindDistance = 2
    let selectedPlatformToGoPosOnMap = {x:0,y:0,z:0};
    let enemySpeed = 0.1;
    let enemyRef = useRef(null);
    let enemyCursorRef = useRef(null);
    let stopCheckIfPlayerMoved = true;
    let platformToGo =[];
    let selectedPlatformToGo;
    let playerPosToEnemy = 'none';
    let selectWichPlatformToGo;
    let startEnemyRun = 'none';
    let alternativeXPath='none';
    let alternativeZPath='none';
    let enemyStatut = 'Alive';
    let enemyLifePoint = _gameAppContext.enemyLifePoint
    let updateMap = ()=>
        {
            playerPositionOnMapCurrent.x = playerPositiononMap.x
            playerPositionOnMapCurrent.z = playerPositiononMap.z
            let enemyPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
            enemyPos.hasEnemy = true;
            stopCheckIfPlayerMoved = false;
            // console.log(enemyPos)
            // console.log(playerPositionOnMapCurrent.x+' et '+playerPositionOnMapCurrent.z)
        }
    let checkIfPlayerMoved = ()=>
        {
            
            if(playerPositiononMap.x != playerPositionOnMapCurrent.x || playerPositiononMap.z != playerPositionOnMapCurrent.z)
            {
                // console.log('bougé');
                stopCheckIfPlayerMoved = true;
                startEnemyAI()
            }
        }
    let startEnemyAI = ()=>
        {
            if(startEnemyRun == 'none')
            {
                playerPositionOnMapCurrent.x = playerPositiononMap.x
                playerPositionOnMapCurrent.z = playerPositiononMap.z
                
            }
            else
            {
                if(playerPositionOnMapCurrent.x != playerPositiononMap.x || playerPositionOnMapCurrent.z != playerPositiononMap.z)
                {
                    playerPositionOnMapCurrent.x = playerPositiononMap.x
                    playerPositionOnMapCurrent.z = playerPositiononMap.z
                    startEnemyRun = 'none'
                }
            }
            
            platformToGo =[];
            selectedPlatformToGo;
            playerPosToEnemy = 'none';
            if(enemyPositionOnMap.x > playerPositiononMap.x && enemyPositionOnMap.z > playerPositiononMap.z){playerPosToEnemy='RIGHT-BOTTOM'}
            else if(enemyPositionOnMap.x > playerPositiononMap.x && enemyPositionOnMap.z < playerPositiononMap.z){playerPosToEnemy='RIGHT-TOP'}
            else if(enemyPositionOnMap.x < playerPositiononMap.x && enemyPositionOnMap.z > playerPositiononMap.z){playerPosToEnemy='LEFT-BOTTOM'}
            else if(enemyPositionOnMap.x < playerPositiononMap.x && enemyPositionOnMap.z < playerPositiononMap.z){playerPosToEnemy='LEFT-TOP'}
            else if(enemyPositionOnMap.x == playerPositiononMap.x && enemyPositionOnMap.z > playerPositiononMap.z){playerPosToEnemy='BOTTOM'}
            else if(enemyPositionOnMap.x == playerPositiononMap.x && enemyPositionOnMap.z < playerPositiononMap.z){playerPosToEnemy='TOP'}
            else if(enemyPositionOnMap.z == playerPositiononMap.z && enemyPositionOnMap.x > playerPositiononMap.x){playerPosToEnemy='RIGHT'}
            else if(enemyPositionOnMap.z == playerPositiononMap.z && enemyPositionOnMap.x < playerPositiononMap.x){playerPosToEnemy='LEFT'}
            
            let getPlatformFunc = (elem)=>
            {
                return elem.xPose == playerPositiononMap.x && elem.zPose == playerPositiononMap.z 
            }

            let result = GameMap.find(getPlatformFunc);

            let playerLeft = GameMap.find((elem)=>{return elem.id == result.id + 1; }) 
            let playerRight = GameMap.find((elem)=>{return elem.id == result.id - 1; }) 
            let playerUp = GameMap.find((elem)=>{return elem.id == result.id + 16; }) 
            let playerBottom = GameMap.find((elem)=>{return elem.id == result.id - 16; });
            
            if(playerLeft)
            {
                if(playerPosToEnemy =='LEFT-BOTTOM' || playerPosToEnemy =='LEFT-TOP' || playerPosToEnemy =='LEFT')
                {
                    if(playerRight.zPose != playerLeft.zPose){playerLeft = 'not Allowed';}
                    else{playerLeft = "playerBack";}
                }
                else
                {
                    playerLeft = playerLeft.object? 'obstacle' : playerLeft;
                    // playerLeft = "playerBack";
                    // playerLeft = playerLeft;
                }
                
            }
            else{playerLeft = 'noPlatform'}


            if(playerRight)
            {
                if(playerPosToEnemy =='RIGHT-BOTTOM' || playerPosToEnemy =='RIGHT-TOP' || playerPosToEnemy =='RIGHT')
                {
                    if(playerRight.zPose != playerLeft.zPose){playerRight = 'not Allowed';}
                    else{playerRight = "playerBack";}
                }
                else
                {
                    playerRight = playerRight.object? 'obstacle' : playerRight;
                    // playerRight = "playerBack";
                    // playerRight = playerRight;
                }
                
            }
            else{ playerRight = 'noPlatform' }


            if(playerUp)
            {
                if(playerPosToEnemy =='BOTTOM' || playerPosToEnemy =='RIGHT-BOTTOM' || playerPosToEnemy =='LEFT-BOTTOM')
                {
                    playerUp = playerUp.object? 'obstacle' : playerUp;
                }
                else
                {
                    playerUp = "playerBack";
                }
                
            }
            else{playerUp = 'noPlatform'}


            if(playerBottom)
            {
                if(playerPosToEnemy =='TOP' || playerPosToEnemy =='RIGHT-TOP' || playerPosToEnemy =='LEFT-TOP')
                {
                    playerBottom = playerBottom.object? 'obstacle' : playerBottom;
                }
                else
                {
                    playerBottom = "playerBack";
                }
                
            }
            else{playerBottom = 'noPlatform'}


            if(playerLeft == 'obstacle' || playerLeft == 'not Allowed' || playerLeft == 'playerBack' || playerLeft == 'noPlatform'){}
            else{platformToGo.push({pose:'LEFT',objet:playerLeft})}
            if(playerRight == 'obstacle' || playerRight == 'not Allowed' || playerRight == 'playerBack' || playerRight == 'noPlatform'){}
            else{platformToGo.push({pose:'RIGHT',objet:playerRight})}
            if(playerUp == 'obstacle' || playerUp == 'not Allowed' || playerUp == 'playerBack' || playerUp == 'noPlatform'){}
            else{platformToGo.push({pose:'TOP',objet:playerUp})}
            if(playerBottom == 'obstacle' || playerBottom == 'not Allowed' || playerBottom == 'playerBack' || playerBottom == 'noPlatform'){}
            else{platformToGo.push({pose:'BOTTOM',objet:playerBottom})}
            // platformToGo=[playerLeft,playerRight,playerUp,playerBottom];
            

            // console.log(platformToGo)
            // ON SELECTIONNE UNE PLATEFORME SI IL Y A PLUS D'UN
            if(platformToGo.length>1)
            {
                let platformSectionWheel = ()=>
                    {   
                        if(playerPosToEnemy == "BOTTOM")
                        {  
                            
                            if(!platformToGo.find((elem)=>{return elem.pose == 'TOP'}))
                            {
                                if(!platformToGo.find((elem)=>{return elem.pose == 'LEFT'}))
                                {
                                    if(!platformToGo.find((elem)=>{return elem.pose == 'RIGHT'}))
                                    {
                                        selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'BOTTOM'}).objet;
                                    }
                                    else
                                    {
                                        selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'RIGHT'}).objet;
                                    }
                                }
                                else
                                {
                                    selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'LEFT'}).objet;
                                }
                            }
                            else
                            {
                                selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'TOP'}).objet;
                            }
                        }
                        else if(playerPosToEnemy == 'TOP')
                        {
                                if(!platformToGo.find((elem)=>{return elem.pose == 'BOTTOM'}))
                                {
                                    if(!platformToGo.find((elem)=>{return elem.pose == 'LEFT'}))
                                    {
                                        if(!platformToGo.find((elem)=>{return elem.pose == 'RIGHT'}))
                                        {
                                            selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'TOP'}).objet;
                                        }
                                        else
                                        {
                                            selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'RIGHT'}).objet;
                                        }
                                    }
                                    else
                                    {
                                        selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'LEFT'}).objet;
                                    }
                                }
                                else
                                {
                                    selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'BOTTOM'}).objet;
                                }
                           
                        }
                        else if(playerPosToEnemy == 'LEFT')
                        {
                                if(!platformToGo.find((elem)=>{return elem.pose == 'RIGHT'}))
                                {
                                    if(!platformToGo.find((elem)=>{return elem.pose == 'TOP'}))
                                    {
                                        if(!platformToGo.find((elem)=>{return elem.pose == 'BOTTOM'}))
                                        {
                                            selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'LEFT'}).objet;
                                        }
                                        else
                                        {
                                            selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'BOTTOM'}).objet;
                                        }
                                    }
                                    else
                                    {
                                        selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'TOP'}).objet;
                                    }
                                }
                                else
                                {
                                    selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'RIGHT'}).objet;
                                }
                           
                        }
                        else if(playerPosToEnemy == 'RIGHT')
                        {
                                if(!platformToGo.find((elem)=>{return elem.pose == 'LEFT'}))
                                {
                                    if(!platformToGo.find((elem)=>{return elem.pose == 'TOP'}))
                                    {
                                        if(!platformToGo.find((elem)=>{return elem.pose == 'BOTTOM'}))
                                        {
                                            selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'RIGHT'}).objet;
                                        }
                                        else
                                        {
                                            selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'BOTTOM'}).objet;
                                        }
                                    }
                                    else
                                    {
                                        selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'TOP'}).objet;
                                    }
                                }
                                else
                                {
                                    selectedPlatformToGo = platformToGo.find((elem)=>{return elem.pose == 'LEFT'}).objet;
                                }
                           
                        }
                        else
                        {
                            selectedPlatformToGo = platformToGo[Math.floor(Math.random()*platformToGo.length)].objet;
                        }
                        
                    }
                platformSectionWheel();
                // if(selectedPlatformToGo == 'obstacle' || selectedPlatformToGo == "noPlatform" || selectedPlatformToGo == "not Allowed" || selectedPlatformToGo == "playerBack")
                // {
                //     platformSectionWheel();
                // }
                
            }
            else
            {   
                selectedPlatformToGo = platformToGo[0].objet
            }
            // console.log(platformToGo)
            selectedPlatformToGoPosOnMap.x = selectedPlatformToGo.xPose
            selectedPlatformToGoPosOnMap.z = selectedPlatformToGo.zPose
            // console.log(selectedPlatformToGo)

            // DEPLACEMENT
            if(selectedPlatformToGoPosOnMap.x != 0 && selectedPlatformToGoPosOnMap.z !=0)
            {
                if(startEnemyRun == 'none')
                {
                    // selectWichPlatformToGo = Math.floor(Math.random()*2)
                    // selectWichPlatformToGo = 0
                    let xDistance,zDistance;
                    if(enemyPositionOnMap.x > selectedPlatformToGoPosOnMap.x)
                    {
                        xDistance = enemyPositionOnMap.x - selectedPlatformToGoPosOnMap.x
                    }
                    else
                    {
                        xDistance = selectedPlatformToGoPosOnMap.x - enemyPositionOnMap.x
                    }
                    if(enemyPositionOnMap.z > selectedPlatformToGoPosOnMap.z)
                    {
                        zDistance = enemyPositionOnMap.z - selectedPlatformToGoPosOnMap.z
                    }
                    else
                    {
                        zDistance = selectedPlatformToGoPosOnMap.z - enemyPositionOnMap.z
                    }
                    if(xDistance > zDistance)
                    {
                        selectWichPlatformToGo = 1
                    }
                    else
                    {
                        selectWichPlatformToGo = 0
                    }
                    let enemyPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                    enemyPos.hasEnemy = false;
                    // console.log('Chase');
                    startEnemyRun = 'start'
                }
                // console.log(selectWichPlatformToGo)
                if(selectWichPlatformToGo == 0)
                {   
                    // console.log(enemyPositionOnMap.x+' ici x '+selectedPlatformToGoPosOnMap.x)
                    //On commence par fait bouger X
                    if(enemyPositionOnMap.x > selectedPlatformToGoPosOnMap.x)
                    {   
                        enemyMoving.start = true;
                        // enemyMoving.direction = 'RIGHT'
                        enemyMoving.direction = getEnemyMoveDirection('RIGHT');
                        enemyMoving.distance = 2
                        let enemyPrevPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                        enemyPrevPos.hasEnemy = false;
                        if(enemyMoving.direction == 'BOTTOM'){enemyPositionOnMap.z -= enemyMoving.distance;}
                        else if(enemyMoving.direction == 'TOP'){enemyPositionOnMap.z += enemyMoving.distance;}
                        else if(enemyMoving.direction == 'LEFT'){enemyPositionOnMap.x += enemyMoving.distance;}
                        else if(enemyMoving.direction == 'RIGHT'){enemyPositionOnMap.x -= enemyMoving.distance;}
                        let enemyPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                        enemyPos.hasEnemy = true;
                        enemyCursorRef.current.position.x = enemyPositionOnMap.x
                        enemyCursorRef.current.position.z = enemyPositionOnMap.z

                        
                        
                    }
                    else if(selectedPlatformToGoPosOnMap.x > enemyPositionOnMap.x)
                    {
                        enemyMoving.start = true;
                        // enemyMoving.direction = 'RIGHT'
                        enemyMoving.direction = getEnemyMoveDirection('LEFT');
                        enemyMoving.distance = 2
                        let enemyPrevPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                        enemyPrevPos.hasEnemy = false;
                        if(enemyMoving.direction == 'BOTTOM'){enemyPositionOnMap.z -= enemyMoving.distance;}
                        else if(enemyMoving.direction == 'TOP'){enemyPositionOnMap.z += enemyMoving.distance;}
                        else if(enemyMoving.direction == 'LEFT'){enemyPositionOnMap.x += enemyMoving.distance;}
                        else if(enemyMoving.direction == 'RIGHT'){enemyPositionOnMap.x -= enemyMoving.distance;}
                        let enemyPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                        enemyPos.hasEnemy = true;
                        enemyCursorRef.current.position.x = enemyPositionOnMap.x
                        enemyCursorRef.current.position.z = enemyPositionOnMap.z

                    }
                    else if(selectedPlatformToGoPosOnMap.x == enemyPositionOnMap.x)
                    {
                        if(selectedPlatformToGoPosOnMap.z == enemyPositionOnMap.z)
                        {
                            updateMap();
                        }
                        else
                        {
                            selectWichPlatformToGo = 1;
                            startEnemyAI();
                        }
                    }
                    
                }
                else
                {
                    //On commence par fait bouger Z
                    // console.log(enemyPositionOnMap.z + ' ici z '+selectedPlatformToGoPosOnMap.z)
                    if(enemyPositionOnMap.z > selectedPlatformToGoPosOnMap.z)
                    {   
                        enemyMoving.start = true;
                        // enemyMoving.direction = 'BOTTOM'
                        enemyMoving.direction = getEnemyMoveDirection('BOTTOM');
                        enemyMoving.distance = 2;
                        let enemyPrevPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                        enemyPrevPos.hasEnemy = false;
                        if(enemyMoving.direction == 'BOTTOM'){enemyPositionOnMap.z -= enemyMoving.distance;}
                        else if(enemyMoving.direction == 'TOP'){enemyPositionOnMap.z += enemyMoving.distance;}
                        else if(enemyMoving.direction == 'LEFT'){enemyPositionOnMap.x += enemyMoving.distance;}
                        else if(enemyMoving.direction == 'RIGHT'){enemyPositionOnMap.x -= enemyMoving.distance;}
                        let enemyPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                        enemyPos.hasEnemy = true;
                        enemyCursorRef.current.position.x = enemyPositionOnMap.x
                        enemyCursorRef.current.position.z = enemyPositionOnMap.z
                        // enemyPositionOnMap.z--;
                    }
                    else if(enemyPositionOnMap.z < selectedPlatformToGoPosOnMap.z)
                    {
                        enemyMoving.start = true;
                        // enemyMoving.direction = 'TOP'
                        enemyMoving.direction = getEnemyMoveDirection('TOP');
                        enemyMoving.distance = 2;
                        let enemyPrevPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                        enemyPrevPos.hasEnemy = false;
                        if(enemyMoving.direction == 'BOTTOM'){enemyPositionOnMap.z -= enemyMoving.distance;}
                        else if(enemyMoving.direction == 'TOP'){enemyPositionOnMap.z += enemyMoving.distance;}
                        else if(enemyMoving.direction == 'LEFT'){enemyPositionOnMap.x += enemyMoving.distance;}
                        else if(enemyMoving.direction == 'RIGHT'){enemyPositionOnMap.x -= enemyMoving.distance;}
                        let enemyPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                        enemyPos.hasEnemy = true;
                        enemyCursorRef.current.position.x = enemyPositionOnMap.x
                        enemyCursorRef.current.position.z = enemyPositionOnMap.z
                        // enemyPositionOnMap.z++;
                    }
                    else if(enemyPositionOnMap.z == selectedPlatformToGoPosOnMap.z)
                    {
                        // console.log("déplacement finit");
                        // startEnemyAI();
                        if(selectedPlatformToGoPosOnMap.x == enemyPositionOnMap.x)
                        {
                            updateMap();
                        }
                        else
                        {
                            selectWichPlatformToGo = 0;
                            startEnemyAI();
                        }
                    }
                    
                    
                }
            }
            else
            {

            }
            //CLEAN

        }
    let getEnemyMoveDirection = (direction)=>
        {
            
            let checkPlatform = (elem)=>
            {
                return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z 
            }
            let result
            // if(direction == 'LEFT')
            // {
                // On vérifie d'abord si on est devant un block dans ce cas on suit le block

                        if(direction == 'LEFT'){enemyPositionOnMap.x += (enemyMovindDistance);}
                        if(direction == 'RIGHT'){enemyPositionOnMap.x -= (enemyMovindDistance);}
                        if(direction == 'FRONT'){enemyPositionOnMap.z += (enemyMovindDistance);}
                        if(direction == 'BOTTOM'){enemyPositionOnMap.z -= (enemyMovindDistance);}
                    
                    
                    result = GameMap.find(checkPlatform);
                    // objectOnMapRef.current = result

                        if(direction == 'LEFT'){enemyPositionOnMap.x -= (enemyMovindDistance);}
                        if(direction == 'RIGHT'){enemyPositionOnMap.x += (enemyMovindDistance);}
                        if(direction == 'FRONT'){enemyPositionOnMap.z -= (enemyMovindDistance);}
                        if(direction == 'BOTTOM'){enemyPositionOnMap.z += (enemyMovindDistance);}
                        
                    

                    if(result === undefined)
                    {
                        // console.log("not found") NO PLATFORM
                        return false
                    }
                    else
                    {
 
                            
                            // On vérifie si c'est un joueur ou un objet qui a fait la vérification
                            

                                if(result.object)
                                {
                                    if(result.isOnScene)
                                    {

                                        if(result.objectType == 'wall')
                                        {
                                            if(selectWichPlatformToGo == 1) //Z
                                            {
                                                if(alternativeZPath == 'none')
                                                {
                                                    let randomPath = Math.floor(Math.random()*2)

                                                    alternativeZPath = randomPath == 0? 'LEFT' : 'RIGHT';
                                                }
                                                if(alternativeZPath == 'LEFT')
                                                {
                                                    let xPath = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x + (enemyMovindDistance) && elem.zPose == enemyPositionOnMap.z })
                                                    
                                                    if(xPath === undefined){alternativeZPath = 'RIGHT';}
                                                    
                                                }
                                                else
                                                {
                                                    let xPath = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x - (enemyMovindDistance) && elem.zPose == enemyPositionOnMap.z })
                                                    
                                                    if(xPath === undefined){alternativeZPath = 'LEFT';}
                                                }
                                                return alternativeZPath;
                                            }
                                            else // X
                                            {
                                                if(alternativeXPath == 'none')
                                                {
                                                    let randomPath = Math.floor(Math.random()*2)

                                                    alternativeXPath = randomPath == 0? 'TOP' : 'BOTTOM';
                                                }
                                                if(alternativeXPath == 'TOP')
                                                {
                                                    let xPath = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x  && elem.zPose == enemyPositionOnMap.z + (enemyMovindDistance) })
                                                    
                                                    if(xPath === undefined){alternativeXPath = 'BOTTOM';}
                                                    
                                                }
                                                else
                                                {
                                                    let xPath = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z - (enemyMovindDistance) })
                                                    
                                                    if(xPath === undefined){alternativeXPath = 'TOP';}
                                                }
                                                return alternativeXPath;
                                            }
                                        }
                                        // return direction;
                                    }
                                    else
                                    {
                                        return direction;
                                    } 
                                    
                                    
                                }
                                else
                                {
                                    return direction;
                                }
                                
                            
                       
                        
                        
                    }
                

        }

    let moveEnemy = ()=>
        {
    
                    if(enemyMoving.start)
                    {
                          
                            // LA BALLE BOUGE
                            if(enemyMoving.distance > 0)
                            {   
                                enemyMoving.distance -= Math.round(enemySpeed * 100) / 100;
    
                                if(enemyMoving.direction == 'LEFT' )
                                {
                                    
                                   enemyRef.current.position.x += Math.round(enemySpeed * 100) / 100;
                                   enemyRef.current.position.x = Math.round(enemyRef.current.position.x * 100) / 100;
        
                                }
                                else if(enemyMoving.direction == 'RIGHT' )
                                {
                                   enemyRef.current.position.x -= Math.round(enemySpeed * 100) / 100;
                                   enemyRef.current.position.x = Math.round(enemyRef.current.position.x * 100) / 100;
        
                                }
                                else if(enemyMoving.direction == 'TOP' )
                                {
                                   enemyRef.current.position.z += Math.round(enemySpeed * 100) / 100;
                                   enemyRef.current.position.z = Math.round(enemyRef.current.position.z * 100) / 100;
        
                                }
                                else if(enemyMoving.direction == 'BOTTOM' )
                                {
                                   enemyRef.current.position.z -= Math.round(enemySpeed * 100) / 100;
                                   enemyRef.current.position.z = Math.round(enemyRef.current.position.z * 100) / 100;
        
                                }
                            }
                            else
                            {   
                                enemyMoving.start = false;
                                enemyMoving.direction = 'none'
                                enemyMoving.distance = 0
    
                                // QUE FAIRE MAINTENANT QUE LE MOUVEMENT EST FINIT
                                if(enemyLifePoint.value>0)
                                {
                                    startEnemyAI();
                                }
                                else
                                {
                                    let enemyPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                                    enemyPos.hasEnemy = false;
                                    // enemyRef.current.material.color = new THREE.Color(0,0,1)
                                    enemyStatut == 'Dead'
                                }
                                
                                // let enemyPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                                // enemyPos.hasEnemy = false;
                            }
                            
                            
                       
                        
                    }
                    else
                    {   //SI LE MOB NE BOUGE PLUS DU TOUT
                        if(!playerMoveIsActive.current && !stopCheckIfPlayerMoved && enemyStatut == 'Alive')
                        {   
                            if(enemyLifePoint.value>0)
                            {   
                                
                                checkIfPlayerMoved();
                            }
                            else
                            {   
                                let enemyPos = GameMap.find((elem)=>{return elem.xPose == enemyPositionOnMap.x && elem.zPose == enemyPositionOnMap.z});
                                enemyPos.hasEnemy = false;
                                enemyRef.current.material.color = new THREE.Color(0,0,1)
                                enemyStatut == 'Dead'
                            }
                            
                        }
                        
                    }
                
        }
    useFrame((clock)=>
        {
            // enemyRef.current.position.x += 0.05;
            moveEnemy()
        })
    useEffect(()=>
        {
            startEnemyAI();
        },[])
    return(
            <>
            <mesh
                ref={enemyRef}
                name="ENEMY"
                position={[enemyPositionOnMap.x,0.5,enemyPositionOnMap.z]}
            >
                    <boxGeometry  args={[0.5,1,0.5]}/>
                    <meshBasicMaterial  color={'red'} />
            </mesh>
            <mesh
            ref={enemyCursorRef}
            name="ENEMY CURSOR"
            scale={1.05}
            position={[enemyPositionOnMap.x,0.5,enemyPositionOnMap.z]}
            >
                    <boxGeometry  args={[0.5,1,0.5]}/>
                    <meshBasicMaterial  color={'white'} side={THREE.BackSide} />
            </mesh>
            </>
    )
}


//Le mob se déplace en analysant bloc devant lui
//Si il y a un obstacle devant lui, il créé un alternativePath
//Exemple: Quand il envoi l'ordre de bouger en bas (BOTTOM) le système vérifie si la place ou il va est libre
//Si la place est libre il avance dans la cas contraire il créé une alternativepath pour contourner
//L'obstacle
//On peut aussi créér un alternativePath dans un autre pour des chemins plus complexes