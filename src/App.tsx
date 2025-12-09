import React, { useState, useEffect, useRef } from 'react';
import { 
 Server, 
 Search, 
 Moon, 
 Sun, 
 Trash2,
 Upload,
 GripVertical,
 Move
} from 'lucide-react';

// --- Constants for Proportional Rendering ---
// Scaled up by 50% (Original was 60px/U)
const U_PIXELS = 90; 
const PIXELS_PER_INCH = U_PIXELS / 1.75;
const WIDTH_19_INCH = Math.round(19 * PIXELS_PER_INCH); 
const WIDTH_10_INCH = Math.round(10 * PIXELS_PER_INCH); 
const RAIL_WIDTH = Math.round(0.625 * PIXELS_PER_INCH); 

// --- Types ---
type ModuleType = 'server' | 'networking' | 'storage' | 'power' | 'accessory' | 'generic';
type RackWidth = '19inch' | '10inch';

interface RackModule {
 id: string;
 name: string;
 uSize: number;
 type: ModuleType;
 image?: string; // Data URL for custom image
 color?: string; // Tailwind color class or hex
}

interface RackSlot {
 uPosition: number;
 moduleId: string | null;
 module?: RackModule;
}

interface RackSettings {
 heightU: number;
 widthStandard: RackWidth;
}

// --- Mock Data ---
const PREDEFINED_MODULES: RackModule[] = [
 // Generics
 { id: 'gen-1u', name: 'Generic 1U', uSize: 1, type: 'generic', color: 'bg-gray-600' },
 { id: 'gen-2u', name: 'Generic 2U', uSize: 2, type: 'generic', color: 'bg-gray-600' },
 { id: 'gen-3u', name: 'Generic 3U', uSize: 3, type: 'generic', color: 'bg-gray-600' },

 // Servers
 { id: 'server-1u', name: 'Server 1U', uSize: 1, type: 'server', color: 'bg-gray-800' },
 { id: 'server-2u', name: 'Server 2U', uSize: 2, type: 'server', color: 'bg-gray-800' },
 { id: 'server-3u', name: 'Server 3U', uSize: 3, type: 'server', color: 'bg-gray-800' },
 { id: 'server-4u', name: 'Server 4U', uSize: 4, type: 'server', color: 'bg-gray-800' },

 // Storage
 { id: 'nas-1u', name: 'NAS 1U', uSize: 1, type: 'storage', color: 'bg-gray-700' },
 { id: 'nas-2u', name: 'NAS 2U', uSize: 2, type: 'storage', color: 'bg-gray-700' },
 { id: 'nas-3u', name: 'NAS 3U', uSize: 3, type: 'storage', color: 'bg-gray-700' },
 { id: 'nas-4u', name: '4U NAS Chassis', uSize: 4, type: 'storage', color: 'bg-gray-700' },

 // Networking
 { id: 'udm-pro', name: 'UniFi Dream Machine', uSize: 1, type: 'networking', color: 'bg-gray-200' },
 { id: 'switch-24', name: '24-Port Switch', uSize: 1, type: 'networking', color: 'bg-gray-800' },
 
 // Power
 { id: 'pdu-1u', name: 'PDU 1U', uSize: 1, type: 'power', color: 'bg-black' },

 // Accessories
 { id: 'patch-panel', name: 'Patch Panel', uSize: 1, type: 'accessory', color: 'bg-black' },
 { id: 'cable-man-1u', name: 'Cable Management 1U', uSize: 1, type: 'accessory', color: 'bg-gray-900' },
 { id: 'vent-1u', name: 'Vent 1U', uSize: 1, type: 'accessory', color: 'bg-gray-600' },
 { id: 'vent-2u', name: 'Vent 2U', uSize: 2, type: 'accessory', color: 'bg-gray-600' },
 { id: 'vent-3u', name: 'Vent 3U', uSize: 3, type: 'accessory', color: 'bg-gray-600' },
 { id: 'shelf', name: 'Shelf', uSize: 1, type: 'accessory', color: 'bg-gray-800' },
 { id: 'rpi-mount', name: 'Raspberry Pi Mount', uSize: 1, type: 'accessory', color: 'bg-green-800' },
];

export default function RackPlanner() {
 // --- State ---
 const [isDarkMode, setIsDarkMode] = useState(() => {
   if (typeof window !== 'undefined') {
     const saved = localStorage.getItem('darkMode');
     if (saved !== null) {
       return saved === 'true';
     }
     return window.matchMedia('(prefers-color-scheme: dark)').matches;
   }
   return true;
 });
 const [isLoading, setIsLoading] = useState(true);
 
 // Rack Configuration
 const [rackSettings, setRackSettings] = useState<RackSettings>({ heightU: 10, widthStandard: '10inch' });
 const [rackSlots, setRackSlots] = useState<RackSlot[]>([]);
 
 // Library State
 const [searchQuery, setSearchQuery] = useState('');
 const [libraryTab, setLibraryTab] = useState<'catalog' | 'custom'>('catalog');
 const [customLibrary, setCustomLibrary] = useState<RackModule[]>([]);

 // Drag State
 const [draggedItem, setDraggedItem] = useState<{ module: RackModule, originalIndex?: number } | null>(null);
 const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

 // Custom Form State
 const [customName, setCustomName] = useState('');
 const [customU, setCustomU] = useState(1);
 const [customType, setCustomType] = useState<ModuleType>('generic');
 const [customImage, setCustomImage] = useState<string | null>(null);

 const fileInputRef = useRef<HTMLInputElement>(null);

 // --- Persistence & Initialization ---

 // Handle Dark Mode
 useEffect(() => {
   console.log('Dark mode state changed:', isDarkMode);
   const root = window.document.documentElement;
   if (isDarkMode) {
     root.classList.add('dark');
     console.log('Added dark class to html');
   } else {
     root.classList.remove('dark');
     console.log('Removed dark class from html');
   }
   localStorage.setItem('darkMode', String(isDarkMode));
 }, [isDarkMode]);

 // Load from LocalStorage on mount
 useEffect(() => {
    try {
        const savedSettings = localStorage.getItem('rackSettings');
        const savedSlots = localStorage.getItem('rackSlots');
        const savedCustomLib = localStorage.getItem('customLibrary');

        let initialHeight = 10;

        if (savedSettings) {
            const parsedSettings = JSON.parse(savedSettings);
            if (parsedSettings.heightU > 0) {
                setRackSettings(parsedSettings);
                initialHeight = parsedSettings.heightU;
            }
        }

        if (savedCustomLib) {
            setCustomLibrary(JSON.parse(savedCustomLib));
        }

        if (savedSlots) {
            const parsedSlots = JSON.parse(savedSlots);
            if (parsedSlots.length > 0) {
                setRackSlots(parsedSlots);
            } else {
                initializeRack(initialHeight);
            }
        } else {
            initializeRack(initialHeight);
        }
    } catch (error) {
        console.error("Failed to load from localStorage", error);
        // If loading fails, initialize with defaults
        initializeRack(10);
    } finally {
        setIsLoading(false);
    }
 }, []);

 // Save to LocalStorage on changes
 useEffect(() => {
    if (!isLoading) {
        localStorage.setItem('rackSettings', JSON.stringify(rackSettings));
        localStorage.setItem('rackSlots', JSON.stringify(rackSlots));
        localStorage.setItem('customLibrary', JSON.stringify(customLibrary));
    }
 }, [rackSettings, rackSlots, customLibrary, isLoading]);

 // Initializer
 const initializeRack = (size: number) => {
 const slots: RackSlot[] = Array.from({ length: size }, (_, i) => ({
 uPosition: size - i, 
 moduleId: null
 }));
 setRackSlots(slots);
 };

 // Smart Resize Logic
 const updateRackHeight = (newHeight: number) => {
 if (isNaN(newHeight) || newHeight < 4 || newHeight > 52) return;
 
 const currentHeight = rackSlots.length;
 if (newHeight === currentHeight) return;

 let updatedSlots: RackSlot[];

 if (newHeight > currentHeight) {
 // Growing: Add slots to the TOP (beginning of array)
 const uDiff = newHeight - currentHeight;
 const newSlots: RackSlot[] = Array.from({ length: uDiff }, (_, i) => ({
 uPosition: newHeight - i, // New higher U numbers
 moduleId: null
 }));
 updatedSlots = [...newSlots, ...rackSlots];
 } else {
 // Shrinking: Remove from TOP (beginning of array)
 const uDiff = currentHeight - newHeight;
 const slotsToRemove = rackSlots.slice(0, uDiff);
 
 // Safety check
 const hasModules = slotsToRemove.some(s => s.moduleId !== null);
 if (hasModules) {
 if (!confirm(`Reducing size will remove modules in the top ${uDiff}U. Continue?`)) {
 return; // Abort
 }
 }
 updatedSlots = rackSlots.slice(uDiff);
 }

 setRackSettings(prev => ({ ...prev, heightU: newHeight }));
 setRackSlots(updatedSlots);
 };

 // --- Drag and Drop Handlers ---

 const handleDragStart = (e: React.DragEvent, module: RackModule, originalIndex?: number) => {
 setDraggedItem({ module, originalIndex });
 e.dataTransfer.effectAllowed = 'move';
 };

 const handleDragOver = (e: React.DragEvent, index: number) => {
 e.preventDefault(); 
 e.dataTransfer.dropEffect = 'move';
 setDragOverIndex(index);
 };

 const handleDrop = (e: React.DragEvent, targetIndex: number) => {
 e.preventDefault();
 setDragOverIndex(null);

 if (!draggedItem) return;

 const { module, originalIndex } = draggedItem;
 const slotsNeeded = module.uSize;

 // Boundary Check
 if (targetIndex - slotsNeeded + 1 < 0) {
 alert(`Not enough space at top for a ${slotsNeeded}U module.`);
 setDraggedItem(null);
 return;
 }

 // Collision Check
 const newSlots = [...rackSlots];

 // 1. If moving, clear old position first
 if (originalIndex !== undefined) {
 const originalId = newSlots[originalIndex].moduleId;
 if (originalId) {
 for (let i = 0; i < newSlots.length; i++) {
 if (newSlots[i].moduleId === originalId) {
 newSlots[i] = { ...newSlots[i], moduleId: null, module: undefined };
 }
 }
 }
 }

 // 2. Check for collisions
 let collision = false;
 for (let i = 0; i < slotsNeeded; i++) {
 if (newSlots[targetIndex - i].moduleId !== null) {
 collision = true;
 break;
 }
 }

 if (collision) {
 alert("Space is occupied.");
 setDraggedItem(null);
 return;
 }

 // 3. Place item
 const instanceId = originalIndex !== undefined 
 ? rackSlots[originalIndex!].moduleId! 
 : `${module.id}-${Date.now()}`;

 for (let i = 0; i < slotsNeeded; i++) {
 newSlots[targetIndex - i] = {
 ...newSlots[targetIndex - i],
 moduleId: instanceId,
 module: module
 };
 }

 setRackSlots(newSlots);
 setDraggedItem(null);
 };

 // --- Handlers ---
 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) {
 const reader = new FileReader();
 reader.onloadend = () => {
 setCustomImage(reader.result as string);
 };
 reader.readAsDataURL(file);
 }
 };

 const createCustomModule = () => {
 if (!customName) return;
 const newMod: RackModule = {
 id: `custom-${Date.now()}`,
 name: customName,
 uSize: customU,
 type: customType,
 color: 'bg-indigo-900',
 image: customImage || undefined
 };
 setCustomLibrary([...customLibrary, newMod]);
 setCustomName('');
 setCustomImage(null);
 setLibraryTab('catalog');
 };

 const deleteCustomModule = (e: React.MouseEvent, id: string) => {
 e.stopPropagation();
 setCustomLibrary(customLibrary.filter(m => m.id !== id));
 };

 const clearRack = () => {
 if(confirm("Clear entire rack layout?")) {
 initializeRack(rackSettings.heightU);
 }
 };

 // Group modules by type for the library view
 const getGroupedModules = () => {
 const allModules = [...PREDEFINED_MODULES, ...customLibrary].filter(m => 
 m.name.toLowerCase().includes(searchQuery.toLowerCase())
 );
 
 const groups: Record<string, RackModule[]> = {};
 const typeOrder: ModuleType[] = ['server', 'storage', 'networking', 'power', 'accessory', 'generic'];
 
 // Initialize groups in specific order
 typeOrder.forEach(type => groups[type] = []);
 
 // Distribute modules
 allModules.forEach(m => {
 if (!groups[m.type]) groups[m.type] = [];
 groups[m.type].push(m);
 });

 return groups;
 };

 // --- Visual Components ---

 const ModuleFace = ({ module, className = "" }: { module: RackModule, className?: string }) => {
 const hasImage = !!module.image;
 
 // Simple visual helpers based on type/name
 const isVent = module.name.toLowerCase().includes('vent');
 
 return (
 <div 
 className={`w-full h-full relative overflow-hidden flex items-center justify-center border-y border-white/10 shadow-inner ${module.color || 'bg-gray-700'} ${className}`}
 style={hasImage ? { 
 backgroundImage: `url(${module.image})`, 
 backgroundSize: 'cover',
 backgroundPosition: 'center'
 } : {}}
 >
 {!hasImage && (
 <div className="flex flex-col items-center opacity-80 pointer-events-none w-full px-4">
 <span className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">{module.name.substring(0, 18)}</span>
 
 {/* Visual Features based on Type */}
 <div className="flex gap-2 w-full justify-center">
 
 {/* Networking: Ports */}
 {module.type === 'networking' && (
 <div className="flex gap-1">
 {[1,2,3,4,5,6].map(i => <div key={i} className="w-3 h-3 bg-black/80 rounded-sm border border-gray-600 shadow-inner"></div>)}
 </div>
 )}

 {/* Server: Indicators or Drive Bays */}
 {module.type === 'server' && (
 <div className="flex items-center gap-2">
 <div className="flex flex-col gap-0.5">
 <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
 <div className="w-1 h-1 rounded-full bg-blue-500"></div>
 </div>
 <div className="w-20 h-1.5 bg-black/50 rounded-full"></div>
 <div className="flex gap-0.5">
 {[1,2,3].map(i => <div key={i} className="w-4 h-6 border border-black/30 bg-black/10 rounded-sm"></div>)}
 </div>
 </div>
 )}

 {/* Storage: Drive Arrays */}
 {module.type === 'storage' && (
 <div className="flex gap-0.5">
 {[1,2,3,4,5,6].map(i => (
 <div key={i} className="w-3 h-full min-h-[12px] border border-black/40 bg-black/20 rounded-sm flex flex-col items-center pt-0.5">
 <div className="w-1.5 h-0.5 bg-green-900 mb-0.5"></div>
 <div className="w-full h-px bg-black/30 mt-auto mb-1"></div>
 </div>
 ))}
 </div>
 )}

 {/* Power: Switch/Outlets */}
 {module.type === 'power' && (
 <div className="flex items-center gap-4 w-full justify-between px-2">
 <div className="w-4 h-3 bg-red-800 border border-red-900 rounded-sm flex items-center justify-center">
 <div className="w-2 h-0.5 bg-red-400"></div>
 </div>
 <div className="flex gap-2">
 {[1,2,3].map(i => <div key={i} className="w-4 h-4 bg-black rounded-full border border-gray-700"></div>)}
 </div>
 </div>
 )}

 {/* Vents: Horizontal Lines */}
 {isVent && (
 <div className="flex flex-col gap-1 w-full opacity-30">
 {[1,2,3].map(i => <div key={i} className="w-full h-0.5 bg-black rounded-full"></div>)}
 </div>
 )}

 </div>
 </div>
 )}
 
 {/* Bolt Holes Visuals - Adjusted for scale */}
 <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col gap-2">
 <div className="w-2 h-2 rounded-full bg-black/50 shadow-inner"></div>
 <div className="w-2 h-2 rounded-full bg-black/50 shadow-inner"></div>
 </div>
 <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-2">
 <div className="w-2 h-2 rounded-full bg-black/50 shadow-inner"></div>
 <div className="w-2 h-2 rounded-full bg-black/50 shadow-inner"></div>
 </div>
 </div>
 );
 };

   if (isLoading) {
     return (
       <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
         Loading Rack Planner...
       </div>
     );
   }

 return (
 <div className="h-screen w-full overflow-hidden flex flex-col">
 <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
 
 {/* Header */}
 <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-4 z-20 shrink-0">
 <div className="flex items-center gap-3">
 <div className="p-1.5 bg-indigo-600 rounded-md">
 <Server className="text-white" size={20} />
 </div>
 <h1 className="font-bold tracking-tight">RackPlanner <span className="text-xs font-normal opacity-60 ml-1">Beta</span></h1>
 </div>
 
 <div className="flex gap-4">
 {/* Rack Settings in Header */}
 <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-xs">
 <span className="text-gray-500 font-medium">Size:</span>
 <input 
 type="number" 
 min={4} max={52} 
 value={rackSettings.heightU}
 onChange={(e) => updateRackHeight(parseInt(e.target.value))}
 className="w-12 bg-transparent border-b border-gray-400 text-center focus:outline-none"
 />
 <span className="text-gray-500 font-medium">U</span>
 <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
 <select 
 value={rackSettings.widthStandard}
 onChange={(e) => setRackSettings({...rackSettings, widthStandard: e.target.value as RackWidth})}
 className="bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer hover:text-indigo-500"
 >
 <option value="19inch">19"</option>
 <option value="10inch">10" Mini</option>
 </select>
 </div>
 </div>

 <div className="flex items-center gap-2">
 <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-yellow-500 dark:text-indigo-400">
 {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
 </button>
 </div>
 </header>

 <main className="flex-1 flex overflow-hidden">
 
 {/* LEFT: Rack Editor */}
 <section className="flex-1 relative overflow-auto p-8 flex justify-center bg-gray-200 dark:bg-[#0d1117] transition-colors">
 
 {/* The Rack */}
 <div 
 className="flex flex-col relative transition-all duration-500 ease-in-out shrink-0"
 style={{ 
 width: rackSettings.widthStandard === '19inch' ? WIDTH_19_INCH : WIDTH_10_INCH 
 }}
 >
 {/* Rack Roof */}
 <div className="h-8 bg-gray-700 dark:bg-gray-800 rounded-t-sm flex items-center justify-center border-b border-gray-600 shadow-xl z-10 shrink-0">
 <div className="w-1/3 h-2 bg-black/20 rounded-full"></div>
 </div>

 {/* Rails Container */}
 <div 
 className="bg-gray-300 dark:bg-[#12151a] border-gray-400 dark:border-[#21262d] relative shadow-2xl flex flex-col shrink-0"
 style={{ 
 borderLeftWidth: RAIL_WIDTH, 
 borderRightWidth: RAIL_WIDTH 
 }}
 >
 {rackSlots.map((slot, index) => {
 const isOccupied = slot.moduleId !== null;
 
 // Helper: Is this slot the TOP-most slot of a module?
 const prevSlot = index > 0 ? rackSlots[index - 1] : null;
 const isModuleStart = isOccupied && (prevSlot?.moduleId !== slot.moduleId);
 const isModulePart = isOccupied && !isModuleStart;

 // Drag Over styling
 const isDragTarget = dragOverIndex === index;
 
 // Calculate height if start
 const moduleHeight = isModuleStart ? (slot.module?.uSize || 1) * U_PIXELS : U_PIXELS; 

 return (
 <div 
 key={index}
 onDragOver={(e) => handleDragOver(e, index)}
 onDrop={(e) => handleDrop(e, index)}
 className={`relative flex w-full transition-colors ${
 isDragTarget ? 'bg-indigo-500/20 z-20' : ''
 }`}
 style={{ height: isModulePart ? 0 : moduleHeight }} // Collapse covered slots
 >
 {/* Left Rail Indicators */}
 <div 
 className="absolute top-0 bottom-0 flex flex-col items-center w-full"
 style={{ left: `-${RAIL_WIDTH}px`, width: `${RAIL_WIDTH}px` }}
 >
 {/* Render U numbers for occupied or empty. 
 If occupied (isModuleStart), we iterate through all Us it covers. 
 If empty, we just render one. 
 */}
 {(isModuleStart && slot.module) ? (
 // Render multiple U numbers for multi-U items
 Array.from({ length: slot.module.uSize }).map((_, i) => (
 <div key={i} style={{ height: U_PIXELS }} className="flex items-center justify-center w-full">
 <span className="text-[10px] text-gray-600 dark:text-gray-500 font-mono font-bold opacity-60">
 {slot.uPosition - i}
 </span>
 </div>
 ))
 ) : !isOccupied && !isModulePart && (
 // Render single U number for empty slot
 <div style={{ height: U_PIXELS }} className="flex items-center justify-center w-full">
 <span className="text-[10px] text-gray-600 dark:text-gray-500 font-mono font-bold opacity-60">
 {slot.uPosition}
 </span>
 </div>
 )}
 </div>

 {/* Slot Content */}
 <div className="flex-1 relative w-full h-full group">
 
 {/* Empty Slot Placeholder */}
 {!isOccupied && !isModulePart && (
 <div className="w-full border-b border-gray-400/20 dark:border-white/5 flex items-center justify-center" style={{ height: U_PIXELS }}>
 <div className="text-gray-400/20 dark:text-white/10 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity select-none pointer-events-none">
 Empty {slot.uPosition}U
 </div>
 </div>
 )}

 {/* Occupied Module */}
 {isModuleStart && slot.module && (
 <div 
 draggable="true"
 onDragStart={(e) => handleDragStart(e, slot.module!, index)}
 className="absolute inset-x-0 inset-y-0 m-px z-10 cursor-grab active:cursor-grabbing shadow-sm group-hover:shadow-lg transition-all"
 >
 <div className="relative w-full h-full">
 <ModuleFace module={slot.module} />
 
 {/* Hover Overlay Actions */}
 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-end px-2 opacity-0 group-hover:opacity-100">
 <div className="bg-black/80 text-white text-[10px] px-2 py-1 rounded shadow-lg backdrop-blur-md flex items-center gap-2">
 <GripVertical size={12} className="text-gray-400" />
 <span className="font-semibold">{slot.module.name}</span>
 <span className="text-gray-400 border-l border-gray-600 pl-2 ml-1">{slot.module.uSize}U</span>
 <button 
 onClick={() => {
 const newSlots = [...rackSlots];
 const idToDelete = slot.moduleId;
 for(let i=0; i<newSlots.length; i++) {
 if(newSlots[i].moduleId === idToDelete) {
 newSlots[i] = {...newSlots[i], moduleId: null, module: undefined};
 }
 }
 setRackSlots(newSlots);
 }}
 className="ml-2 p-1 hover:text-red-400 transition-colors"
 >
 <Trash2 size={12} />
 </button>
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Drop Zone Indicator */}
 {isDragTarget && (
 <div className="absolute inset-0 border-2 border-indigo-500 bg-indigo-500/10 z-30 pointer-events-none flex items-center justify-center">
 <span className="text-xs font-bold text-indigo-500 bg-white dark:bg-gray-900 px-2 py-1 rounded shadow">
 Drop Here ({draggedItem?.module.uSize}U)
 </span>
 </div>
 )}

 </div>

 {/* Right Rail */}
 <div 
 className="absolute top-0 bottom-0"
 style={{ right: `-${RAIL_WIDTH}px`, width: `${RAIL_WIDTH}px` }}
 ></div>
 </div>
 );
 })}
 </div>

 {/* Floor */}
 <div className="h-4 bg-gray-800 rounded-b-lg shadow-lg z-10 shrink-0"></div>
 <div className="absolute -bottom-6 left-4 right-4 h-4 bg-black/30 blur-xl"></div>
 </div>
 </section>

 {/* RIGHT: Library Sidebar */}
 <aside className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-2xl z-30 shrink-0">
 
 {/* Tabs */}
 <div className="flex border-b border-gray-200 dark:border-gray-800">
 <button 
 onClick={() => setLibraryTab('catalog')} 
 className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wide ${libraryTab === 'catalog' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
 >
 Parts Library
 </button>
 <button 
 onClick={() => setLibraryTab('custom')} 
 className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wide ${libraryTab === 'custom' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
 >
 Add Custom
 </button>
 </div>

 {/* Catalog View */}
 {libraryTab === 'catalog' && (
 <div className="flex-1 flex flex-col overflow-hidden">
 <div className="p-3 border-b border-gray-200 dark:border-gray-800">
 <div className="relative">
 <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
 <input 
 type="text" 
 placeholder="Search parts..." 
 className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-md pl-9 pr-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 />
 </div>
 </div>

 <div className="flex-1 overflow-y-auto p-3 space-y-4">
 {Object.entries(getGroupedModules()).map(([type, modules]) => {
 if (modules.length === 0) return null;
 return (
 <div key={type}>
 <h3 className="sticky top-0 bg-white dark:bg-gray-900 z-10 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
 {type}
 </h3>
 <div className="space-y-2">
 {modules.map((module) => (
 <div 
 key={module.id}
 draggable="true"
 onDragStart={(e) => handleDragStart(e, module)}
 className="group bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 cursor-grab hover:border-indigo-500 hover:shadow-md transition-all flex flex-col gap-2"
 >
 {/* Visual Preview */}
 <div className="h-10 w-full rounded overflow-hidden relative">
 <ModuleFace module={module} />
 {/* Draggable Hint */}
 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
 <Move className="text-white drop-shadow-md" size={16} />
 </div>
 </div>
 
 {/* Meta - Simplified */}
 <div className="flex items-center justify-between px-1">
 <div className="text-[10px] text-gray-700 dark:text-gray-300 font-medium leading-tight">
 {module.name}
 </div>
 {module.id.startsWith('custom-') && (
 <button onClick={(e) => deleteCustomModule(e, module.id)} className="text-gray-400 hover:text-red-500">
 <Trash2 size={12} />
 </button>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 );
 })}
 
 {Object.values(getGroupedModules()).every(g => g.length === 0) && (
 <div className="text-center p-4 text-gray-500 text-sm">No items found</div>
 )}
 </div>
 </div>
 )}

 {/* Custom Creator View */}
 {libraryTab === 'custom' && (
 <div className="flex-1 overflow-y-auto p-4 space-y-5">
 <div className="space-y-1">
 <label className="text-xs font-medium text-gray-500">Item Name</label>
 <input 
 type="text" 
 value={customName}
 onChange={(e) => setCustomName(e.target.value)}
 className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500"
 placeholder="e.g. My Custom Server"
 />
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div className="space-y-1">
 <label className="text-xs font-medium text-gray-500">Height (U)</label>
 <select 
 value={customU}
 onChange={(e) => setCustomU(Number(e.target.value))}
 className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded p-2 text-sm"
 >
 {[1,2,3,4,5,6,8,10].map(u => <option key={u} value={u}>{u}U</option>)}
 </select>
 </div>
 <div className="space-y-1">
 <label className="text-xs font-medium text-gray-500">Type</label>
 <select 
 value={customType}
 onChange={(e) => setCustomType(e.target.value as ModuleType)}
 className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded p-2 text-sm"
 >
 <option value="generic">Generic</option>
 <option value="server">Server</option>
 <option value="networking">Networking</option>
 <option value="storage">Storage</option>
 <option value="power">Power</option>
 <option value="accessory">Accessory</option>
 </select>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-xs font-medium text-gray-500">Faceplate Image</label>
 <div 
 onClick={() => fileInputRef.current?.click()}
 className="h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-indigo-500 hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer overflow-hidden relative"
 >
 {customImage ? (
 <img src={customImage} alt="Preview" className="w-full h-full object-cover" />
 ) : (
 <>
 <Upload size={20} className="mb-1" />
 <span className="text-[10px]">Upload Image</span>
 </>
 )}
 </div>
 <input 
 type="file" 
 ref={fileInputRef} 
 className="hidden" 
 accept="image/*"
 onChange={handleImageUpload}
 />
 <p className="text-[10px] text-gray-500">Image will be cropped to fit the U-size aspect ratio.</p>
 </div>

 <button 
 onClick={createCustomModule}
 disabled={!customName}
 className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-semibold shadow-sm transition-colors"
 >
 Save to Library
 </button>
 </div>
 )}
 
 <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
 <button onClick={clearRack} className="flex items-center justify-center gap-2 w-full py-1.5 text-red-500 hover:bg-red-500/10 rounded text-xs font-medium transition-colors">
 <Trash2 size={12} /> Clear Rack
 </button>
 </div>
 </aside>

 </main>
 </div>
 </div>
 );
}