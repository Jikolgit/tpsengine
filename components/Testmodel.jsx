/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 ./public/testmodel.glb 
*/
import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function TestModel(props) {
  const { nodes, materials } = useGLTF('testmodel.glb');
  let testmat = new THREE.MeshBasicMaterial({color:'red',wireframe:true})
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.maptest.geometry} material={testmat} position={[0, 0, 2]} />
    </group>
  )
}

useGLTF.preload('testmodel.glb')