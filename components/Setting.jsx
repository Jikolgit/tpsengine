import * as THREE from 'three'
import { useContext, useRef } from "react";
import { appContext } from "../src/App";
import { AddDecor, AddDoor, AddItem, AddMob, AddChildItem, SetMapDimension, UpdateLevelConfig, AddWall, AddBarrier, UpdateStroryScreen, UpdatePlayerStat } from "./DefaultComponents";
import { MobModelContext } from './Game3DAssets';

// HERE YOU CAN SETUP YOUR LEVELS
//
export function Settings()
{
    const AppContext = useContext(appContext);
    
    let CustomMobModel = ()=>
        {    
            let mobModelContext = useContext(MobModelContext); 
            let modelRef  = useRef(null);  
            
            mobModelContext.customMobController.current = (args)=>
            {
                if(args == 'REMOVE-MOB')
                {
                    modelRef.current.material.visible = false
                }

            }
            return(
                // HERE YOU CAN ADD YOUR CUTOM ENEMY MODEL
                <mesh ref={modelRef} >
                    <boxGeometry args={[1,1,1]} />
                    <meshBasicMaterial color={'red'} transparent={true} />
                </mesh>
            )
        }

    return(
            <>
                    {AppContext.level.current == 1 &&
                        <>
                            <UpdateLevelConfig playerPosition={22}   />

                            <SetMapDimension width={15} height={15} addWallOnMap />
                            <AddDecor position={[71,168,32]} skin="tombstone" />
                            <AddDecor position={[145,94]} skin="lampadaire" />
                            

                            <AddDoor position={[187]} open  />
                        </>
                    }
                    {AppContext.level.current == 2 &&
                        <>
                            <UpdateLevelConfig playerPosition={10} keyNumber={1}  />
                           
                            <SetMapDimension width={7} height={15} addWallOnMap />

                            
                            
                            <AddItem position={[66]} name="key_item" />
                    

                            <AddDoor position={[94]} />
                        </>
                    }
                    {AppContext.level.current == 3 &&
                        <>
                            <UpdateLevelConfig playerPosition={10} mobToKill={2} />
                            <SetMapDimension width={7} height={15} addWallOnMap />
                            <UpdateStroryScreen>
                                <div>Shoot the <span className="text-red-500">Ghost</span> to open the portal</div>
                            </UpdateStroryScreen>
                            
                            <AddMob position={[64]} life={2} type="2" important />
                            <AddMob position={[68]} life={1} type="2"  important />

                            
                            <AddDoor position={[94]} />
                        </>
                    }
                    {AppContext.level.current == 4 &&
                        <>
                            <UpdateLevelConfig playerPosition={10} mobToKill={3}  />
                            <SetMapDimension width={7} height={15} addWallOnMap />
                           
                            <AddMob position={[52,60,58]} type="2" important>
                                    <AddChildItem name="coin_item" value={5} />
                            </AddMob>
                            <AddDoor position={[94]} />
                        </>
                    }
                    {AppContext.level.current == 5 &&
                        <>
                            <UpdateLevelConfig playerPosition={10} keyNumber={2}  />
                            <SetMapDimension width={7} height={15} addWallOnMap />
                            <UpdateStroryScreen>
                                <div>Destroy the <span className="text-yellow-500">box</span> to find the keys</div>
                            </UpdateStroryScreen>
                            <AddMob position={[52,82,81,78,79]} life={5} type="2" /> 
                            <AddItem name="box_item" position={[96,92]} life={3}>
                                <AddChildItem name="key_item" important   />
                            </AddItem>
                            
                            <AddDoor position={[94]} />

                        </>
                    }
                    {AppContext.level.current == 6 &&
                        <>
                        <SetMapDimension width={7} height={15} addWallOnMap />
                            <UpdateLevelConfig playerPosition={10} />
                            
                            <UpdateStroryScreen>
                                <div>Get the <span className="text-blue-500">sphere</span> to level up !</div>
                            </UpdateStroryScreen>
                            <AddItem name="upgrade_life_item" position={[30]} />
                            <AddItem name="upgrade_shoot_speed_item" position={[31]} />
                            <AddItem name="upgrade_shoot_power_item" position={[32]} />
                            <AddDoor position={[94]} open />

                        </>
                    }
                    {AppContext.level.current == 7 &&
                        <>
                            <UpdateLevelConfig playerPosition={10} keyNumber={1} />
                            <SetMapDimension width={7} height={15} addWallOnMap />

                            <AddMob position={[45]} type="2" >
                                    <AddChildItem name="key_item" important />
                            </AddMob>
                            <AddDoor position={[94]} />


                        </>
                    }
                    {AppContext.level.current == 8 &&
                        <>
                            <UpdateLevelConfig playerPosition={9} mobToKill={3} />
                            <SetMapDimension width={7} height={15} addWallOnMap />

                            <AddMob position={[38,46]} type="2">
                                    <AddItem name="coin_item" value={5} />
                            </AddMob>
                            <AddMob position={[54,44,50]} important type="2">
                                    <AddItem name="coin_item" value={5} />
                            </AddMob>
                            <AddDoor position={[94]} />
                        </>
                    }
                    {AppContext.level.current == 9 &&
                        <>
                            <UpdateLevelConfig playerPosition={22} mobToKill={2} fog />
                            <SetMapDimension width={15} height={15} addWallOnMap />
                            <UpdateStroryScreen>
                                <div>You are going deeper in the dungeon</div>
                                <div className=""> <span className="text-red-500">Ghosts</span>  will be more agreesive</div>
                                <div>Be carefull !</div>
                            </UpdateStroryScreen>
                            <AddItem name="box_item" position={[42,191]} life={3} />
                            <AddItem name="box_item" position={[196]} >
                                    <AddChildItem name="upgrade_life_item" />
                            </AddItem>
                            <AddMob position={[116,152]} type="3" life={5} difficulty="medium" important>
                                <AddChildItem name="heal_item"  />
                            </AddMob>
                            <AddMob position={[152]} type="3" life={5} difficulty="medium" important />
                            <AddDoor position={[202]} />
                        </>
                    }

                    {AppContext.level.current == 10 &&
                        <>
                            <UpdateLevelConfig playerPosition={47} mobToKill={4} fog />
                            <SetMapDimension width={25} height={25} addWallOnMap />
                            <AddWall position={[45,70,95,120,145,170,195,220,245,270,295,320]} />
                            <AddWall position={[345,344,343,342,341,340,339,338,337,336,335,334,332,333,330,329]} />
                            <AddWall position={[448,447,446,445,444,443,442,441,440,439,438,437,436,435,434,433]} />
                            <AddWall position={[354,379,404,429,454,479,504,529,554,579,458,483,508,533,558,583]} />

                            <AddWall position={[307,305,282,280,257,255,232,231,230]} />
                            <AddMob position={[417,388,355,281,397]} type="2" life={5} difficulty="medium" important />
                            <AddItem name="box_item" life={2} position={[256]}>
                                    <AddChildItem name="upgrade_shoot_power_item" />
                            </AddItem>
                            <AddDoor position={[581]} />
                        </>
                    }
                    {AppContext.level.current == 11 &&
                        <>
                            <UpdateLevelConfig playerPosition={29} keyNumber={2} fog />
                            <SetMapDimension width={20} height={15} addWallOnMap />
                            <AddItem name="box_item" position={[262]} life={2}  >
                                    <AddChildItem name="upgrade_life_item"  />
                            </AddItem>
                            <AddItem name="box_item" position={[42]} life={2}  >
                                    <AddChildItem name="key_item"  />
                            </AddItem>
                            <AddItem name="box_item" position={[37]} life={3} />
                            <AddItem name="box_item" position={[16]} life={2}  >
                                    <AddChildItem name="upgrade_shoot_speed_item"  />
                            </AddItem>
                            <AddItem name="box_item" position={[257]} life={2}  >
                                    <AddChildItem name="key_item"  />
                            </AddItem>
                            <AddMob position={[125,211,77]} type="3" life={6} >
                                    <AddChildItem name="coin_item" value={15} />
                            </AddMob>
                            <AddDecor position={[86,176,143]} skin="tombstone" />
                            <AddDoor position={[269]} />
                        </>
                    }
                    {AppContext.level.current == 12 &&
                        <>
                            <UpdateLevelConfig playerPosition={30} keyNumber={1} fog />
                            <SetMapDimension width={20} height={20} addWallOnMap />
                            <AddItem position={[67,203,234,145]} name="box_item" />
                            <AddItem name="box_item" position={[178]}>
                                <AddChildItem name="key_item" />
                            </AddItem>

                            <AddDecor skin="lampadaire" position={[136,83,243,316]} />
                            <AddDecor skin="tombstone" position={[95,228,123]} />

                            <AddMob type="3" position={[336,302,78]} />

                            <AddItem name="heal_item" value={2} position={[89]} />
                            <AddDoor position={[364]} />
                        </>
                    }
                    {AppContext.level.current == 13 &&
                        <>
                            <UpdateLevelConfig playerPosition={30} keyNumber={1} fog finalLevel />
                            <SetMapDimension width={20} height={20} addWallOnMap />
                            <UpdateStroryScreen>
                                <div>You have found the secret treasure !</div>
                                <div className=""> Get ride of the <span className="text-red-500">Ghosts</span> to remove the barriers</div>
                                <div>Good luck !</div>
                            </UpdateStroryScreen>

                            <AddMob type="3" position={[150,270,207,213,76,63,303,316]} life={5} />

                            <AddItem name="heal_item" value={2} position={[89]} />

                            <AddItem name="key_item" position={[210]} skin='key_2' />
                            <AddBarrier position={[168,169,170,171,172,248,249,250,251,252]} mobToKill={4} />
                            <AddBarrier orientation="SIDE" position={[188,208,228,192,212,232]} mobToKill={4} />

                            
                            <AddDoor position={[350]} />
                        </>
                    }
            </>
    );
}