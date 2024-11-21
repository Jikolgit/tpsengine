
let objectIdValue = 0;
let mapHeight = 19;
let mapWidth = 16;

/**
 * 
 * @param {*[]} map_level 
 * @param {string} objectType 
 * @param {*[]} objectIndexArr 
 * @param {number} index 
 */
export function createObject(map_level,objectType,objectIndexArr,index)
{   
    for(let i =0;i<objectIndexArr.length;i++)
    {   
        if(objectIndexArr[i].position == index)
        {

            
            if(objectType == 'barier')
            {
                map_level[index].active = true,map_level[index].objectType ='barier', map_level[index].isOnScene = true,
                map_level[index].objectDesc={objectName:objectIndexArr[i].objectName,mobToKill:objectIndexArr[i].mobToKill,orientation:objectIndexArr[i].orientation,
                    keyToCollect:objectIndexArr[i].keyToCollect,customModel:objectIndexArr[i].customModel}, map_level[index].object = true;map_level[index].objectId = objectIdValue;
                objectIdValue ++;
            }
            
            else if(objectType == 'mob')
        {      
                map_level[index].active = true,map_level[index].hasEnemy = true, map_level[index].objectType ='mob' ,map_level[index].isOnScene = true
                map_level[index].objectDesc={mobType:objectIndexArr[i].mobType,mobDifficulty:objectIndexArr[i].difficulty,mobSkin:objectIndexArr[i].mobSkin,life:objectIndexArr[i].life,
                                             hasObject:objectIndexArr[i].hasObject,objectName:objectIndexArr[i].hasObject,objectValue:objectIndexArr[i].objectValue,objectSkin:objectIndexArr[i].objectSkin,
                                             fromMob:true,isImportant:objectIndexArr[i].isImportant,objectIsImportant:objectIndexArr[i].objectIsImportant,itemCustomModel:objectIndexArr[i]._itemCustomModel,
                                             mobCustomModel:objectIndexArr[i]._mobCustomModel,bulletCustomModel:objectIndexArr[i]._bulletCustomModel},
                map_level[index].object = true;map_level[index].objectId = objectIdValue;
                objectIdValue ++;
                
             
            }
            
            
            else if(objectType == 'item')
            {   
                
                if(objectIndexArr[i].objectName == 'box_item')
                {   
                    map_level[index].active = true,map_level[index].objectType = objectType, map_level[index].isOnScene = true
                    map_level[index].objectDesc ={objectName:objectIndexArr[i].objectName,isImportant:objectIndexArr[i].isImportant,value:objectIndexArr[i].value,skin:objectIndexArr[i].skin,boxDestroyed:false,
                                                  objectLife:objectIndexArr[i].life,hasChildObject:objectIndexArr[i].hasChildObject,customModel:objectIndexArr[i].customModel,
                                                  childObjectSkin:objectIndexArr[i].childObjectSkin,childObjectValue:objectIndexArr[i].childObjectValue,childObjectIsImportant:objectIndexArr[i].childObjectIsImportant,
                                                  childCustomModel:objectIndexArr[i].childCustomModel
                    },
                    map_level[index].object = true,map_level[index].objectId = objectIdValue
                    objectIdValue ++;
                }
                else if(objectIndexArr[i].objectName == 'upgrade_shoot_power_item' || objectIndexArr[i].objectName == 'upgrade_shoot_speed_item')
                {
                    map_level[index].active = true,map_level[index].objectType = objectType, map_level[index].isOnScene = true
                    map_level[index].objectDesc ={objectName:objectIndexArr[i].objectName,isImportant:objectIndexArr[i].isImportant,customModel:objectIndexArr[i].customModel,
                        value:objectIndexArr[i].value,skin:objectIndexArr[i].skin},map_level[index].object = true,map_level[index].objectId = objectIdValue
                    objectIdValue ++;
                }
                else
                {
                    map_level[index].active = true,map_level[index].objectType = objectType, map_level[index].isOnScene = true
                    map_level[index].objectDesc ={objectName:objectIndexArr[i].objectName,isImportant:objectIndexArr[i].isImportant,value:objectIndexArr[i].value,
                        customModel:objectIndexArr[i].customModel,skin:objectIndexArr[i].skin},map_level[index].object = true,map_level[index].objectId = objectIdValue
                    objectIdValue ++;
                }
               
                
            }
            else if(objectType == 'wall')
            {   
                map_level[index].active = true,map_level[index].objectType = objectType, map_level[index].isOnScene = true
                map_level[index].objectDesc ={destructible:objectIndexArr[i].destructible,objectName:objectIndexArr[i].objectName,isImportant:objectIndexArr[i].isImportant,life:objectIndexArr[i].value,skin:objectIndexArr[i].skin},map_level[index].object = true,map_level[index].objectId = objectIdValue
                objectIdValue ++;
                
            }
            
            else if(objectType == 'decor')
            {   
                map_level[index].active = true,map_level[index].isOnScene = true,map_level[index].objectType ='decor',
                map_level[index].objectDesc={skin:objectIndexArr[i].skin,customModel:objectIndexArr[i].customModel} ,map_level[index].object = true
            }
            else if(objectType == 'final_exitDoor')
            {
                map_level[index].active = true,map_level[index].objectType ='final_exitDoor',map_level[index].object = true
            }
            
            else if(objectType == 'Exitdoor')
            {
                map_level[index].active = true,map_level[index].isOnScene = true,map_level[index].objectType ='Exitdoor', map_level[index].objectDesc ={open:objectIndexArr[i].open},map_level[index].object = true,map_level[index].objectId = objectIdValue;

                objectIdValue ++;
            }
        }
        
    }
}

function createMapTemplate()
{
    let mapTemplate = [];
    let xMap =1, zMap =1;
    let xLevel = 0,zLevel = 0;
    for(let i =0;i<(mapWidth*mapHeight);i++)
        {
            for(let i1 =0;i1<mapHeight;i1++)
            {
                if(i1 == 0){}
                else
                {
                    if(i == mapWidth*i1 )
                        {  
                            xLevel = 0;
                            zLevel +=2;
                        }
                }
                
            }
            mapTemplate[i] = 
            {
                id:i, 
                xPose:xMap + xLevel,
                zPose:zMap + zLevel,
                hasEnemy:false,
                isOnScene:false, // Est ce que l'objet présent à cette zone est toujours sur scène
                active:true,
                object:false,
                objectType:'none',
                objectId:"none",
                objectDesc:null,
                objectLimit:false, //La zone que les objects ne peuvent pas dépasser
                
                
            }
            for(let i2 =0;i2<mapHeight;i2++)
            {
                if(i2 == 0)
                {}
                else
                {
                    if(i<mapWidth || i>(mapWidth*(mapHeight-1)) || i == mapWidth*i2 || i == mapWidth*(i2+1)-1)
                    {   
                        mapTemplate[i].objectLimit = true
                        
                    }
                }
                
                    
            }

            xLevel += 2;
        }

    return mapTemplate
}
/**
 * 
 * @param {number} level 
 * @returns {{id:number,xPose:number,zPose:number;hasEnemy:boolean,
 *              isOnScene:boolean,active:boolean,object:boolean,
*              objectType:string,objectId:string,objectDesc:*,objectLimit:boolean}[]}
 */
export function createLevel(level,mapW,mapH)
{

        mapHeight = mapH;
        mapWidth = mapW;
        let mapTemplate = createMapTemplate()
        

    return mapTemplate;
}

export function addWeaponObjectonMap(name,position) 
{
    for(let i =0;i<(mapWidth*mapHeight);i++)
    {
        createObject(mapTemplate,'item',[{position:position,heal:null,skin:name,isImportant:true}],i);
    }
}

