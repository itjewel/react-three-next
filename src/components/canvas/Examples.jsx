'use client'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo, useRef, useState,useEffect} from 'react'
import { Line, useCursor, MeshDistortMaterial } from '@react-three/drei'
import { useRouter } from 'next/navigation'

export const Blob = ({ route = '/', ...props }) => {
  const router = useRouter()
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  return (
    <mesh
      onClick={() => router.push(route)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial roughness={0.5} color={hovered ? 'hotpink' : '#1fb2f5'} />
    </mesh>
  )
}

export const Logo = ({ route = '/blob', ...props }) => {
  const mesh = useRef(null)
  const router = useRouter()

  const [hovered, hover] = useState(false)
  const points = useMemo(() => new THREE.EllipseCurve(0, 0, 3, 1.15, 0, 2 * Math.PI, false, 0).getPoints(100), [])

  useCursor(hovered)
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.y = Math.sin(t) * (Math.PI / 8)
    mesh.current.rotation.x = Math.cos(t) * (Math.PI / 8)
    mesh.current.rotation.z -= delta / 4
  })

  return (
    <group ref={mesh} {...props}>
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} rotation={[0, 0, 1]} />
      {/* @ts-ignore */}
      <Line worldUnits points={points} color='#1fb2f5' lineWidth={0.15} rotation={[0, 0, -1]} />
      <mesh onClick={() => router.push(route)} onPointerOver={() => hover(true)} onPointerOut={() => hover(false)}>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshPhysicalMaterial roughness={0.5} color={hovered ? 'hotpink' : '#1fb2f5'} />
      </mesh>
    </group>
  )
}

export function Duck(props) {
  const { scene } = useGLTF('/duck.glb')

  useFrame((state, delta) => (scene.rotation.y += delta))

  return <primitive object={scene} {...props} />
}

export function Dog(props){
 const {scene} = useGLTF('/dog.glb');
 const texture = useTexture("https://media.licdn.com/dms/image/C5103AQFuMdCSCvTfZg/profile-displayphoto-shrink_200_200/0/1517456109776?e=2147483647&v=beta&t=XFaothjRYmekhP9TxvuxH3cPrTHAup70xt9Ip2GCHlI");
 const groupGl = useRef();
 useEffect(()=>{
  if(groupGl.current){
    scene.traverse((child)=>{
      if(child.isMesh){
        child.material.map = texture;
        child.material.meedUpdate = true;
      }
    });
    groupGl.current.add(scene);
  }
  // groupGl.current.add(scene)
 },[scene,texture]);
 
 return <group ref={groupGl} {...props}/>

}

// export function Dog(props) {
//  const {scene} = useGLTF('/dog.glb');
//  const groupGl = useRef();
//  useEffect(()=>{
//   group.current.add(scene)
//  },[scene]);
//  return <group ref={groupGl} {...props}/>
  
// }
// export function Dog(props) {
//   // console.log(props,'jewel')
//   const { scene } = useGLTF('/dog.glb')
//   return <primitive object={scene} {...props} />
// }
