import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { Box, Wand2, RefreshCcw, Shirt, Scissors, Footprints, Crown, User, Palette } from 'lucide-react';
import { Doll3D } from './components/Doll3D';
import { Editor } from './components/Editor';
import { AppMode, WardrobeState } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.VIEW_3D);
  const [sourceImage, setSourceImage] = useState<string>("");
  
  // Wardrobe State
  const [wardrobe, setWardrobe] = useState<WardrobeState>({
    skin: 'fair',
    hair: 'blonde-bombshell',
    outfit: 'pink-gown',
    shoes: 'heels',
    accessory: 'silver-necklace',
    hat: 'none'
  });

  const toggleItem = (category: keyof WardrobeState, value: string) => {
    // @ts-ignore
    setWardrobe(prev => ({
      ...prev,
      [category]: prev[category] === value ? 'none' : value
    }));
  };

  const setItem = (category: keyof WardrobeState, value: string) => {
      // @ts-ignore
      setWardrobe(prev => ({...prev, [category]: value}));
  }

  return (
    <div className="h-screen w-full bg-[#0f0f11] text-white overflow-hidden flex flex-col">
      {/* Navbar */}
      <nav className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#131316] z-50 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-lg">B</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Barbie<span className="text-pink-500">Gen</span></h1>
        </div>

        <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => setMode(AppMode.VIEW_3D)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === AppMode.VIEW_3D 
                ? 'bg-gray-800 text-white shadow-sm' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Box size={16} />
            3D Wardrobe
          </button>
          <button
            onClick={() => setMode(AppMode.AI_EDITOR)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === AppMode.AI_EDITOR 
                ? 'bg-pink-600/20 text-pink-400 shadow-sm border border-pink-600/30' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Wand2 size={16} />
            AI Designer
          </button>
        </div>
        
        <div className="w-8"></div> {/* Spacer */}
      </nav>

      {/* Content */}
      <main className="flex-1 relative">
        
        {mode === AppMode.VIEW_3D && (
          <div className="h-full w-full relative">
            
            {/* Wardrobe UI Overlay - Left Side */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-10 scrollbar-hide">
               
               {/* Instructions */}
               <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl border border-white/10 max-w-xs shadow-xl">
                 <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                   <Scissors size={18} className="text-pink-400"/> Designer Studio
                 </h3>
                 <p className="text-xs text-gray-300">
                   Customize the exclusive high-fashion collection.
                 </p>
               </div>

               {/* Controls */}
               <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col gap-4 shadow-xl w-64">
                  
                  {/* Skin Tone */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1"><User size={12}/> Skin Tone</div>
                    <div className="flex gap-2">
                       <button onClick={() => setItem('skin', 'fair')} className={`w-8 h-8 rounded-full border-2 ${wardrobe.skin === 'fair' ? 'border-pink-500 scale-110' : 'border-transparent'} bg-[#fff5e6]`} title="Fair"></button>
                       <button onClick={() => setItem('skin', 'tan')} className={`w-8 h-8 rounded-full border-2 ${wardrobe.skin === 'tan' ? 'border-pink-500 scale-110' : 'border-transparent'} bg-[#e0ac69]`} title="Tan/Asian"></button>
                       <button onClick={() => setItem('skin', 'dark')} className={`w-8 h-8 rounded-full border-2 ${wardrobe.skin === 'dark' ? 'border-pink-500 scale-110' : 'border-transparent'} bg-[#8d5524]`} title="Dark/Black"></button>
                    </div>
                  </div>

                  {/* Hair */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Hairstyles</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setItem('hair', 'blonde-bombshell')}
                        className={`py-2 text-xs rounded border transition-all ${wardrobe.hair === 'blonde-bombshell' ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-yellow-500/50'}`}
                      >Blonde Bombshell</button>
                      <button 
                         onClick={() => setItem('hair', 'shawl-hair')}
                         className={`py-2 text-xs rounded border transition-all ${wardrobe.hair === 'shawl-hair' ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-yellow-500/50'}`}
                      >Shawl Hair</button>
                      <button 
                         onClick={() => setItem('hair', 'cute-bangs')}
                         className={`py-2 text-xs rounded border transition-all ${wardrobe.hair === 'cute-bangs' ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-yellow-500/50'}`}
                      >Cute Bangs</button>
                      <button 
                         onClick={() => setItem('hair', 'short-bob')}
                         className={`py-2 text-xs rounded border transition-all ${wardrobe.hair === 'short-bob' ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-yellow-500/50'}`}
                      >Short Bob</button>
                    </div>
                  </div>

                  {/* Outfit */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1"><Shirt size={12}/> Couture</div>
                    <div className="grid grid-cols-2 gap-2">
                       <button 
                         onClick={() => setItem('outfit', 'pink-gown')}
                         className={`p-2 text-xs rounded border transition-all ${wardrobe.outfit === 'pink-gown' ? 'bg-pink-600 border-pink-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-pink-500/50'}`}
                      >
                        Pink Gala Gown
                      </button>
                       <button 
                         onClick={() => setItem('outfit', 'blue-gown')}
                         className={`p-2 text-xs rounded border transition-all ${wardrobe.outfit === 'blue-gown' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-blue-500/50'}`}
                      >
                        Royal Blue
                      </button>
                       <button 
                         onClick={() => setItem('outfit', 'school-uniform')}
                         className={`p-2 text-xs rounded border transition-all ${wardrobe.outfit === 'school-uniform' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-indigo-500/50'}`}
                      >
                        School Uniform
                      </button>
                       <button 
                         onClick={() => setItem('outfit', 'white-lady')}
                         className={`p-2 text-xs rounded border transition-all ${wardrobe.outfit === 'white-lady' ? 'bg-gray-200 border-white text-gray-800' : 'bg-gray-800 border-gray-700 hover:border-white/50'}`}
                      >
                        White Ladylike
                      </button>
                    </div>
                  </div>
                  
                   {/* Hats */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1"><Crown size={12}/> Headwear</div>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => toggleItem('hat', 'beret')}
                         className={`flex-1 py-2 text-xs rounded border transition-all ${wardrobe.hat === 'beret' ? 'bg-red-900 border-red-700 text-white' : 'bg-gray-800 border-gray-700 hover:border-red-500/50'}`}
                      >Beret</button>
                       <button 
                         onClick={() => toggleItem('hat', 'sun-hat')}
                         className={`flex-1 py-2 text-xs rounded border transition-all ${wardrobe.hat === 'sun-hat' ? 'bg-yellow-200 border-yellow-100 text-black' : 'bg-gray-800 border-gray-700 hover:border-yellow-500/50'}`}
                      >Wide Hat</button>
                    </div>
                  </div>

                   {/* Shoes & Accessories */}
                  <div>
                    <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-1"><Footprints size={12}/> Shoes & Acc</div>
                    <div className="grid grid-cols-2 gap-2">
                       <button 
                         onClick={() => setItem('shoes', 'heels')}
                         className={`p-2 text-xs rounded border transition-all ${wardrobe.shoes === 'heels' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-purple-500/50'}`}
                      >High Heels</button>
                       <button 
                         onClick={() => setItem('shoes', 'sandals')}
                         className={`p-2 text-xs rounded border transition-all ${wardrobe.shoes === 'sandals' ? 'bg-orange-600 border-orange-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-orange-500/50'}`}
                      >Sandals</button>
                      <button 
                         onClick={() => setItem('shoes', 'boots')}
                         className={`p-2 text-xs rounded border transition-all ${wardrobe.shoes === 'boots' ? 'bg-amber-800 border-amber-700 text-white' : 'bg-gray-800 border-gray-700 hover:border-amber-500/50'}`}
                      >Boots</button>
                       <button 
                         onClick={() => setItem('shoes', 'sneakers')}
                         className={`p-2 text-xs rounded border transition-all ${wardrobe.shoes === 'sneakers' ? 'bg-teal-600 border-teal-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-teal-500/50'}`}
                      >Sneakers</button>
                      <button 
                         onClick={() => setItem('accessory', 'silver-necklace')}
                         className={`p-2 text-xs rounded border transition-all ${wardrobe.accessory === 'silver-necklace' ? 'bg-gray-600 border-gray-500 text-white' : 'bg-gray-800 border-gray-700 hover:border-gray-500/50'}`}
                      >Necklace</button>
                      <button 
                         onClick={() => setItem('accessory', 'pearls')}
                         className={`p-2 text-xs rounded border transition-all ${wardrobe.accessory === 'pearls' ? 'bg-gray-200 border-gray-100 text-black' : 'bg-gray-800 border-gray-700 hover:border-gray-500/50'}`}
                      >Pearls</button>
                    </div>
                  </div>
               </div>
            </div>
            
            <Canvas shadows camera={{ position: [0, 1.5, 9.5], fov: 35 }}>
              <color attach="background" args={['#1a1a1d']} />
              <ambientLight intensity={0.7} />
              <spotLight position={[5, 10, 5]} angle={0.4} penumbra={1} intensity={1.5} castShadow color="#fff0f5" />
              <pointLight position={[-5, 2, -5]} intensity={0.5} color="#e6e6fa" />
              <Environment preset="city" />
              
              <Suspense fallback={null}>
                 <Doll3D wardrobe={wardrobe} />
                 <ContactShadows position={[0, -5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000" />
              </Suspense>
              
              <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} target={[0, 0, 0]} />
            </Canvas>
          </div>
        )}

        {mode === AppMode.AI_EDITOR && (
          <Editor 
            sourceImage={sourceImage} 
            setSourceImage={setSourceImage} 
          />
        )}
      </main>
    </div>
  );
}