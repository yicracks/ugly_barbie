import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, DoubleSide } from 'three';
import { WardrobeState } from '../types';

interface Doll3DProps {
  wardrobe?: WardrobeState;
}

// --- Materials ---
const SkinMaterial = ({ tone }: { tone: 'fair' | 'tan' | 'dark' }) => {
  const color = useMemo(() => {
    switch(tone) {
      case 'dark': return '#8d5524';
      case 'tan': return '#c68642'; // Richer tan
      case 'fair': default: return '#ffebd6'; // Warm porcelain
    }
  }, [tone]);
  
  return <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />;
};

const HairMaterial = ({ color }: { color: string }) => {
  return <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} side={DoubleSide} />;
};

const FabricMaterial = ({ color, roughness = 0.5, metalness = 0, transparent = false, opacity = 1 }: any) => (
  <meshStandardMaterial 
    color={color} 
    roughness={roughness} 
    metalness={metalness} 
    side={DoubleSide}
    transparent={transparent}
    opacity={opacity}
  />
);

// --- Helpers ---
const JointSphere = ({ radius, tone }: { radius: number, tone: any }) => (
  <mesh>
    <sphereGeometry args={[radius, 32, 32]} />
    <SkinMaterial tone={tone} />
  </mesh>
);

const ConnectedLimb = ({ topRadius, bottomRadius, length, position, rotation, tone }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, -length / 2, 0]}>
      <cylinderGeometry args={[topRadius, bottomRadius, length, 32]} />
      <SkinMaterial tone={tone} />
    </mesh>
  </group>
);

const DetailedHand = ({ tone, side }: { tone: any, side: 'left' | 'right' }) => {
  const sign = side === 'left' ? -1 : 1;
  return (
    <group>
      <mesh position={[0, -0.04, 0]} scale={[1, 1, 0.6]}>
        <boxGeometry args={[0.05, 0.06, 0.02]} />
        <SkinMaterial tone={tone} />
      </mesh>
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[sign * (0.015 - i * 0.01), -0.08 - (i===1||i===2 ? 0.01 : 0), (i===1||i===2 ? 0.005 : 0)]} rotation={[0.1, 0, sign * (i-1.5)*0.1]}>
           <capsuleGeometry args={[0.005, 0.045, 4, 8]} />
           <SkinMaterial tone={tone} />
        </mesh>
      ))}
      <mesh position={[sign * 0.03, -0.04, 0.015]} rotation={[0, 0.5 * sign, sign * -0.5]}>
         <capsuleGeometry args={[0.006, 0.035, 4, 8]} />
         <SkinMaterial tone={tone} />
      </mesh>
    </group>
  );
};

const DetailedFoot = ({ tone, side, shoeType }: { tone: any, side: 'left' | 'right', shoeType: string }) => {
  const isHighHeel = shoeType === 'heels' || shoeType === 'boots';
  const rotationX = isHighHeel ? 0.8 : 0.2;
  
  return (
    <group rotation={[rotationX, 0, 0]}>
       <mesh position={[0, 0.05, -0.02]} scale={[1, 1, 1.2]}>
          <boxGeometry args={[0.07, 0.12, 0.04]} />
          <SkinMaterial tone={tone} />
       </mesh>
       <mesh position={[0, 0.08, -0.04]}>
          <sphereGeometry args={[0.036]} />
          <SkinMaterial tone={tone} />
       </mesh>
       {(shoeType === 'bare' || shoeType === 'sandals') && (
         <group position={[0, -0.02, 0.01]}>
            {[0, 1, 2, 3, 4].map(i => (
               <mesh key={i} position={[(i-2) * 0.014, 0, 0]}>
                  <sphereGeometry args={[0.007]} />
                  <SkinMaterial tone={tone} />
               </mesh>
            ))}
         </group>
       )}
       {shoeType === 'heels' && (
         <group>
           <mesh position={[0, 0.02, 0.01]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[0.08, 0.14, 0.01]} />
              <FabricMaterial color="#d4af37" metalness={0.8} />
           </mesh>
           <mesh position={[0, 0.1, -0.06]} rotation={[-0.8, 0, 0]}>
              <cylinderGeometry args={[0.01, 0.005, 0.15]} />
              <FabricMaterial color="#111" />
           </mesh>
           <mesh position={[0, 0.02, 0]}>
              <torusGeometry args={[0.04, 0.005, 8, 16]} rotation={[Math.PI/2, 0, 0]} />
              <FabricMaterial color="#111" />
           </mesh>
         </group>
       )}
       {shoeType === 'sandals' && (
          <group>
            <mesh position={[0, 0.02, 0.01]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[0.09, 0.16, 0.01]} />
              <FabricMaterial color="#8b4513" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.02]}>
              <torusGeometry args={[0.04, 0.004, 8, 16]} rotation={[Math.PI/2.2, 0, 0]} />
              <FabricMaterial color="#ffd700" metalness={0.5} />
            </mesh>
             <mesh position={[0, 0.05, -0.02]}>
              <torusGeometry args={[0.042, 0.004, 8, 16]} rotation={[Math.PI/2, 0, 0]} />
              <FabricMaterial color="#ffd700" metalness={0.5} />
            </mesh>
          </group>
       )}
       {shoeType === 'sneakers' && (
          <group position={[0, 0.02, 0.02]} rotation={[-0.4, 0, 0]}>
             <mesh position={[0, -0.02, 0]}>
               <boxGeometry args={[0.1, 0.18, 0.06]} />
               <FabricMaterial color="#fff" />
             </mesh>
             <mesh position={[0.052, 0, 0]}>
                <boxGeometry args={[0.005, 0.1, 0.04]} />
                <FabricMaterial color="#ff69b4" />
             </mesh>
              <mesh position={[-0.052, 0, 0]}>
                <boxGeometry args={[0.005, 0.1, 0.04]} />
                <FabricMaterial color="#ff69b4" />
             </mesh>
          </group>
       )}
    </group>
  );
};

// --- Sculpted Hair System (Solid Volume) ---
const SculptedHair = ({ type, color }: { type: string, color: string }) => {
  return (
    <group>
      {/* Skull Base - Fully Covers Head */}
      <mesh position={[0, 0.25, -0.05]} scale={[0.95, 0.95, 1.05]}>
         <sphereGeometry args={[0.36, 32, 32]} />
         <HairMaterial color={color} />
      </mesh>

      {/* Styles */}
      {type === 'blonde-bombshell' && (
        <group>
          {/* Top Volume */}
          <mesh position={[0, 0.45, -0.1]} scale={[1, 0.4, 1.2]}>
            <sphereGeometry args={[0.38, 32, 32]} />
            <HairMaterial color={color} />
          </mesh>
          {/* Big Side Waves */}
          <mesh position={[0.35, -0.5, 0.1]} rotation={[0, 0, -0.2]} scale={[0.4, 1.8, 0.6]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <HairMaterial color={color} />
          </mesh>
          <mesh position={[-0.35, -0.5, 0.1]} rotation={[0, 0, 0.2]} scale={[0.4, 1.8, 0.6]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <HairMaterial color={color} />
          </mesh>
          {/* Back Volume */}
          <mesh position={[0, -0.8, -0.3]} rotation={[0.2, 0, 0]} scale={[1, 2.5, 0.5]}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <HairMaterial color={color} />
          </mesh>
          {/* Framing Strands */}
           <mesh position={[0.25, 0, 0.2]} rotation={[0, 0, -0.1]} scale={[0.15, 0.8, 0.15]}>
             <capsuleGeometry args={[1, 1, 4, 8]} />
             <HairMaterial color={color} />
           </mesh>
           <mesh position={[-0.25, 0, 0.2]} rotation={[0, 0, 0.1]} scale={[0.15, 0.8, 0.15]}>
             <capsuleGeometry args={[1, 1, 4, 8]} />
             <HairMaterial color={color} />
           </mesh>
        </group>
      )}

      {type === 'shawl-hair' && (
        <group>
          {/* Smooth straight hair */}
          <mesh position={[0, -0.4, -0.2]} scale={[1.1, 2.0, 0.6]}>
             <sphereGeometry args={[0.4, 32, 32]} />
             <HairMaterial color={color} />
          </mesh>
          {/* Sides */}
          <mesh position={[0.32, -0.2, 0.1]} rotation={[0, 0, -0.1]} scale={[0.2, 1.5, 0.3]}>
             <capsuleGeometry args={[1, 1, 4, 8]} />
             <HairMaterial color={color} />
          </mesh>
           <mesh position={[-0.32, -0.2, 0.1]} rotation={[0, 0, 0.1]} scale={[0.2, 1.5, 0.3]}>
             <capsuleGeometry args={[1, 1, 4, 8]} />
             <HairMaterial color={color} />
          </mesh>
        </group>
      )}

      {type === 'short-bob' && (
        <group>
           <mesh position={[0, 0.1, -0.1]} scale={[1.15, 1.1, 1.15]}>
              <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
              <HairMaterial color={color} />
           </mesh>
           <mesh position={[0.32, -0.1, 0.05]} rotation={[0, 0, -0.2]} scale={[0.2, 0.6, 0.4]}>
              <sphereGeometry args={[0.5]} />
              <HairMaterial color={color} />
           </mesh>
            <mesh position={[-0.32, -0.1, 0.05]} rotation={[0, 0, 0.2]} scale={[0.2, 0.6, 0.4]}>
              <sphereGeometry args={[0.5]} />
              <HairMaterial color={color} />
           </mesh>
        </group>
      )}

      {type === 'cute-bangs' && (
        <group>
           {/* Bangs Block */}
           <mesh position={[0, 0.38, 0.22]} rotation={[0.2, 0, 0]} scale={[0.8, 0.3, 0.2]}>
              <sphereGeometry args={[0.4]} />
              <HairMaterial color={color} />
           </mesh>
           {/* Long back */}
           <mesh position={[0, -0.5, -0.2]} scale={[1.1, 2.2, 0.5]}>
              <sphereGeometry args={[0.4, 32, 32]} />
              <HairMaterial color={color} />
           </mesh>
        </group>
      )}
    </group>
  );
};

export const Doll3D: React.FC<Doll3DProps> = ({ wardrobe }) => {
  const groupRef = useRef<Group>(null);
  
  const currentWardrobe = wardrobe || {
    skin: 'fair',
    hair: 'blonde-bombshell',
    outfit: 'pink-gown',
    shoes: 'heels',
    accessory: 'none',
    hat: 'none'
  };

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -2.9 + Math.sin(state.clock.elapsedTime * 0.7) * 0.015;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  const hairColor = currentWardrobe.hair.includes('blonde') ? '#f0e68c' : (currentWardrobe.hair.includes('bob') ? '#2a1b15' : '#5d4037');

  return (
    <group ref={groupRef} position={[0, -2.8, 0]}>
      
      {/* --- HEAD & FACE RECONSTRUCTION --- */}
      <group position={[0, 4.45, 0]}>
         
         {/* 1. Cranium (Top of Head) */}
         <mesh position={[0, 0.25, -0.05]}>
            <sphereGeometry args={[0.34, 32, 32]} />
            <SkinMaterial tone={currentWardrobe.skin} />
         </mesh>

         {/* 2. Face Shape (Chiseled Jawline) */}
         <group position={[0, 0, 0]}>
            {/* Upper Face */}
            <mesh position={[0, 0.15, 0.08]} scale={[1, 1, 0.8]}>
               <sphereGeometry args={[0.32, 32, 32]} />
               <SkinMaterial tone={currentWardrobe.skin} />
            </mesh>
            {/* Jaw/Chin - Tapered */}
            <mesh position={[0, -0.15, 0.05]} scale={[0.8, 1, 0.8]}>
               <cylinderGeometry args={[0.31, 0.15, 0.5, 32]} />
               <SkinMaterial tone={currentWardrobe.skin} />
            </mesh>
             {/* Cheekbones */}
            <mesh position={[0.22, 0.05, 0.2]} scale={[0.5, 0.3, 0.2]} rotation={[0, 0.5, 0]}>
               <sphereGeometry args={[0.2]} />
               <SkinMaterial tone={currentWardrobe.skin} />
            </mesh>
             <mesh position={[-0.22, 0.05, 0.2]} scale={[0.5, 0.3, 0.2]} rotation={[0, -0.5, 0]}>
               <sphereGeometry args={[0.2]} />
               <SkinMaterial tone={currentWardrobe.skin} />
            </mesh>
         </group>

         {/* 3. Detailed Features */}
         <group position={[0, 0, 0.32]}>
            {/* Nose - Explicit Geometry */}
            <mesh position={[0, -0.05, 0.05]} rotation={[-0.2, 0, 0]}>
               <coneGeometry args={[0.04, 0.15, 4]} />
               <SkinMaterial tone={currentWardrobe.skin} />
            </mesh>

            {/* Eyes - Almond / Foxy Shape */}
            <group position={[0, 0.1, 0]}>
               {/* Left Eye */}
               <group position={[-0.14, 0, 0]} rotation={[0, 0.15, 0.1]}> {/* Tilted */}
                   <mesh scale={[1, 0.6, 0.2]}>
                      <sphereGeometry args={[0.07]} />
                      <meshStandardMaterial color="#fff" />
                   </mesh>
                   <mesh position={[0, 0, 0.06]} scale={[1, 1, 0.1]}>
                      <circleGeometry args={[0.035, 32]} />
                      <meshStandardMaterial color="#6495ed" />
                   </mesh>
                   <mesh position={[0, 0, 0.062]} scale={[1, 1, 0.1]}>
                      <circleGeometry args={[0.015, 32]} />
                      <meshStandardMaterial color="#000" />
                   </mesh>
                   {/* Eyeliner */}
                   <mesh position={[0, 0.04, 0.02]}>
                      <boxGeometry args={[0.13, 0.01, 0.02]} />
                      <meshStandardMaterial color="#000" />
                   </mesh>
               </group>

               {/* Right Eye */}
               <group position={[0.14, 0, 0]} rotation={[0, -0.15, -0.1]}>
                   <mesh scale={[1, 0.6, 0.2]}>
                      <sphereGeometry args={[0.07]} />
                      <meshStandardMaterial color="#fff" />
                   </mesh>
                   <mesh position={[0, 0, 0.06]} scale={[1, 1, 0.1]}>
                      <circleGeometry args={[0.035, 32]} />
                      <meshStandardMaterial color="#6495ed" />
                   </mesh>
                   <mesh position={[0, 0, 0.062]} scale={[1, 1, 0.1]}>
                      <circleGeometry args={[0.015, 32]} />
                      <meshStandardMaterial color="#000" />
                   </mesh>
                    {/* Eyeliner */}
                   <mesh position={[0, 0.04, 0.02]}>
                      <boxGeometry args={[0.13, 0.01, 0.02]} />
                      <meshStandardMaterial color="#000" />
                   </mesh>
               </group>
            </group>
            
            {/* Lips - Fuller & Shaped */}
            <group position={[0, -0.24, 0.06]}>
               <mesh position={[0, 0.02, 0]} scale={[1, 0.5, 0.5]}>
                  <sphereGeometry args={[0.06]} />
                  <meshStandardMaterial color="#d81b60" roughness={0.2} />
               </mesh>
               <mesh position={[0, -0.02, 0]} scale={[1, 0.6, 0.5]}>
                  <sphereGeometry args={[0.06]} />
                  <meshStandardMaterial color="#d81b60" roughness={0.2} />
               </mesh>
            </group>
         </group>

         {/* Sculpted Hair (Replaces strands) */}
         <SculptedHair type={currentWardrobe.hair} color={hairColor} />

         {/* Hats */}
         {currentWardrobe.hat === 'beret' && (
            <group position={[0.2, 0.65, 0]} rotation={[0, 0, -0.4]}>
               <mesh scale={[1, 0.3, 1]}>
                  <sphereGeometry args={[0.55, 32, 32]} />
                  <FabricMaterial color="#c0392b" roughness={0.8} />
               </mesh>
               <mesh position={[0, 0.17, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.1]} />
                  <FabricMaterial color="#c0392b" />
               </mesh>
            </group>
         )}

         {currentWardrobe.hat === 'sun-hat' && (
            <group position={[0, 0.5, 0]} rotation={[-0.2, 0, 0]}>
               <mesh>
                  <cylinderGeometry args={[0.4, 1.2, 0.05, 32]} />
                  <FabricMaterial color="#fcf3cf" roughness={1} />
               </mesh>
               <mesh position={[0, 0.15, 0]}>
                  <cylinderGeometry args={[0.4, 0.38, 0.3, 32]} />
                  <FabricMaterial color="#fcf3cf" roughness={1} />
               </mesh>
            </group>
         )}

         {/* Accessories */}
         {currentWardrobe.accessory === 'pearls' && (
            <group position={[0, -0.45, 0]} rotation={[1.6, 0, 0]}>
               <torusGeometry args={[0.28, 0.04, 16, 32]} />
               <meshStandardMaterial color="#fff" roughness={0.2} />
            </group>
         )}
         {currentWardrobe.accessory === 'silver-necklace' && (
            <group position={[0, -0.48, 0]} rotation={[1.6, 0, 0]}>
               <torusGeometry args={[0.28, 0.01, 16, 32]} />
               <meshStandardMaterial color="#ccc" metalness={1} />
            </group>
         )}
      </group>
      
      {/* Neck - Longer for model look */}
      <mesh position={[0, 3.85, 0]}>
        <cylinderGeometry args={[0.09, 0.12, 0.6, 24]} />
        <SkinMaterial tone={currentWardrobe.skin} />
      </mesh>

      {/* --- BODY --- */}
      <group position={[0, 3.25, 0]}>
         {/* Upper Torso */}
         <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.3, 0.26, 0.6, 24]} />
            <SkinMaterial tone={currentWardrobe.skin} />
         </mesh>
         <mesh position={[0, 0.1, 0.14]} scale={[1, 0.8, 0.6]} rotation={[-0.2, 0, 0]}>
            <sphereGeometry args={[0.31, 24, 24]} />
            <SkinMaterial tone={currentWardrobe.skin} />
         </mesh>
         {/* Waist */}
         <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.23, 0.26, 0.6, 24]} />
            <SkinMaterial tone={currentWardrobe.skin} />
         </mesh>

         {/* Outfit Tops */}
         {currentWardrobe.outfit === 'pink-gown' && (
            <mesh position={[0, -0.15, 0]}>
               <cylinderGeometry args={[0.31, 0.27, 1.1, 24]} />
               <FabricMaterial color="#ffc0cb" roughness={0.4} />
            </mesh>
         )}
         {currentWardrobe.outfit === 'blue-gown' && (
            <mesh position={[0, -0.15, 0]}>
               <cylinderGeometry args={[0.31, 0.27, 1.1, 24]} />
               <FabricMaterial color="#85c1e9" roughness={0.3} />
            </mesh>
         )}
         {currentWardrobe.outfit === 'school-uniform' && (
            <group>
               <mesh position={[0, 0, 0]}>
                  <cylinderGeometry args={[0.32, 0.27, 0.9, 24]} />
                  <FabricMaterial color="#fff" />
               </mesh>
               <mesh position={[0, 0.25, 0.18]}>
                   <dodecahedronGeometry args={[0.08]} />
                   <FabricMaterial color="#b71c1c" />
               </mesh>
            </group>
         )}
         {currentWardrobe.outfit === 'white-lady' && (
             <mesh position={[0, 0.1, 0]}>
               <cylinderGeometry args={[0.32, 0.28, 0.7, 24]} />
               <FabricMaterial color="#fff" opacity={0.9} transparent />
             </mesh>
         )}
      </group>

      {/* --- HIPS --- */}
      <group position={[0, 2.3, 0]}>
         <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.26, 0.38, 0.6, 24]} />
            <SkinMaterial tone={currentWardrobe.skin} />
         </mesh>
         <mesh position={[0, -0.2, 0]}>
            <sphereGeometry args={[0.38, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
            <SkinMaterial tone={currentWardrobe.skin} />
         </mesh>

         {/* Skirts */}
         {currentWardrobe.outfit === 'pink-gown' && (
            <mesh position={[0, -2.0, 0]}>
               <cylinderGeometry args={[0.4, 1.8, 4.0, 32, 4, true]} />
               <FabricMaterial color="#ffc0cb" side={DoubleSide} />
            </mesh>
         )}
         {currentWardrobe.outfit === 'blue-gown' && (
            <mesh position={[0, -2.0, 0]}>
               <cylinderGeometry args={[0.4, 1.6, 4.0, 32, 4, true]} />
               <FabricMaterial color="#85c1e9" />
            </mesh>
         )}
         {currentWardrobe.outfit === 'school-uniform' && (
            <mesh position={[0, -0.8, 0]}>
               <cylinderGeometry args={[0.4, 1.0, 1.5, 16, 1, true]} />
               <FabricMaterial color="#1a237e" />
            </mesh>
         )}
         {currentWardrobe.outfit === 'white-lady' && (
            <mesh position={[0, -1.5, 0]}>
               <cylinderGeometry args={[0.4, 1.3, 3.0, 32, 1, true]} />
               <FabricMaterial color="#f5f5f5" />
            </mesh>
         )}
      </group>

      {/* --- ARMS (EXTENDED WIDE POSE) --- */}
      {/* Moved shoulder anchor point further out (x: +/- 0.46) so it doesn't merge with torso */}
      
      {/* Left Arm */}
      <group position={[-0.46, 3.7, 0]}>
         <JointSphere radius={0.12} tone={currentWardrobe.skin} />
         
         {/* Upper Arm - Rotated 45 degrees out */}
         <group rotation={[0, 0, 0.9]}> 
            <ConnectedLimb topRadius={0.10} bottomRadius={0.08} length={0.9} position={[0, 0, 0]} tone={currentWardrobe.skin} />
            
            <group position={[0, -0.9, 0]}>
               <JointSphere radius={0.09} tone={currentWardrobe.skin} />
               {/* Forearm - Slight bend */}
               <group rotation={[0.2, 0, -0.2]}> 
                  <ConnectedLimb topRadius={0.08} bottomRadius={0.06} length={0.9} position={[0, 0, 0]} tone={currentWardrobe.skin} />
                  <group position={[0, -1.0, 0]} rotation={[0, -0.5, 0]}>
                      <DetailedHand tone={currentWardrobe.skin} side="left" />
                  </group>
               </group>
            </group>
         </group>
      </group>

      {/* Right Arm */}
      <group position={[0.46, 3.7, 0]}>
         <JointSphere radius={0.12} tone={currentWardrobe.skin} />
         
         {/* Upper Arm - Rotated -45 degrees out */}
         <group rotation={[0, 0, -0.9]}>
            <ConnectedLimb topRadius={0.10} bottomRadius={0.08} length={0.9} position={[0, 0, 0]} tone={currentWardrobe.skin} />
            
            <group position={[0, -0.9, 0]}>
               <JointSphere radius={0.09} tone={currentWardrobe.skin} />
               {/* Forearm */}
               <group rotation={[0.2, 0, 0.2]}>
                  <ConnectedLimb topRadius={0.08} bottomRadius={0.06} length={0.9} position={[0, 0, 0]} tone={currentWardrobe.skin} />
                   <group position={[0, -1.0, 0]} rotation={[0, 0.5, 0]}>
                      <DetailedHand tone={currentWardrobe.skin} side="right" />
                  </group>
               </group>
            </group>
         </group>
      </group>

      {/* --- LEGS --- */}
      <group position={[-0.22, 1.9, 0]}>
         <ConnectedLimb topRadius={0.19} bottomRadius={0.14} length={1.7} position={[0, 0, 0]} tone={currentWardrobe.skin} />
         <group position={[0, -1.7, 0]}>
            <JointSphere radius={0.14} tone={currentWardrobe.skin} />
            <ConnectedLimb topRadius={0.13} bottomRadius={0.08} length={1.9} position={[0, 0, 0]} tone={currentWardrobe.skin} />
            <group position={[0, -2.1, 0.05]}>
                {currentWardrobe.shoes === 'boots' ? (
                   <group position={[0, 0.4, 0]}>
                      <mesh position={[0, 0.2, -0.05]} rotation={[0, 0, 0]}>
                         <cylinderGeometry args={[0.15, 0.12, 0.9, 16]} />
                         <FabricMaterial color="#3e2723" roughness={0.4} />
                      </mesh>
                      <DetailedFoot tone={currentWardrobe.skin} side="left" shoeType="boots" />
                   </group>
                ) : (
                   <DetailedFoot tone={currentWardrobe.skin} side="left" shoeType={currentWardrobe.shoes} />
                )}
            </group>
         </group>
      </group>

      <group position={[0.22, 1.9, 0]}>
         <ConnectedLimb topRadius={0.19} bottomRadius={0.14} length={1.7} position={[0, 0, 0]} tone={currentWardrobe.skin} />
         <group position={[0, -1.7, 0]}>
            <JointSphere radius={0.14} tone={currentWardrobe.skin} />
            <ConnectedLimb topRadius={0.13} bottomRadius={0.08} length={1.9} position={[0, 0, 0]} tone={currentWardrobe.skin} />
            <group position={[0, -2.1, 0.05]}>
                {currentWardrobe.shoes === 'boots' ? (
                   <group position={[0, 0.4, 0]}>
                      <mesh position={[0, 0.2, -0.05]} rotation={[0, 0, 0]}>
                         <cylinderGeometry args={[0.15, 0.12, 0.9, 16]} />
                         <FabricMaterial color="#3e2723" roughness={0.4} />
                      </mesh>
                      <DetailedFoot tone={currentWardrobe.skin} side="right" shoeType="boots" />
                   </group>
                ) : (
                   <DetailedFoot tone={currentWardrobe.skin} side="right" shoeType={currentWardrobe.shoes} />
                )}
            </group>
         </group>
      </group>

    </group>
  );
};