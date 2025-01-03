import { createContext, useContext, useEffect, useRef, useState } from "react"
import { appContext } from "../App"
import { Html } from "@react-three/drei"
import { mobContext } from "./mob_2"
import { gameAppContext } from "./GameApp"
import { AudioManage } from "./audioComponents"
import { CustomCounter } from "./utils"
import { speechTimeline, storyText } from "./gameStory"

let gameUIContext = createContext(null)
export function GameUI()
{
    const AppContext = useContext(appContext);
    const [actualUi,setActualUi] = useState('TITLE-SCREEN');
    let [enableTransitionScreen,setEnableTransitionScreen] = useState(true);
    let nextScreen = useRef('')
    // let args2Value = useRef(null);
    let gameUIController = (args)=>
        {
            if(AppContext.transitionBetweenScreen.current)
            {
                    if(args.arg1 == 'SWITCH-TO')
                    {
                        nextScreen.current=args.arg2
                        AppContext.BlackScreenTransitionController.current('SHOW-TRANSITION-SCREEN')
                        
                    }
            }
            else
            {
                if(args.arg1 == 'SWITCH-TO')
                {
                    if(args.arg2 == 'NO-SCREEN')
                    {
                   
                        setActualUi(c => c = null)
                    }
                    else
                    {   
                        
                        setActualUi(c => c = args.arg2)
                    }
                    
                }
            }
            
        }
    useEffect(()=>
        {
            AppContext.GameUIController.current = (args)=>
                {
                   
                    if(args.arg1 == 'DIRECT')
                    {
                        if(args.arg2 == 'NO-SCREEN')
                        {
                            setActualUi(c => c = null)
                        }
                        else
                        {   
                            
                            setActualUi(c => c = args.arg2)
                        }
                    }
                    else
                    {
                        gameUIController(args)
                    }
                }
        },[])
    return(
            <>
                <gameUIContext.Provider 
                value={{setEnableTransitionScreen,setActualUi,nextScreen}}
                >
                        {actualUi == 'TITLE-SCREEN' && <TitleScreen />}
                        
                        {actualUi == 'CREDIT-SCREEN' && <CreditScreen />}
                        {actualUi == 'PAUSE-SCREEN' && <PauseScreen />}
                        {actualUi == 'GAME_OVER-SCREEN' && <GameOverScreen />}
                        {actualUi == 'ENDING-SCREEN' && <GameEndingScreen />}
                        {actualUi == 'LOADING-SCREEN' && <GameLoadingScreen />}
                        {actualUi == 'STORY-SCREEN' && <StoryScreen />}
                        {actualUi == 'UPGRADE-SCREEN' && <UpgradePlayerScreen />}
                        {enableTransitionScreen && <BlackScreenTransition  />}
                </gameUIContext.Provider>
                 
            </>

            
    )
}
export function GameController()
{
    let _appContext = useContext(appContext);
    let [controllerVisible,setcontrollerVisible] = useState(_appContext.gameControllerVisible.current);
    let [actionIcon,setActionIcon] = useState('gameButton/attack.png');
    _appContext.gameControllerFunc.current = (args)=>
        {
            if(args == 'HIDE-SHOW')
            {
                _appContext.gameControllerVisible.current = _appContext.gameControllerVisible.current? false : true;
                setcontrollerVisible(_appContext.gameControllerVisible.current);
            }
            else if(args == 'SHOOT-ICON')
            {
                setActionIcon('gameButton/attack.png')
            }
            else if(args == 'INTERACT-ICON')
            {
                setActionIcon('gameButton/interact.png')
            }
            
        }
    return(
            <>
                {controllerVisible && 
                <div>
                        <div
                                className='w-[150px] h-[50px] 
                                flex justify-center  z-[2]
                                absolute bottom-[145px] left-[0] right-[0] mx-auto' 
                        >

                            <div id="UP"
                            onTouchStart={()=>{_appContext.touchEventMFunc.current.up()}}
                            onTouchEnd={()=>{_appContext.touchEventTouchEndFunc.current.up()}}
                            className='relative w-[50px] h-[50px]
                            ' 
                            >
                                <div
                                className={`rounded-[10px] select-none
                                            cursor-pointer opacity-50
                                            w-full h-full bg-gray-500 `}
                                >
                                    <svg width={50} height={50} fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m18 15-6-6-6 6" />
                                    </svg>
                                </div> 
                            </div>
                             
                            

                        </div>
                        
                        <div
                            
                            className='w-[200px] h-[50px] 
                                        flex justify-between z-[2]
                                        absolute bottom-[75px] left-[0] right-[0] mx-auto' 
                        >
                                <div id="LEFT"
                                onTouchStart={()=>{_appContext.touchEventMFunc.current.left()}}
                                onTouchEnd={()=>{_appContext.touchEventTouchEndFunc.current.left()}}
                                className='w-[50px] h-[50px] relative
                                ' 
                                >
                                    <div id="GLASS" className="absolute left-[0] top-[0] z-[2] w-full h-full"></div>
                                    
                                    <div
                                    
                                    className={`rounded-[10px] opacity-50 
                                                cursor-pointer select-none
                                                w-[50px] h-full bg-gray-500 `}
                                    >
                                        <svg width={50} height={50} fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m15 18-6-6 6-6" />
                                        </svg>
                                    </div> 
                                </div>
                                <div id="ACTION BUTTON"
                                onTouchStart={()=>{_appContext.touchEventMFunc.current.center()}}
                                onTouchEnd={()=>{_appContext.touchEventTouchEndFunc.current.center()}}
                                
                                className='w-[50px] h-[50px] relative
                                ' 
                                >
                                    <div id="GLASS" className="absolute left-[0] top-[0] z-[2] w-full h-full"></div>
                                    <div
                                    id='BUTTON CENTER'
                                    
                                    
                                    className={`rounded-lg select-none opacity-50
                                                cursor-pointer flex flex-col justify-center
                                                w-[50px] h-full bg-gray-500 `}
                                    >
                                    <svg className='mx-auto' width={40} height={40} fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <rect width={18} height={18} x={3} y={3} rx={2} ry={2} />
                                    </svg>
                                    </div>   
                                </div>
                                <div id="RIGHT"
                                onTouchStart={()=>{_appContext.touchEventMFunc.current.right()}}
                                onTouchEnd={()=>{_appContext.touchEventTouchEndFunc.current.right()}}
                                className='w-[50px] h-[50px] relative
                                ' 
                                >
                                    <div id="GLASS" className="absolute left-[0] top-[0] z-[2] w-full h-full"></div>
                                    <div
                                    
                                    className={`rounded-[10px] opacity-50
                                                cursor-pointer select-none
                                                w-[50px] h-full bg-gray-500 `}
                                    >
                                        <svg width={50} height={50} fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="m9 18 6-6-6-6" />
                                        </svg>
                                    </div> 
                                </div>
                        </div>
                        <div
                            
                            className='w-[150px] h-[50px] 
                                        flex justify-center z-[2]
                                        absolute bottom-[5px] left-[0] right-[0] mx-auto' 
                        >
                                
                                <div
                                onTouchStart={()=>{_appContext.touchEventMFunc.current.down()}}
                                onTouchEnd={()=>{_appContext.touchEventTouchEndFunc.current.down()}}
                                className={`rounded-lg opacity-50
                                            cursor-pointer select-none
                                            w-[50px] h-full bg-gray-500 `}
                                >
                                    <svg width={50} height={50} fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </div>    
                        </div>
                </div>
                }
              </>
              )
}
export function ScreenHalo()
{
    let _appContext = useContext(appContext);
    let [_animation,setAnimation] = useState('');

    useEffect(()=>
        {
            _appContext.ScreenHaloCOntroller.current = (args)=>
                {
                    if(args == 'GLOW-RED')
                    {
                        setAnimation('animate-screen-glowRed')
                    }
                    else if(args == 'GLOW-GREEN')
                    {
                        setAnimation('animate-screen-glowGreen')
                    }
                }
        },[])
    return(
            <>
                <div className="w-full h-full absolute left-0 top-0 z-[5] bg-transparent pointer-events-none ">

                        <div 
                        onAnimationEnd={()=>{setAnimation('')}} className={`shadow-[inset_0_0_0_0px_rgba(0,0,0,0.3)] ${_animation}
                                        w-full h-full absolute left-0 right-0 top-0 m-auto relative `}>
                                
                        </div>
                </div>
            </>
    )
}
export function ActionIcon()
{
    let _appContext = useContext(appContext);
    let [actionIconVisible,setActionIconVisible] = useState(_appContext.actionIconVisible.current);
    let [actionIcon,setActionIcon] = useState('');
    _appContext.actionIconController.current = (args)=>
        {
            if(args == 'HIDE-SHOW')
            {
                _appContext.actionIconVisible.current = _appContext.actionIconVisible.current? false : true;
                setActionIconVisible(_appContext.actionIconVisible.current);
            }
            else if(args == 'INTERACT')
            {
                setActionIcon('INTERACT')
            }
            else if(args == 'SHOOT')
            {
                setActionIcon('SHOOT')
            }
        }
    return(
        <>
            {actionIconVisible &&
                <div className=" border-[2px] border-gray-500 bg-black w-[30px] h-[30px] absolute z-[2] left-0 right-0 top-[10px] mx-auto ">
                    
                            {actionIcon == 'INTERACT' && <svg fill="none" stroke="#d2d1d1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3.75c-.405 0-.777.345-.75.75l.375 10.125a.375.375 0 1 0 .75 0L12.75 4.5c.028-.405-.344-.75-.75-.75Z" />
                            <path d="M12 20.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
                            </svg>}
                            {actionIcon == 'SHOOT' && <svg  fill="#d2d1d1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="m19.406 15.094-6.552-7.647a1.125 1.125 0 0 0-1.709 0l-6.552 7.647c-.625.73-.107 1.857.854 1.857h13.107c.96 0 1.479-1.128.852-1.857Z" />
                            </svg>}
                </div>

            }
        </>
    )
}

export function PauseIcon()
{
    let _appContext = useContext(appContext);


    return(
        <div
            onClick={()=>{_appContext.setPause(true);}}
            className=" cursor-pointer
                        w-[50px] h-[50px]
                        absolute  z-[2]
                        right-[20px] bottom-[20px]
                        bg-gray-500 rounded-[10px] p-[5px]
                        scale-10 select-none
                        transition-transform duration-[250ms]
                        hover:scale-90 "
        >
            <svg width={40} height={40} fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3.6 6a1.2 1.2 0 0 1 1.2-1.2h14.4a1.2 1.2 0 1 1 0 2.4H4.8A1.2 1.2 0 0 1 3.6 6Zm0 6a1.2 1.2 0 0 1 1.2-1.2h14.4a1.2 1.2 0 1 1 0 2.4H4.8A1.2 1.2 0 0 1 3.6 12Zm0 6a1.2 1.2 0 0 1 1.2-1.2h14.4a1.2 1.2 0 1 1 0 2.4H4.8A1.2 1.2 0 0 1 3.6 18Z" clipRule="evenodd" />
            </svg>
        </div>
    )
}

export function PauseScreen()
{
    let _appContext = useContext(appContext)
    let [pauseScreenActive,setPauseScreenActive] = useState(false)
    let pauseDisplay = useRef(<div
        className={`select-none w-full h-full top-[0] left-[0] absolute z-[3] bg-black/80 text-white`}
    >
        <div className="text-center text-[2rem] ">PAUSE</div>

        <div>
            <div className=" text-center text-[1.3rem] text-white mt-[35px] max-w-[350px] mx-auto ">
                Use Arrow Keys <span className="text-yellow-500"> ← → ↑ ↓ </span> to move press <span className="text-yellow-500">SPACE</span> bar to interact
            </div>
            <div className="flex justify-center mt-[10px] ">
                    <ButtonTemplate1 title={'RESUME'} btnfunction={()=>{_appContext.setPause(false)}} />
            </div>
            <div className="mt-[20px] flex justify-center ">
                    <ButtonTemplate1 title={'QUIT'} btnfunction={()=>{_appContext.quitGame('NO-RESTART') ;AudioManage.play('click');
                        // AudioManage.playAmbient('stop')
                    }} />
            </div>
           
            

        </div>
        <ToggleTouchScreen />
    </div>);
    useEffect(()=>
        {
            _appContext.PauseScreenController.current = ()=>
            {
                if(_appContext.gamePause.current)
                {
                    setPauseScreenActive(true)
                }
                else
                {
                    setPauseScreenActive(false)
                }
            }
        },[])
    return(
            <div
                
            >
               
                {pauseDisplay.current}
            </div>
    )
}

export function LifeBar()
{
    let _appContext = useContext(appContext)
    let lifeValue = ( _appContext.playerStats.current.life*100) /  _appContext.playerStats.current.maxLife;
    
    let lifeContainerRef = useRef(null);
    let updateLife = (_life)=>
        {
            lifeValue = (_life*100) /  _appContext.playerStats.current.maxLife;
            lifeContainerRef.current.style.width = lifeValue+'%'
        }
    _appContext.lifeBarFunc.current = updateLife;
    useEffect(()=>
        {
            
        },[])
    return <div
                className={`bg-red-500 w-[150px] h-[25px]
                            absolute left-[10px] top-[10px]
                            flex flex-col justify-center
                            `}
            >
                    <div
                        className={` w-[95%] h-[80%] mx-auto bg-black `}
                    >
                        <div
                            ref={lifeContainerRef}
                            style={{ width: `${lifeValue}%`, backgroundImage: `linear-gradient(
                                90deg,
                                hsl(0deg 93% 46%) 0%,
                                hsl(16deg 100% 44%) 11%,
                                hsl(25deg 100% 44%) 22%,
                                hsl(33deg 100% 42%) 33%,
                                hsl(42deg 100% 40%) 44%,
                                hsl(52deg 100% 37%) 56%,
                                hsl(65deg 100% 36%) 67%,
                                hsl(78deg 100% 40%) 78%,
                                hsl(92deg 100% 43%) 89%,
                                hsl(124deg 93% 49%) 100%
                                )` }}
                            className={" transition-[width] duration-[500ms] h-full "}
                        ></div>
                    </div>
            </div>
}
export function GameLoadingScreen() 
{
    
    let _appContext = useContext(appContext);
    
    useEffect(()=>
        {
            if(_appContext.transitionBetweenScreen.current)
            {
                _appContext.BlackScreenTransitionController.current('REMOVE-TRANSITION-SCREEN');
            }
            else
            {   
                window.setTimeout(()=>{_appContext.setGameVueActive(c => c = true);},1)
            }
        },[])
    return(
            <div
                ref={_appContext.GameLoadingScreenRef}
                className=" select-none absolute top-[0] left-[0] w-full h-full bg-black z-[9]"
            >
               <div
                    className="absolute right-[10px] bottom-[10px] text-white text-[2rem] "
               >
               Loading...
               </div>
            </div>
    )
}

export function MobLifeBar(props)
{
    let _mobContext = useContext(props._context)
    let mobLifeRef = useRef(null);
    let mobLifeContainerRef = useRef(null)
    let lifeValue = (props.Moblife*100) / props.maxMobLife;
    let [_position,setPosition] = useState([props.x,1,props.z])
    let lifeContainerRef = useRef(null);
    let updateMobLife = (_life)=>
        {
            
            lifeValue = (_life*100) / props.maxMobLife;
            mobLifeRef.current.style.width = lifeValue+'%';

        }
    _mobContext.lifeBarController.current = (args,params)=>
        {
            if(args == 'REMOVE')
            {
                mobLifeContainerRef.current.style.display='none'
            }
            else if(args == 'MOVE')
            {
                setPosition([params.x,1,params.z])
            }
            else if(args == 'UPDATE-MOB-LIFE')
            {
                updateMobLife();
            }
        }
    // _mobContext.lifeBarFunc.current = updateMobLife;
    return(
        <Html
        ref={lifeContainerRef}
        name="Mob Life"
        visible={true}
        position={_position}
        transform={true}
        zIndexRange={[0,0]}
        sprite={true}

        style={{color:"white", fontSize:'1.5rem',
                
                userSelect:'none',WebkitUserSelect:'none',msUserSelect:'none',MozUserSelect:'none'
         }}
    >
        <div
            ref={mobLifeContainerRef}
            style={{position:'relative'}}
        >
                <div
                className={`bg-red-500 w-[40px] h-[3px]
                            
                            flex flex-col justify-center
                            `}
            >
                    <div
                        className={` w-[95%] h-[80%] mx-auto bg-black `}
                    >
                        <div
                            ref={mobLifeRef}
                            style={{ width: `${100}%` }}
                            className={" transition-[width] duration-[500ms] h-full bg-red-500 "}
                        ></div>
                    </div>
            </div>
        </div>
    </Html>

    )
}

export function GameNotif()
{
    let _appContext = useContext(appContext);
    let [showNotif,setShowNotif] = useState(false)
    let showNotifRef = useRef(false)
    let notifFirstShow = useRef(false)
    let notifMsg = useRef(false)
    let msgType = useRef('system');
    let msgColor = useRef('#274e4b');

   let NotifElem = (props)=>
        {
            let [notifShow,setnotifShow] = useState('block');
            let [opacity,setOpacity] = useState('opacity-100');
            
            let msgCounter = useRef(0);
            let notifRef = useRef(null)

            let customCounter = ()=>
                {
                    
                    msgCounter.current ++;
                    if(msgCounter.current <200)
                    {
                       
                        window.requestAnimationFrame(customCounter);
                    }
                    else
                    {   setOpacity('opacity-0')
                        
                    }
                }

            useEffect(()=>
                {   
                        customCounter()
                    
                },[])
            return(
                <div 
                ref={notifRef}
                style={{backgroundColor:msgColor.current}}
                className={`select-none p-[10px] ${notifShow} transition-[opacity] duration-[5000ms] ${opacity} text-white text-[1rem] w-full
                            border-[2px] border-black   
                             `}
                >
                    {props.message}
                </div>
            )
        }

    _appContext.gameNotifFunc.current = (msg,_msgType)=>
        { 
            notifMsg.current = msg
            msgType.current = _msgType
            if(msgType.current == 'system'){msgColor.current = '#274e4b';}
            else if(msgType.current == 'player'){msgColor.current = '#3b1a22';}
            
            if(showNotifRef.current)
            {   
                showNotifRef.current = false
                setShowNotif(c => c = false)
            } 
            else
            {   
                notifFirstShow.current = true;
                showNotifRef.current = true
                setShowNotif(c => c = true)
            }
            
        }
    useEffect(()=>
        {
            if(notifFirstShow.current)
            {
                if(!showNotif){showNotifRef.current = true;setShowNotif(c => c = true) }
                
            }
        },[showNotif])
    return <div
                className={` absolute z-[8] left-[0] right-[0] mx-auto top-[60px] w-[200px] `}
            >
                    {showNotif && <NotifElem message={notifMsg.current} />}
           </div>
}

export function TitleScreen()
{
    const AppContext = useContext(appContext);
    let [scoreValue,setScoreValue] = useState(AppContext.playerStats.current.score);
    let [coinValue,setCoinValue] = useState(AppContext.playerStats.current.coinCollected);
    let switchVolume = ()=>
        { 
            AudioManage.play('click')
            AppContext.soundOn.current = AppContext.soundOn.current? false : true;
            AudioManage.soundONOFF(AppContext.soundOn.current? 'ON_MENU' : 'OFF_MENU');
           
        }
    let startGame = ()=>
        {
            AppContext.appController('START-GAME')
        }
    let deleteSave = ()=>
        {
            AudioManage.play('click')
            AppContext.deleteGameSave();
            setScoreValue(AppContext.playerStats.current.score)
            setCoinValue(AppContext.playerStats.current.coinCollected)
        }
    let toggleTouchController = ()=>
        {
            AppContext.gameControllerVisible.current = AppContext.gameControllerVisible.current? false : true;
            AppContext.actionIconVisible.current = AppContext.actionIconVisible.current? false : true;
        }
    return <div 
                
                className={`absolute left-[0] top-[0] z-[2] w-full h-full select-none bg-black `}
            >
                    
                    <div className="relative mt-[10px] text-center text-[2rem] text-white ">
                        EXCAVATION
                    </div>
                    
                     <div className=" text-center text-white  ">
                        <span className="text-[0.8rem] mr-[5px] ">
                            Score :
                        </span>
                        <span className="text-[1.2rem]">{scoreValue}</span>
                     </div>
                     
                     <div className=" flex justify-center text-white ">
                        <div className="text-[0.8rem] mr-[5px] flex flex-col justify-center ">
                            <img src="money2icon.png" alt="coin" className=" w-[25px] h-[25px]  " />
                        </div>
                        <span className="text-[1.2rem]">{coinValue}</span>
                     </div>
                     <div className="mt-[20px] ">


                            <div className="w-full flex justify-center">
                            
                                <ButtonTemplate1 title={'START'} btnfunction={startGame} />
                                <ToggleButtonTemplate1 title={'SOUND'} btnfunction={switchVolume} 
                                toggleValue={AppContext.soundOn.current} 
                                    />

                            </div>
                            
                            <div className="w-full mt-[20px] flex justify-center">
                                    
                                    <ToggleButtonTemplate1 title={'CONTROLLER'} btnfunction={toggleTouchController}
                                        toggleValue={AppContext.gameControllerVisible.current} 
                                    />
                                    <ButtonTemplate1 title={'DELETE SAVE'} btnfunction={deleteSave} />
                                
                            </div>
                                
                            
                            
                    </div>
                    
           </div>
}
export function BulletReloadIcon()
{
    const AppContext = useContext(appContext);
    let [reload,setReload] = useState('grayscale-0')
    useEffect(()=>
        {   
            AppContext.BulletReloadIconController.current = (args)=>
            {
                if(args == 'RELOAD-START')
                {   
                    setReload('grayscale');
                }
                else if(args == 'RELOAD-END')
                {
                    setReload('grayscale-0');
                }
            }
        },[])
    return(
            <div className="w-[50px] h-[50px] absolute left-0 right-0 mx-auto top-[30px] z-[2] ">
                <div className="w-full h-full absolute z-[2] left-0 top-0 "></div>
                <img className={`w-full h-full ${reload} `} src="bullet_reload.png" />
            </div>
            
    )
}
export function BlackScreenTransition(props)
{
    let _gameUiContext = useContext(gameUIContext)
    let _appContext = useContext(appContext);
    let animationStep = useRef('none')
    let transitionScreenRef = useRef(null);
    let [screenColor,setScreenColor] = useState('bg-transparent')
    useEffect(()=>
        {
            
            _appContext.BlackScreenTransitionController.current = (args)=>
            {   
                if(args == 'SHOW-TRANSITION-SCREEN')
                {   
                    if(_gameUiContext.nextScreen.current == 'GAME_OVER-SCREEN')
                    {
                        transitionScreenRef.current.style.transitionDuration = '1s';
                        setScreenColor('bg-red-500')
                    }
                    else
                    {
                        transitionScreenRef.current.style.transitionDuration = '0.5s';
                        setScreenColor('bg-black')
                    }
                   
                }
                else if(args == 'REMOVE-TRANSITION-SCREEN')
                {
                    setScreenColor('bg-transparent')
                }
            }
            
            
        },[])
    return(
            <>
                <div id="BLACK-SCREEN"
                ref={transitionScreenRef}
                style={{transition:'background-color 0.5s'}} 
                onTransitionEnd={()=>
                    {  
                  
                        if(animationStep.current == 'none')
                        {
                            animationStep.current = 'first-step';
                            _gameUiContext.setActualUi(_gameUiContext.nextScreen.current);
                            _appContext.setGameVueActive(c => c = false);
                            if(_gameUiContext.nextScreen.current == 'LOADING-SCREEN')
                            {
                                // _appContext.setGameVueActive(c => c = false);
                            }
                            else
                            {
                                transitionScreenRef.current.style.transitionDuration = '0.5s';
                                setScreenColor('bg-transparent')
                            }
                            
                            
                        }
                        else if(animationStep.current == 'first-step')
                        {
                            animationStep.current = 'none';
                            if(_gameUiContext.nextScreen.current == 'LOADING-SCREEN')
                            {
                                _appContext.setGameVueActive(true);
                            }
                            else
                            {
                                _appContext.setGameVueActive(false);
                            }
                            
                            
                        }

                        
                       
                    }}
                className={`pointer-events-none w-full h-full absolute top-0 left-0 z-[10] ${screenColor} `}></div>
            </>
    )
}


export function PlayerMoney()
{
    let _appContext = useContext(appContext);
    return(
        <div
        
        className='  z-[2]
                    flex
                    absolute top-[50px] left-[10px] text-white text-[2rem] ' 
        >
            <div
                className="w-[30px] h-[30px] relative "
            >   
                <div id="GLASS" className="absolute left-[0] top-[0] w-full h-full z-[2] "></div>
                <img className="w-full h-full " src="money2icon.png" alt="Money_Icon" />
            </div>
            
            <div className="text-[1.4rem] text-white/50 flex flex-col justify-center mx-[5px] ">x</div>
            <div ref={_appContext.playerMoneyContainerRef} className="text-[1.5rem]  flex flex-col justify-center "></div>
        </div>
    )
}

export function CreditScreen()
{
    let _appContext = useContext(appContext);

    return( <div
                style={{backgroundImage:`url("gameBack.jpg")`}}
                className={`text-white absolute select-none left-[0] top-[0] z-[2] w-full h-full bg-black`}
                >
                    <div className="text-center my-[20px] text-[2rem] ">A propos</div>
                    <div className="text-center ">
                        <div>
                            <span className={`font-bold tracking-[1.5px] `} >DAHOMEY LEGACY</span> <span>partie 1</span>
                        </div>
                        <div className="text-center text-[0.9rem] text-white ">Bêta</div>
                        <div>
                            Développé par Abdel Bio
                        </div>
                        <div>
                            N'hésitez pas à nous laisser un message <br /> +229 90 39 73 97
                        </div>
                    </div>
                    <div   onClick={()=>{_appContext.GameUIController.current({arg1:'SWITCH-TO',arg2:'TITLE-SCREEN'})}} 
                        className=" relative flex justify-center flex-col text-center mt-[35px] cursor-pointer w-[200px] h-[50px] mx-auto ">
                        <div id="GLASS" className="absolute left-[0] top-[0] w-full h-full z-[2] "></div>
                        <img className="w-full mx-auto " src="menuButton.jpg" alt="retour" />
                    </div>
            </div>
    )
}

export function GameOverScreen()
{
    let _appContext = useContext(appContext);

    return( <>
                            <div
                                style={{backgroundImage:`url("gameBack.jpg")`}}
                                className={`text-white absolute select-none left-[0] top-[0] z-[5] w-full h-full bg-black`}
                                >
                                    <div className="text-center my-[20px] ">GAME OVER</div>
                                    <div className="text-center ">
                                        <div>
                                            You get knocked out
                                        </div>
                                        
                                    </div>
                                    <div   onClick={()=>{_appContext.quitGame('RESTART-GAME-OVER') }} 
                                        className=" relative flex justify-center flex-col text-center mt-[35px] cursor-pointer w-[200px] h-[50px] mx-auto ">
                                        <div id="GLASS" className="absolute left-[0] top-[0] w-full h-full z-[2] "></div>
                                        <img className="w-full mx-auto " src="menuButton.jpg" alt="Quit" />
                                        
                                    </div>
                            </div>
            
            </>
    )
}
export function GameEndingScreen()
{
    let _appContext = useContext(appContext);

    let mainMenu = ()=>
        {
            _appContext.quitGame('RESTART-GAME-FINISHED')
        }
    return( <>
                <div
                style={{backgroundImage:`url("gameBack.jpg")`}}
                className={`text-white absolute select-none left-[0] top-[0] z-[5] w-full h-full bg-black`}
                >
                        <div className="text-center my-[20px] ">Thanks for playeing 3D Dungeon FPS</div>
                        <div className="text-center ">
                            <div>
                                An update is coming soon !
                            </div>
                            
                        </div>
                        <div   onClick={mainMenu} 
                            className=" relative flex justify-center flex-col text-center mt-[35px] cursor-pointer w-[200px] h-[50px] mx-auto ">
                            <div id="GLASS" className="absolute left-[0] top-[0] w-full h-full z-[2] "></div>
                            <img className="w-full mx-auto " src="menuButton.jpg" alt="Quit" />
                        </div>
                </div>
            
            </>
    )
}

export function ToggleTouchScreen()
{
    let _appContext = useContext(appContext);

    let toggleTouch = ()=>
        {
            _appContext.gameControllerFunc.current('HIDE-SHOW');
            _appContext.actionIconController.current('HIDE-SHOW')
        }
    return(
        <>
            <div
                onClick={toggleTouch}
                className="cursor-pointer absolute right-[5px] bottom-[5px] z-[2] w-[40px] h-[40px] border-[2px] border-red-500 "
            >
            <svg fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.283 13.091C5.428 13.678 5 14.648 5 16.002c0 2.03 2.488 5.5 4.73 5.5h5.74c2.196 0 3.53-1.926 3.53-3.47v-6.526a1.5 1.5 0 0 0-1.5-1.5h-.005c-.826 0-1.495.67-1.495 1.495" />
            <path d="M6.99 14.222V4.002a1.5 1.5 0 0 1 1.5-1.498h.004c.83.002 1.502.676 1.502 1.507v7.785" />
            <path d="M9.996 11.504V9.508a1.508 1.508 0 0 1 3.016 0v1.996" />
            <path d="M13 11.358v-1.356a1.5 1.5 0 1 1 3 0v1.5" />
            </svg>
            </div>
        </>
    )
}
export function StoryScreen()
{

    let _appContext = useContext(appContext)
    let [storyScreenActive,setStoryScreenActive] = useState(false);
    let speech = useRef(storyText.value);
    let speechTotalPart = useRef(speech.current.length);
    let speechPartCounter = useRef(1)
    let [speechPartToShow,setSpeechPartToShow] = useState(speech.current[0]) 
    let customCounter = null;
    let removeStoryScreen = ()=>
        {
            
            _appContext.gamePause.current = false;
            _appContext.GameUIController.current({arg1:'DIRECT',arg2:'NO-SCREEN'})

        }
    let nextPart = ()=>
        {   
            speechPartCounter.current ++;
           
            setSpeechPartToShow(speech.current[speechPartCounter.current-1]);
        }
    let keyBoardManageStory = ()=>
        {   
            if(speechPartCounter.current == speechTotalPart.current)
            {
               
                _appContext.gamePause.current = false;
                _appContext.GameUIController.current({arg1:'DIRECT',arg2:'NO-SCREEN'})
               
            }
            else
            {
                nextPart();
            }
        }

        
    useEffect(()=>
        {
            if(speech.current[0] != 'none')
            {   
                _appContext.gamePause.current = true;

               
                speechTotalPart.current = speech.current.length;
                speechPartCounter.current = 1;
                setSpeechPartToShow(speech.current[speechPartCounter.current-1]);
                customCounter = new CustomCounter(35,0,()=>
                {
                    _appContext.actualGameScreen.current = 'STORY-SCREEN'
                    setStoryScreenActive(c => c = true);
                },null);
                customCounter.start();
            }
            else
            {
            
                _appContext.GameUIController.current({arg1:'DIRECT',arg2:'NO-SCREEN'})
            }
        },[])
    useEffect(()=>
        {
            
            _appContext.KeyBoardManageStory.current = keyBoardManageStory;
            _appContext.StoryScreenController.current = (state)=>
            {
                
                if(state == 'show')
                {
                    _appContext.gamePause.current = true;
                    customCounter = new CustomCounter(35,0,()=>
                        {
                            _appContext.actualGameScreen.current = 'STORY-SCREEN'
                            setStoryScreenActive(c => c = true);
                            return true;
                        },null);
                    customCounter.start();
                    
                    
                }
                else if(state=='update')
                {
                    speech.current = speech.current[_appContext.gameState.current.level-1];
                    speechTotalPart.current = speech.current.length;
                    speechPartCounter.current = 1;
                    setSpeechPartToShow(speech.current[speechPartCounter.current-1]);
                }
                else if(state == 'remove')
                {   
                    _appContext.GameUIController.current({arg1:'DIRECT',arg2:'NO-SCREEN'})
                    // setStoryScreenActive(c => c = false);
                }
                
                
            }

            // return ()=>{ customCounter.cancelCounter()}
        },[])
        
    return(
            <div
                id="STORY-SCREEN"
            >
                {storyScreenActive && <div
                                        className={`select-none w-full h-full top-[0] left-[0] absolute z-[5] bg-black/80 text-white`}
                                    >
                                        <div>
                                            <div className=" text-center text-[1.3rem] text-white mt-[35px] max-w-[350px] mx-auto ">
                                                    {speechPartToShow}
                                            </div>
                                        
                                            {speechPartCounter.current < speechTotalPart.current && 
                                                <div onClick={nextPart} //NEXT STORY
                                                className=" relative tracking-[3px] flex justify-center flex-col text-center mt-[35px] cursor-pointer w-[200px] h-[25px] mx-auto text-white ">
                                                    <div id="GLASS" className="absolute left-[0] top-[0] w-full h-full z-[2] "></div>
                                                    <img className="w-full mx-auto " src="nextButton.jpg" alt="continue" />
                                                </div>
                                            }
                                            {speechPartCounter.current == speechTotalPart.current && 
                                                <div onClick={removeStoryScreen} //CLOSE STORY BUTTON
                                                className=" relative tracking-[3px] flex justify-center flex-col text-center mt-[35px] cursor-pointer w-[200px] h-[25px] mx-auto text-white ">
                                                    <div id="GLASS" className="absolute left-[0] top-[0] w-full h-full z-[2] "></div>
                                                    <img className="w-full mx-auto " src="nextButton.jpg" alt="continue" />
                                                </div>
                                            }
                                            
                                        </div>
                                    </div>}
            </div>
    )
}
export function GameTimer()
{

    let _appContext = useContext(appContext)
    let minuteRef = useRef(_appContext.levelInfo.current.timerMinute)
    let seconRef = useRef(_appContext.levelInfo.current.timerSecond)
    let timercustomCounterRef = useRef(null)
    let [timerVisible,setTimerVisible] = useState(false)
    let [mintute,setMinute] = useState(minuteRef.current);
    let [second,setSecon] = useState(seconRef.current);


    let timerFunc = ()=>
        {
            if(seconRef.current == 0)
            {
                if(minuteRef.current>0)
                {
                    minuteRef.current --;
                    seconRef.current = 59;
                    setSecon(seconRef.current);
                    setMinute(minuteRef.current);
                    return false;
                }
                else
                {
                    // console.log('timer finit')
                    return true;
                }
            }
            else
            {
                seconRef.current --;
                setSecon(seconRef.current);
                return false;
            }
            
        }
    useEffect(()=>
        {
            if(minuteRef.current == 0 && seconRef.current == 0){}
            else
            {
                setTimerVisible(true)
            }
            
            if(timerVisible)
            {
                timercustomCounterRef.current = new CustomCounter(70,0,timerFunc,null)
                timercustomCounterRef.current.start()
            }
           
            return()=>{timercustomCounterRef.current?.cancelCounter()}
        },[timerVisible])

    return(
            <>
                {
                    timerVisible &&
                    <div className=" pointer-events-none text-[1.5rem] text-white text-center bg-transparent absolute z-[2] left-0 right-0 mx-auto top-[5px] ">
                            <span>{mintute}</span>
                            <span className="mx-[3px] ">:</span>
                            <span>{second}</span>
                    </div>
                }
                
                        
                
            </>
    )
}
export function ScoreVue()
{
    let _appContext = useContext(appContext);
    let [score,setScore] = useState(_appContext.playerStats.current.score);
    useEffect(()=>
        {
            _appContext.ScoreVueController.current = (args1,args2)=>
                {
                    if(args1 == 'INCREASE')
                    {  
                        _appContext.playerStats.current.score += args2;
                        // console.log( _appContext.playerStats.current.score)
                        setScore(_appContext.playerStats.current.score)
                    }
                }
        },[])
    return(
            <>
                <div className="absolute w-full flex justify-end top-[5px] z-[2] text-white text-[1.5rem] ">
                <span className="mr-[20px] ">{score}</span>
                </div>
            </>
    );
}

export function UpgradePlayerScreen()
{
    let _appContext = useContext(appContext);
    return(
            <>
                <div
                    style={{backgroundImage:`url("gameBack.jpg")`}}
                    className={`absolute select-none left-[0] top-[0] z-[2] w-full h-full bg-black `} 
                >
                        <div className="text-center text-[1.5rem] text-white">Upgrade State</div>
                        <div className="w-full mt-[10px] flex justify-center">
                            <div className="cursor-pointer relative mx-[10px] w-[90px] h-[130px] ">
                                <div onClick={()=>{_appContext.GameUIController.current({arg1:'SWITCH-TO',arg2:'TITLE-SCREEN'})}}  id="GLASS" className="w-full h-full absolute z-[3] left-0 top-0"></div>
                                <div className="w-full absolute z-[2] top-[5px] text-center text-white ">
                                    <span className="text-[0.7rem] ">Lvl:</span>
                                    <span className="text-[1.2rem] ">1</span>
                                </div>
                                <img src="sword.svg" alt="Return Button" className="absolute z-[2] block w-[40px] h-[40px] m-auto right-0 left-0 top-0 bottom-0" />
                                <div className="w-full absolute z-[2] bottom-[5px] text-center text-white ">
                                    500
                                </div>
                                <img src="btnTemplate.png" alt="Play Button back" className="block w-full h-full " />
                            </div>
                            <div className="cursor-pointer relative mx-[10px] w-[90px] h-[130px] ">
                                <div onClick={()=>{_appContext.GameUIController.current({arg1:'SWITCH-TO',arg2:'TITLE-SCREEN'})}}  id="GLASS" className="w-full h-full absolute z-[3] left-0 top-0"></div>
                                <div className="w-full absolute z-[2] top-[5px] text-center text-white ">
                                    <span className="text-[0.7rem] ">Lvl:</span>
                                    <span className="text-[1.2rem] ">1</span>
                                </div>
                                <img src="heart.svg" alt="Return Button" className="absolute z-[2] block w-[40px] h-[40px] m-auto right-0 left-0 top-0 bottom-0" />
                                <div className="w-full absolute z-[2] bottom-[5px] text-center text-white ">
                                    500
                                </div>
                                <img src="btnTemplate.png" alt="Play Button back" className="block w-full h-full " />
                            </div>
                        </div>
                        <div className="w-full mt-[10px] flex justify-center">
                            <div className="cursor-pointer relative mx-[10px] w-[80px] h-[80px] ">
                                <div onClick={()=>{_appContext.GameUIController.current({arg1:'SWITCH-TO',arg2:'TITLE-SCREEN'})}}  id="GLASS" className="w-full h-full absolute z-[3] left-0 top-0"></div>
                                <img src="return.svg" alt="Return Button" className="absolute z-[2] w-[60px] m-auto right-0 left-0 top-0 bottom-0" />
                                <img src="btnTemplate.png" alt="Play Button back" className="block " />
                            </div>
                        </div>
                </div>
            </>
    )
}

export function LevelUi(props)
{
    let _appContext = useContext(appContext)
    let [_visible,setVisible] = useState(true);
    return(
            <>
                {_visible &&
                    <div className="text-white text-[1.5rem] absolute z-[2] right-[20px] top-[40px] ">
                    Level : {_appContext.gameState.current.level}
                    </div>
                }
            </>  
    )
}

function ButtonTemplate1(props)
{
    let [btnClicked,setBtnClicked] = useState(false);
    let btnCallBack = ()=>
        {
            props.btnfunction();
            
        }
    return(
        <button 
        onClick={btnCallBack}
        className={`text-[0.9rem] border-[2px] border-blue-500 
                    bg-gray-500
                    transition-transform duration-[250ms]
                    hover:scale-[1.1] w-[120px] tracking-wider 
                    text-white py-[10px] rounded-lg mr-[20px] `}
        >{props.title}
        </button>
    )
}
function ToggleButtonTemplate1(props)
{
    let [btnClicked,setBtnClicked] = useState(props.toggleValue);
    let btnCallBack = ()=>
        {   
            props.btnfunction();
            setBtnClicked(!btnClicked)
        }
    return(

            <button 
            onClick={btnCallBack}
            className={`text-[0.9rem] border-[2px] border-blue-500 
                        ${!btnClicked? 'bg-gray-900':'bg-gray-500'}
                        
                        transition-transform duration-[250ms]
                        hover:scale-[1.1] w-[120px] tracking-wider 
                        ${!btnClicked? 'text-white/30':'text-white'} py-[10px] rounded-lg mr-[20px] `}
            >{props.title}
            </button>
    )
}