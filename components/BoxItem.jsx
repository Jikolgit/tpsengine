import { useEffect } from "react";
import { ItemType1Model, ItemType2Model } from "./Game3DAssets";

export function BoxItem(props)
{
    let parentItemController = {value:[]};
    let childItemController = {value:[]};
    useEffect(()=>
        { 
            
          props.controller.itemController.value[props.controller.index] = (args,params)=>
          {
              if(args == 'SHOW-CHILD-ITEM')
              {
               
                parentItemController.value[0]('REMOVE-ITEM')
                childItemController.value[0]('SHOW-ITEM')
              }

            else if(args == 'REMOVE-PARENT-ITEM')
            {   
                parentItemController.value[0]('REMOVE-ITEM')
            }

              else if(args == 'REMOVE-ITEM')
              {
                childItemController.value[0]('REMOVE-ITEM')
              }

              else if(args == 'Update-Item-Life')
              {
                
                parentItemController.value[0]('SHAKE-ITEM')
              }

              else if(args == 'destroy-Item')
              {
                
                params();
              }
          } 
        },[])
        
    return(
            <>
                <group>
                        <ItemType2Model objectName={props.objectName} controller={{itemController:parentItemController,index:0}} 
                        skin={props.skin} x={props.x} z={props.z} _visible={true} customModel={props.customModel}
                        />
                        {props.hasChildObject?
                            <>
                            {props.childObjectSkin == 'coin_item_1'? 
                                <ItemType1Model controller={{itemController:childItemController,index:0}} 
                                skin={props.childObjectSkin} x={props.x} z={props.z} _visible={false} />
                                :
                                <ItemType2Model objectName={props.hasChildObject} controller={{itemController:childItemController,index:0}} 
                                skin={props.childObjectSkin} x={props.x} z={props.z} _visible={false} customModel={props.childCustomModel}
                                />
                            }
                            </>
                            :
                            null
                        }
                </group>
            </>
    )
}