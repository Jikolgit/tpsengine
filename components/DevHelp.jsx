import { useContext } from "react"
import { gameAppContext } from "./GameApp"
import { Text } from "@react-three/drei";

export function PlatformIndex()
{
    let gameContext = useContext(gameAppContext);
    const GameMap = gameContext.GameMap;
    let indexContainer=[];

    for(let i =0; i< GameMap.length;i++)
    {
        indexContainer[i] = <Text
                                key={i}
                                characters='1234567890'
                                fontSize={0.8} fontWeight={700}
                                rotation={[Math.PI*0.5,-(Math.PI),0]}
                                position={[GameMap[i].xPose,1.2,GameMap[i].zPose]} color={'white'} anchorX={"center"} anchorY={"middle"}
                            >

                                    
                                    {GameMap[i].id}
                            </Text>
    }
    return(
        <>
        {indexContainer}
        </>
    )
}