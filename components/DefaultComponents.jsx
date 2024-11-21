import React, { useContext, useEffect, useRef } from "react";
import { appContext } from "../src/App";
import { createLevel, createObject } from "./gameMap";
import { storyText } from "./gameStory";




/**
 * 
 * @param {{mapTexture:string,mobToKill:number,keyNumber:number,finalLevel:boolean,playerPosition:number,fog:boolean}} param0 
 * @returns 
 */
export function UpdateLevelConfig({mapTexture,mobToKill,keyNumber,finalLevel,playerPosition,fog})
{
  const AppCntext = useContext(appContext);

  AppCntext.levelInfo.current._MobToKillNumber = mobToKill? mobToKill : 0;
  AppCntext.levelInfo.current._KeyNumber = keyNumber? keyNumber : 0;
  AppCntext.levelInfo.current.finalLevel = finalLevel? finalLevel : false;
  AppCntext.levelInfo.current.mapTexture = mapTexture? mapTexture : 'ntxt4.jpg';
  if(fog)
  {
    AppCntext.levelInfo.current.fogNear = 3
    AppCntext.levelInfo.current.fogFar = 20
  }
  else
  {
    AppCntext.levelInfo.current.fogNear = 0.1
    AppCntext.levelInfo.current.fogFar = 0
  }
  AppCntext.playerPosition.current = playerPosition?playerPosition : 0;
  
  return null
}
/**
 * 
 * @param {{moveSpeed:number,life:number,maxLife:number,shootInterval:number,shootPower:number,coinCollected:number,bulletModel:JSX.Element}} param0 
 * @returns 
 */
export function UpdatePlayerStat({moveSpeed,life,maxLife,shootInterval,shootPower,coinCollected,bulletModel})
{ //creer une propriété pour ajouter les onfiguration par défaut et elles s'appliqueron au reste des niveau
  const AppCntext = useContext(appContext);
  if(moveSpeed == 0.05 || moveSpeed == 0.1 || moveSpeed == 0.2)
  {
    AppCntext.playerStats.current.moveSpeed = moveSpeed;
  }
  else
  {
    AppCntext.playerStats.current.moveSpeed = 0.1;
  }

  AppCntext.playerStats.current.bulletModel = bulletModel? bulletModel : 'default';
  AppCntext.playerStats.current.life = life? life : 5;
  AppCntext.playerStats.current.maxLife = maxLife? maxLife : 5;
  AppCntext.playerStats.current.shootInterval = shootInterval? shootInterval : 50;
  AppCntext.playerStats.current.shootPower = shootPower? shootPower : 1;
  AppCntext.playerStats.current.coinCollected = coinCollected? coinCollected : 0;
  return null
}

/**
 * 
 * @param {{position:number[],name:string,value:number|null,important:boolean,life:number,customModel:JSX.Element,skin:string}} param0 
 * @returns 
 */
export function AddItem({position,name,value,important,life,children,customModel,skin})
{
  const AppCntext = useContext(appContext);
  let hasChildObject = false;
  let childObjectSkin = '';
  let childObjectValue = 1;
  let childCustomModel = 'none';
  let childObjectIsImportant = false;
  let objectDetailArr = []

  for(let i = 0;i<position.length;i++)
  {
    if(name == 'heal_item')
    {
      objectDetailArr[i] = {position:position[i],objectName:'heal_item',skin:skin?skin:'heal_item_1',value:value?value:2,isImportant:important?important:false,
                              customModel:customModel?customModel:'none'
                            }
    }
    else if(name == 'coin_item')
    {
      objectDetailArr[i] = {position:position[i],objectName:name,skin:skin?skin:'coin_item_1',value:value?value:1,isImportant:important?important:false,customModel:customModel?customModel:'none'}
    }
    else if(name == 'box_item')
    {
      

        if(children)
        {
          
          if(children.length)
          {
            if(children[0].props.name)
            {
              hasChildObject = children[0].props.name;
              childObjectValue = children[0].props.value? children[0].props.value : 1; 
              childCustomModel=children[0].props.childCustomModel?children[0].props.childCustomModel:'none';
      
              if(hasChildObject == 'heal_item'){childObjectSkin = skin?skin:'heal_item_1';childObjectIsImportant = children[0].props.important? children[0].props.important : false; }
              if(hasChildObject == 'coin_item'){childObjectSkin = skin?skin:'coin_item_1';childObjectIsImportant = children[0].props.important? children[0].props.important : false;}
              if(hasChildObject == 'upgrade_life_item'){childObjectSkin =  skin?skin:'upgrade_life_item';childObjectIsImportant = children[0].props.important? children[0].props.important : false;}
              if(hasChildObject == 'upgrade_shoot_power_item'){childObjectSkin =  skin?skin:'upgrade_shoot_power_item';childObjectIsImportant = children[0].props.important? children[0].props.important : false;}
              if(hasChildObject == 'upgrade_shoot_speed_item'){childObjectSkin =  skin?skin:'upgrade_shoot_speed_item';childObjectIsImportant = children[0].props.important? children[0].props.important : false;}
              if(hasChildObject == 'key_item'){childObjectSkin = skin?skin:'key_1';childObjectIsImportant = true;}
            }
            else
            {
              
            }
            
          }
          else
          {
              if(children.props.name)
              {
                hasChildObject = children.props.name;
                childObjectValue = children.props.value? children.props.value : 1; 
                childCustomModel=children.props.childCustomModel?children.props.childCustomModel:'none'
      
                if(hasChildObject == 'heal_item'){childObjectSkin = skin?skin:'heal_item_1';childObjectIsImportant = children.props.important? children.props.important : false;}
                if(hasChildObject == 'coin_item'){childObjectSkin = skin?skin:'coin_item_1';childObjectIsImportant = children.props.important? children.props.important : false;}
                if(hasChildObject == 'upgrade_life_item'){childObjectSkin =  skin?skin:'upgrade_life_item';childObjectIsImportant = children.props.important? children.props.important : false;}
                if(hasChildObject == 'upgrade_shoot_power_item'){childObjectSkin =  skin?skin:'upgrade_shoot_power_item';childObjectIsImportant = children.props.important? children.props.important : false;}
                if(hasChildObject == 'upgrade_shoot_speed_item'){childObjectSkin =  skin?skin:'upgrade_shoot_speed_item';childObjectIsImportant = children.props.important? children.props.important : false;}
                if(hasChildObject == 'key_item'){childObjectSkin = skin?skin:'key_1';childObjectIsImportant = true}
              }
              else
              {
                
              }
            
          }
        }
        else
        {
          hasChildObject = false;
        }
        
        objectDetailArr[i] = {position:position[i],objectName:name,skin:skin?skin:'box_1',life:life?life:1,isImportant:false,
                              hasChildObject,childObjectSkin,childObjectValue,childObjectIsImportant,customModel:customModel?customModel:'none',childCustomModel
        }
    }
    else if(name == 'key_item')
    {
      objectDetailArr[i] = {position:position[i],objectName:name,skin:skin?skin:'key_1',value:value?value:0,customModel:customModel?customModel:'none',isImportant:true}
    }
    else if(name == 'upgrade_shoot_power_item')
    {
      objectDetailArr[i] = {position:position[i],objectName:name,value:0,skin:skin?skin:'upgrade_shoot_power_item',customModel:customModel?customModel:'none',isImportant:false}
    }
    else if(name == 'upgrade_shoot_speed_item')
    {
      objectDetailArr[i] = {position:position[i],objectName:name,value:0,skin:skin?skin:'upgrade_shoot_speed_item',customModel:customModel?customModel:'none',isImportant:false}
    }
    else if(name == 'upgrade_life_item')
    {
      objectDetailArr[i] = {position:position[i],objectName:name,value:0,skin:skin?skin:'upgrade_life_item',customModel:customModel?customModel:'none',isImportant:false}
    }
  }
  for(let i =0;i<(AppCntext.mapWidth.current*AppCntext.mapHeight.current);i++)
  {   
      createObject(AppCntext.gameMap.current,'item',objectDetailArr,i);
      
  }
  return null
}
// export function AddWeapon(props)
// {
//   const AppCntext = useContext(appContext);
//   let objectDetailArr = []

//   for(let i = 0;i<props.position.length;i++)
//   {

//       objectDetailArr[i] = {position:props.position[i],objectName:'weapon_item',skin:props.name,isImportant:true}
    
   
//   }
//   for(let i =0;i<(AppCntext.mapWidth.current*AppCntext.mapHeight.current);i++)
//   {   
//       createObject(AppCntext.gameMap.current,'item',objectDetailArr,i);
      
//   }
//   return null
// }
/**
 * 
 * @param {{position:number,skin:string,customModel:JSX.Element}} param0 
 * @returns 
 */
export function AddDecor({position,skin,customModel})
{
  const AppCntext = useContext(appContext);
  let objectDetailArr = []

  for(let i = 0;i<position.length;i++)
  {
    objectDetailArr[i] = {position:position[i],skin:skin,customModel:customModel?customModel:'none'}
  }
  for(let i =0;i<(AppCntext.mapWidth.current*AppCntext.mapHeight.current);i++)
  {   
            createObject(AppCntext.gameMap.current,'decor',objectDetailArr,i);
  }
  return null
}
/**
 * 
 * @param {{position : number[],open:boolean}} param0 
 * @returns 
 */
export function AddDoor({position,open})
{
  const AppCntext = useContext(appContext);
  let objectDetailArr = [];

  for(let i = 0;i<position.length;i++)
  {
    objectDetailArr[i] = {open:open?open:false,position:position[i]}
  }
  for(let i =0;i<(AppCntext.mapWidth.current*AppCntext.mapHeight.current);i++)
  {   
            createObject(AppCntext.gameMap.current,'Exitdoor',objectDetailArr,i);
  }
  return null
}
/**
 * 
 * @param {{life:number,position: number[],important:boolean,type:string,difficulty:string,mobCustomModel:JSX.Element,bulletCustomModel:JSX.Element}} param0 
 * @returns 
 */
export function AddMob({life,position,children,important,type,difficulty,mobCustomModel,bulletCustomModel})
{
  const AppCntext = useContext(appContext);
  let objectDetailArr = [];
  let lifeProps = life? life : 2;
  let objectSkin = 'none'
  let _mobCustomModel = mobCustomModel? mobCustomModel : 'none'
  let _bulletCustomModel = bulletCustomModel? bulletCustomModel : 'none'
  let _itemCustomModel = 'none'
  let hasObject = false;
  let objectIsImportant = false;
  let objectValue = 1;
  let objectPosition = 0;
  //TYPE
  // 1 STATIC
  // 2 STATIC ACTIVE
  // 3 ACTIVE AGRESSIVE
  let mobType = type? type : '1';

  if(children)
  {
    
    if(children.length)
    {
      if(children[0].props.name)
      {
        hasObject = children[0].props.name;
        objectValue = children[0].props.value? children[0].props.value : 1; 
        _itemCustomModel = children[0].props.customModel?  children[0].props.customModel : 'none'

        if(hasObject == 'heal_item'){objectSkin = children[0].props.skin?children[0].props.skin:'heal_item_1';objectIsImportant = children[0].props.important? children[0].props.important : false;}
        if(hasObject == 'coin_item'){objectSkin = children[0].props.skin?children[0].props.skin:'coin_item_1';objectIsImportant = children[0].props.important? children[0].props.important : false;}
        if(hasObject == 'upgrade_shoot_power_item'){objectSkin =  children[0].props.skin?children[0].props.skin:'upgrade_shoot_power_item';objectIsImportant = children[0].props.important? children[0].props.important : false;}
        if(hasObject == 'upgrade_shoot_power_item'){objectSkin =  children[0].props.skin?children[0].props.skin:'upgrade_shoot_power_item';objectIsImportant = children[0].props.important? children[0].props.important : false;}
        if(hasObject == 'upgrade_life_item'){objectSkin =  children[0].props.skin?children[0].props.skin:'upgrade_life_item';objectIsImportant = children[0].props.important? children[0].props.important : false;}
        if(hasObject == 'key_item'){objectSkin = children[0].props.skin?children[0].props.skin:'key_1';objectIsImportant = children[0].props.important===children[0].props.important? (children[0].props.important==true?true:false) : (children[0].props.important==false?false:true);}
      }
      else
      {
        
      }
      
    }
    else
    {
        if(children.props.name)
        {
          hasObject = children.props.name;
          objectValue = children.props.value? children.props.value : 1; 
          _itemCustomModel = children.props.customModel? children.props.customModel : 'none'

          if(hasObject == 'heal_item'){objectSkin = children.props.skin?children.props.skin:'heal_item_1';objectIsImportant = children.props.important? children.props.important : false;}
          if(hasObject == 'coin_item'){objectSkin = children.props.skin?children.props.skin:'coin_item_1';objectIsImportant = children.props.important? children.props.important : false;}
          if(hasObject == 'upgrade_shoot_power_item'){objectSkin =  children.props.skin?children.props.skin:'upgrade_shoot_power_item';objectIsImportant = children.props.important? children.props.important : false;}
          if(hasObject == 'upgrade_shoot_power_item'){objectSkin =  children.props.skin?children.props.skin:'upgrade_shoot_power_item';objectIsImportant = children.props.important? children.props.important : false;}
          if(hasObject == 'upgradelife_item'){objectSkin =  children.props.skin?children.props.skin:'upgradelife_item';objectIsImportant = children.props.important? children.props.important : false;}
          if(hasObject == 'key_item'){objectSkin = children.props.skin?children.props.skin:'key_1';objectIsImportant = children.props.important===children.props.important? (children.props.important==true?true:false) : (children.props.important==false?false:true)}
        }
        else
        {
          
        }
      
    }
  }
  else
  {
    hasObject = false;
  }
  for(let i = 0;i<position.length;i++)
  {
    objectDetailArr[i] = {position:position[i],difficulty,life:lifeProps,mobType:mobType,mobSkin:'dummy',hasObject:hasObject,fromMob:true,isImportant:important?important:false,
                          objectValue,objectPosition,objectSkin,objectIsImportant,_bulletCustomModel,_mobCustomModel,_itemCustomModel}
  }
  for(let i =0;i<(AppCntext.mapWidth.current*AppCntext.mapHeight.current);i++)
  {   
            createObject(AppCntext.gameMap.current,'mob',objectDetailArr,i);
  }
  return  null
}
/**
 * 
 * @param {{name:string,important:boolean,value:number,upgradeType:string,skin:string,customModel:JSX.Element}} param0 
 * @returns 
 */
export function AddChildItem({name,important,value,skin,customModel})
{
  return null;
}

/**
 * 
 * @param {{position:number[],destructible:boolean,life:number}} param0 
 * @returns 
 */
export function AddWall({position,destructible,life})
{
  const AppCntext = useContext(appContext);
  let objectDetailArr = []

  for(let i = 0;i<position.length;i++)
  {

      objectDetailArr[i] = {position:position[i],objectName:'Wall_type_1',skin:'wall_1',destructible:destructible?destructible:false,life:life?life:0,isImportant:false}
    
  }
  for(let i =0;i<(AppCntext.mapWidth.current*AppCntext.mapHeight.current);i++)
  {   
      createObject(AppCntext.gameMap.current,'wall',objectDetailArr,i);
      
  }
  return null
}

export function UpdateStroryScreen({children})
{
  const AppCntext = useContext(appContext);
  
    if(children)
    {
      if(children.length)
      {
        storyText.value = children;
      }
      else
      {
        storyText.value = [children];
      }
      
    }
    else
    {
      storyText.value = ['none'];
    }
   
  return null
}

/**
 * 
 * @param {{minute:number,second:number}} param0 
 */
export function AddTimer({minute,second})
{
  let _appContext = useContext(appContext);
  const isUnmounted = useRef(false);
    if(second>=0 && second<60)
    {
      _appContext.levelInfo.current.timerSecond = second;
    }
    else
    {
      _appContext.levelInfo.current.timerSecond = 0;
    }
    if(minute>=0 && minute<10)
      {
        _appContext.levelInfo.current.timerMinute = minute;
      }
    else
    {
        _appContext.levelInfo.current.timerMinute = 0;
    }

    return null
}

/**
 * 
 * @param {{width:number,height:number,addWallOnMap:boolean}} param0 
 * @returns 
 */
export function SetMapDimension({width,height,addWallOnMap})
{
  let _appContext = useContext(appContext)
  _appContext.mapWidth.current = width? width : 16;
  _appContext.mapWidth.current = _appContext.mapWidth.current > 0? _appContext.mapWidth.current : 16;

  _appContext.mapHeight.current = height? height : 19;
  _appContext.mapHeight.current = _appContext.mapHeight.current > 0? _appContext.mapHeight.current : 19;

  _appContext.setMapWall.current = addWallOnMap? addWallOnMap : false;

  _appContext.gameMap.current = createLevel(_appContext.level.current,_appContext.mapWidth.current,_appContext.mapHeight.current)
  return null
}

/**
 * 
 * @param {{position:number[],mobToKill:number,keyToCollect:number,orientation:string,customModel:JSX.Element}} param0 
 * @returns 
 */
export function AddBarrier({position,orientation,mobToKill,keyToCollect,customModel})
{
  let _appContext = useContext(appContext)
  let objectDetailArr = []

  for(let i = 0;i<position.length;i++)
  {

      objectDetailArr[i] = {position:position[i],objectName:'barier',skin:'barier_1',mobToKill:mobToKill?mobToKill:(mobToKill==0?0:1),
        keyToCollect:keyToCollect?keyToCollect:0,orientation:orientation?orientation:'FRONT',customModel:customModel?customModel:'none'}
    
  }
  for(let i =0;i<(_appContext.mapWidth.current*_appContext.mapHeight.current);i++)
  {   
      createObject(_appContext.gameMap.current,'barier',objectDetailArr,i);
  }
  return null;
}

/**
 * 
 * @param {name:string} param0 
 * @returns 
 */
export function Set3DModel({name,children})
{
  let _appContext = useContext(appContext);
  if(name)
  {
    _appContext.healItemModel.current = children
  }
  return null
}

