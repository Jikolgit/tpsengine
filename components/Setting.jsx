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
                            <UpdateLevelConfig playerPosition={3} keyNumber={1}   />

                            <SetMapDimension width={7} height={10} />
                            <UpdateStroryScreen>
                                <div>Get <span className="text-blue-500">key</span> to open the door</div>
                            </UpdateStroryScreen>
                            {/* <AddDecor position={[71,168,32]} skin="tombstone" /> */}
                            {/* <AddDecor position={[145]} skin="lampadaire" /> */}
                            {/* <AddItem position={[21]}  name='coin_item' skin='coin_item_2' /> */}
                            {/* <AddItem position={[94]} name='bomb_item' _canMove={true} skin='bomb_item_1' /> */}
                            {/* <AddItem position={[24]} name='portal_item' _type='red' /> */}
                            {/* <AddItem position={[98]} name='bomb_item' _canMove={true} skin='bomb_item_1' /> */}
                            {/* <AddItem name='coin_item' position={[96,97,98,126,127,128,111,113]} skin='coin_item_2' /> */}
                            <AddItem position={[38]} name="key_item" />
                            {/* <AddDoor position={[38]} open  /> */}
                            <AddDoor position={[59]}  />
                        </>
                    }
                    {AppContext.level.current == 2 &&
                        <>
                            <UpdateLevelConfig playerPosition={10} batteryToPlace={2}  />
                           
                            <SetMapDimension width={7} height={15}  />
                            <UpdateStroryScreen>
                                <div>Push the <span className="text-yellow-500">battery</span> on the receptor to open the door</div>
                            </UpdateStroryScreen>
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
                            <UpdateLevelConfig playerPosition={4} keyNumber={2} />
                            <SetMapDimension width={8} height={15}  />
                            
                            <AddItem position={[63,9]} name='key_item' />
                            <AddBarrier position={[47,46,70,71]} batteryNeeded={2}  />
                            <AddBarrier position={[61,53]} orientation='VERTICAL' batteryNeeded={2}  />
                            <AddBarrier position={[10,2]} orientation='VERTICAL' batteryNeeded={3}  />
                            <AddBarrier position={[17,16]} batteryNeeded={3}  />
                            {/* <AddWall position={[69,45,18]}  /> */}
                            <AddItem position={[69,45,18]} name='portal_item'  _type='red' />
                            <AddDynamicObject position={[38,82,54]} name='battery_item' _canMove={true} />
                            {/* <AddDynamicObject position={[31]}  name='bomb_item' _blastArea={1} _bombCounter={2} _canMove={true} skin='bomb_item_1' />
                            <AddDynamicObject position={[32,33,40,47,54]} _activable={false}  name='bomb_item' _blastArea={1} _bombCounter={3} _canMove={true} skin='bomb_item_2' /> */}
                            <AddDoor position={[107]} />
                        </>
                    }
                    {AppContext.level.current == 4 &&
                        <> 
                            <UpdateLevelConfig playerPosition={59} keyNumber={1}  />
                            <SetMapDimension width={18} height={20} addWallOnMap />
                            {/* <AddDynamicObject position={[156]} name='battery_item' _dObjectID='01' _canMove={true} />
                            <AddDynamicObject position={[223]} name='battery_item' _dObjectID='02' _canMove={true} /> */}
                            {/* <AddDynamicObject position={[125]} name='bomb_item' _canMove={true} /> */}
                            
                            <AddItem position={[20]} name='key_item' />
                            <AddBarrier position={[32]} orientation='VERTICAL'  batteryNeeded={1} />
                            <AddDynamicObject name='battery_item' position={[74]} />
                            <AddItem name='portal_item' position={[19,75]} />
                            <AddItem name='coin_item' skin='coin_item_2' position={[21,22,23,24,25,26,27,28,29,30,31]} />
                            <AddWall position={[37,38,56,92,110,128,146,164,182,200,218,236,254,234,272,290,308]} />
                            <AddWall position={[39,40,41,42,43,44,45,46,47,48,49,50]} />

                            {/* <AddItem position={[285]} name='portal_item' _portalID='01' _type='red' />
                            <AddItem position={[295]} name='portal_item' _portalID='02' _type='red' />
                            
                            <AddBarrier position={[170,210]} orientation='HORIZONTAL' />
                            <AddBarrier position={[189,191]} orientation='VERTICAL' />
                            <AddWall position={[169,171,209,211]} /> */}
                            <AddDoor position={[278]} />
                        </>
                    }
                    {AppContext.level.current == 5 &&
                        <>
                            <UpdateLevelConfig playerPosition={10} keyNumber={2}  />
                            <SetMapDimension width={7} height={15}  />
                            <UpdateStroryScreen>
                                <div>Destroy the <span className="text-yellow-500">crate</span> to get the key</div>
                            </UpdateStroryScreen>
                            <AddItem name="box_item" position={[33,75]} life={2}>
                                <AddChildItem name="key_item"   />
                            </AddItem>
                            <AddItem name='coin_item' position={[46,47,60,61]} skin='coin_item_2' />
                            <AddBarrier position={[38,39,40,41,69,68,67,66]}/>
                            <AddBarrier position={[45,52,59]} orientation='VERTICAL' />
                            <AddTestModel position={[53]} />
                            <AddDoor position={[94]} />

                        </>
                    }
                    {AppContext.level.current == 6 &&
                        <>
                            <SetMapDimension width={11} height={15} addWallOnMap  />
                            <UpdateLevelConfig playerPosition={16} keyNumber={1} />
                            <UpdateStroryScreen>
                                <div>Push and activate the <span className="text-red-500">bomb</span> to destroy the wall</div>
                            </UpdateStroryScreen>
                            <AddWall position={[89,90,91,92,93,94,95,96,97]} destructible />
                            <AddItem name='key_item' position={[38]} />
                            <AddDynamicObject position={[60]} name='bomb_item' _activable _blastArea={2} _bombCounter={4} />
                            <AddDoor position={[137]} />
                        </>
                    }
                    {/* {AppContext.level.current == 6 &&
                        <>
                            <SetMapDimension width={15} height={15}  />
                            <UpdateLevelConfig playerPosition={37} barrierBattery={2} keyNumber={1} />

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
                    } */}
                    {AppContext.level.current == 7 &&
                        <>
                            <SetMapDimension width={11} height={11}  />
                            <UpdateLevelConfig playerPosition={16} keyNumber={2} />
                            <UpdateStroryScreen>
                                <div>Use the <span className="text-yellow-500">gaz</span> to extand the explosion</div>
                            </UpdateStroryScreen>
                            <AddWall position={[65,64,63,74,85,86,87]} destructible />
                            <AddWall position={[77,78,79,,68,57,56,55]} destructible />
                            <AddItem position={[75,67]} name='key_item' />
                            <AddDynamicObject position={[42,12]} />
                            <AddDynamicObject position={[30]} _bombCounter={3} _blastArea={2} name = 'bomb_item'/>
                            <AddDynamicObject position={[73,69]} _activable={false}  name = 'bomb_item' skin='bomb_item_2'/>
                            <AddDoor position={[115]}  /> 
                            {/* <AddWall position={[145,100,94,139]} />
                            <AddBarrier position={[90,91,92,93,135,136,137,138]} batteryNeeded={1} orientation='HORIZONTAL' />
                            <AddBarrier position={[109,124]} batteryNeeded={1} orientation='VERTICAL' />

                            <AddBarrier position={[101,102,103,104,146,147,148,149]} batteryNeeded={2} orientation='HORIZONTAL' />
                            <AddBarrier position={[130,115]} batteryNeeded={2} orientation='VERTICAL' />

                            <AddDynamicObject position={[159,106]} name = 'battery_item' _dObjectID='01' />
                            <AddItem position={[72,62]} name='portal_item' _portalID='01' />
                            <AddItem name='key_item' position={[118]} />
                            <AddItem name='coin_item' position={[105,107,108,120,121,122,123,119,117,116,134,133,132,131]} skin='coin_item_2' />
                            <AddDoor position={[187]}  /> */}

                        </>
                    }
                    {AppContext.level.current == 8 &&
                        <>
                            <UpdateLevelConfig playerPosition={22} keyNumber={1}  />
                            <SetMapDimension width={15} height={14} addWallOnMap />
                            <AddWall position={[32,33,34,35,36,38,39,40,41,42,47,62,77,92,107,122,137,152,167]} destructible={false} />
                            <AddWall position={[57,72,87,102,117,132,147,162,177]} destructible={false} />
                            <AddWall position={[168,169,170,171,173,174,175,176]} destructible={false} />
                            <AddWall position={[159,144,129,114,155,97,140,125,110,111,113]} destructible />
                            <AddItem position={[112]} name='key_item' />
                            <AddDynamicObject skin='bomb_item_2' name='bomb_item' _activable={false} 
                            position={[16,17,18,19,20,21,23,24,25,26,27,28,31,46,61,76,91,106,121,136,
                                       151,166,181,182,183,184,185,186,187,172,188,189,190,191,192,193
                            ]} />
                            <AddDynamicObject skin='bomb_item_2' name='bomb_item' 
                            position={[43,58,73,88,103,118,133,148,163,178]} _activable={false} />
                            <AddDynamicObject skin='bomb_item_2' name='bomb_item' _activable={false} position={[127,157,158,156,143,141,128,126]} />
                            <AddDynamicObject name='bomb_item' position={[70]} _activable _bombCounter={3} />
                            <AddItem nam position={[64]} />
                            <AddDoor position={[142]} />
                        </>
                    }
                    {AppContext.level.current == 9 &&
                        <>
                            <UpdateLevelConfig playerPosition={22} mobToKill={2} fog />
                            <SetMapDimension width={15} height={15} addWallOnMap />

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