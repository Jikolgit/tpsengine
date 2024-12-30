import * as THREE from 'three'
import { useContext, useRef } from "react";
import { appContext } from "../src/App";
import { AddDecor, AddDoor, AddItem, AddMob, AddChildItem, SetMapDimension, UpdateLevelConfig, AddWall, AddBarrier, UpdateStroryScreen, UpdatePlayerStat, AddDynamicObject, AddTestModel } from "./DefaultComponents";
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
                            <UpdateLevelConfig playerPosition={22} keyNumber={1}   />

                            <SetMapDimension width={15} height={15} />
                            <AddDecor position={[71,168,32]} skin="tombstone" />
                            {/* <AddDecor position={[145]} skin="lampadaire" /> */}
                            {/* <AddItem position={[21]}  name='coin_item' skin='coin_item_2' /> */}
                            {/* <AddItem position={[94]} name='bomb_item' _canMove={true} skin='bomb_item_1' /> */}
                            {/* <AddItem position={[24]} name='portal_item' _type='red' /> */}
                            {/* <AddItem position={[98]} name='bomb_item' _canMove={true} skin='bomb_item_1' /> */}
                            <AddItem name='coin_item' position={[96,97,98,126,127,128,111,113]} skin='coin_item_2' />
                            <AddItem position={[112]} name="key_item" />
                            {/* <AddDoor position={[38]} open  /> */}
                            <AddDoor position={[187]}  />
                        </>
                    }
                    {AppContext.level.current == 2 &&
                        <>
                            <UpdateLevelConfig playerPosition={10} batteryToPlace={2}  />
                           
                            <SetMapDimension width={7} height={15}  />
                            <AddBarrier position={[56,57,58,59,60,61,62]} orientation='HORIZONTAL' batteryNeeded={2} />
                            <AddItem position={[43,47]} name='portal_item' _portalID='01' _type='red' />
                            {/* <AddItem position={[38,59]} name='key_item' /> */}
                            {/* <AddItem position={[29,33]} name='battery_item' _canMove={true} skin='battery_item_1' /> */}
                            <AddDynamicObject position={[16,18]} _dObjectID='01' name='battery_item' _canMove={true} skin='battery_item_1' />

                            <AddDoor position={[94]} />
                        </>
                    }
                    {AppContext.level.current == 3 &&
                        <>
                            <UpdateLevelConfig playerPosition={10} keyNumber={1} />
                            <SetMapDimension width={7} height={15}  />
                            
                            <AddItem position={[52]} name='box_item' life={3}>
                                <AddChildItem name='key_item' />
                            </AddItem>
                            <AddDynamicObject position={[31]}  name='bomb_item' _blastArea={1} _bombCounter={2} _canMove={true} skin='bomb_item_1' />
                            <AddDynamicObject position={[32,33,40,47,54]} _activable={false}  name='bomb_item' _blastArea={1} _bombCounter={3} _canMove={true} skin='bomb_item_2' />
                            <AddDoor position={[94]} />
                        </>
                    }
                    {AppContext.level.current == 4 &&
                        <>
                            <UpdateLevelConfig playerPosition={50} keyNumber={1} barrierBattery={2}  />
                            <SetMapDimension width={20} height={20} />
                            <AddDynamicObject position={[156]} name='battery_item' _dObjectID='01' _canMove={true} />
                            <AddDynamicObject position={[223]} name='battery_item' _dObjectID='02' _canMove={true} />
                            {/* <AddDynamicObject position={[125]} name='bomb_item' _canMove={true} /> */}
                            <AddItem position={[285]} name='portal_item' _portalID='01' _type='red' />
                            <AddItem position={[295]} name='portal_item' _portalID='02' _type='red' />
                            <AddItem position={[190]} name='key_item' />
                            <AddBarrier position={[170,210]} orientation='HORIZONTAL' />
                            <AddBarrier position={[189,191]} orientation='VERTICAL' />
                            <AddWall position={[169,171,209,211]} />
                            <AddDoor position={[310]} />
                        </>
                    }
                    {AppContext.level.current == 5 &&
                        <>
                            <UpdateLevelConfig playerPosition={10} keyNumber={2}  />
                            <SetMapDimension width={7} height={15}  />
                            {/* <UpdateStroryScreen>
                                <div>Destroy the <span className="text-yellow-500">box</span> to find the keys</div>
                            </UpdateStroryScreen>
                            <AddMob position={[52,82,81,78,79]} life={5} type="2" />  */}
                            <AddItem name="box_item" position={[33,75]} life={2}>
                                <AddChildItem name="key_item"   />
                            </AddItem>
                            <AddItem name='coin_item' position={[46,47,60,61]} skin='coin_item_2' />
                            <AddWall position={[38,39,40,68,67,66]}/>
                            <AddBarrier position={[45,52,59]} orientation='VERTICAL' />
                            <AddTestModel position={[53]} />
                            <AddDoor position={[94]} />

                        </>
                    }
                    {AppContext.level.current == 6 &&
                        <>
                            <SetMapDimension width={15} height={15}  />
                            <UpdateLevelConfig playerPosition={37} barrierBattery={2} keyNumber={1} />
                            
                            {/* <UpdateStroryScreen>
                                <div>Get the <span className="text-blue-500">sphere</span> to level up !</div>
                            </UpdateStroryScreen> */}
                            <AddWall position={[145,100,94,139]} />
                            <AddBarrier position={[90,91,92,93,135,136,137,138]} batteryNeeded={1} orientation='HORIZONTAL' />
                            <AddBarrier position={[109,124]} batteryNeeded={1} orientation='VERTICAL' />

                            <AddBarrier position={[101,102,103,104,146,147,148,149]} batteryNeeded={2} orientation='HORIZONTAL' />
                            <AddBarrier position={[130,115]} batteryNeeded={2} orientation='VERTICAL' />

                            <AddDynamicObject position={[159,106]} name = 'battery_item' _dObjectID='01' />
                            <AddItem position={[72,62]} name='portal_item' _portalID='01' />
                            <AddItem name='key_item' position={[118]} />
                            <AddItem name='coin_item' position={[105,107,108,120,121,122,123,119,117,116,134,133,132,131]} skin='coin_item_2' />
                            <AddDoor position={[187]}  />

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