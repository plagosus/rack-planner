import React, { useState, useEffect, useRef } from 'react';
import {
    Server,
    Search,
    Moon,
    Sun,
    Trash2,
    Upload,
    GripVertical,
    Move,
    Pencil,
    Power,
} from 'lucide-react';
import type { ModuleType, RackModule, RackSettings, RackSlot, RackWidth } from './types';
import { ModuleFace } from './components/ModuleFace';
import { COLOR_OPTIONS } from './constants/colors';
import { PREDEFINED_MODULES } from './data/modules';

// --- Constants for Proportional Rendering ---
const U_PIXELS = 90;
const PIXELS_PER_INCH = U_PIXELS / 1.75;
const WIDTH_19_INCH = Math.round(19 * PIXELS_PER_INCH);
const WIDTH_10_INCH = Math.round(10 * PIXELS_PER_INCH);
const RAIL_WIDTH = Math.round(0.625 * PIXELS_PER_INCH);

export default function App() {
    const [rackSettings, setRackSettings] = useState<RackSettings>({
        heightU: 10,
        widthStandard: '19inch',
    });
    const [rackSlots, setRackSlots] = useState<RackSlot[]>([]);
    const [customLibrary, setCustomLibrary] = useState<RackModule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [scale, setScale] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) {
                return saved === 'dark';
            }
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });
    const [areAnimationsEnabled, setAreAnimationsEnabled] = useState(true);
    const [draggedItem, setDraggedItem] = useState<{
        module: RackModule;
        originalIndex?: number;
    } | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [libraryTab, setLibraryTab] = useState<'catalog' | 'custom'>('catalog');
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
    const [customName, setCustomName] = useState('');
    const [customU, setCustomU] = useState(1);
    const [customType, setCustomType] = useState<ModuleType>('generic');
    const [customColor, setCustomColor] = useState(COLOR_OPTIONS[0].value);
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [customShowName, setCustomShowName] = useState(true);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Handle Responsive Scaling
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerH = containerRef.current.clientHeight;
                const containerW = containerRef.current.clientWidth;

                const padding = 0; // p-8 removed
                const rackH = rackSettings.heightU * U_PIXELS + 32 + 16 + 50; // Roof(32) + Floor(16) + Buffer
                const rackW =
                    (rackSettings.widthStandard === '19inch' ? WIDTH_19_INCH : WIDTH_10_INCH) + 50; // Buffer

                const scaleH = (containerH - padding) / rackH;
                const scaleW = (containerW - padding) / rackW;

                // Fit to screen, but don't zoom in past 100%
                setScale(Math.min(1, scaleH, scaleW));
            }
        };

        window.addEventListener('resize', handleResize);
        // Call immediately and also after a short delay to ensure layout is settled
        handleResize();
        setTimeout(handleResize, 100);

        return () => window.removeEventListener('resize', handleResize);
    }, [rackSettings]);

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
                const parsedSlots: RackSlot[] = JSON.parse(savedSlots);

                // MIGRATION: Check if we need to migrate from 1U resolution to 0.5U resolution
                // Old format: length === initialHeight
                // New format: length === initialHeight * 2
                if (parsedSlots.length === initialHeight) {
                    console.log('Migrating rack slots to 0.5U resolution...');
                    const newSlots: RackSlot[] = [];

                    parsedSlots.forEach((oldSlot) => {
                        // Create 2 new slots for each old slot
                        // 1. Top Half (Original U position)
                        newSlots.push({
                            uPosition: oldSlot.uPosition,
                            moduleId: oldSlot.moduleId,
                            module: oldSlot.module,
                        });

                        // 2. Bottom Half (U position - 0.5)
                        newSlots.push({
                            uPosition: oldSlot.uPosition - 0.5,
                            moduleId: oldSlot.moduleId,
                            module: oldSlot.module,
                        });
                    });

                    setRackSlots(newSlots);
                } else if (parsedSlots.length > 0) {
                    setRackSlots(parsedSlots);
                } else {
                    initializeRack(initialHeight);
                }
            } else {
                initializeRack(initialHeight);
            }
        } catch (error) {
            console.error('Failed to load from localStorage', error);
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
        // Size is in U, but we need 2x slots for 0.5U resolution
        const numSlots = size * 2;
        const slots: RackSlot[] = Array.from({ length: numSlots }, (_, i) => ({
            // If size=10 (20 slots)
            // i=0 -> 10
            // i=1 -> 9.5
            // i=2 -> 9
            uPosition: size - i * 0.5,
            moduleId: null,
        }));
        setRackSlots(slots);
    };

    // Smart Resize Logic
    const updateRackHeight = (newHeight: number) => {
        if (isNaN(newHeight) || newHeight < 4 || newHeight > 52) return;

        const currentSlots = rackSlots.length;
        const targetSlots = newHeight * 2; // 0.5U resolution

        if (targetSlots === currentSlots) return;

        let updatedSlots: RackSlot[];

        if (targetSlots > currentSlots) {
            // Growing: Add slots to the TOP
            const slotsToAdd = targetSlots - currentSlots;

            // Generate new slots starting from newHeight down to (oldTop + 0.5)
            const newSlots: RackSlot[] = Array.from({ length: slotsToAdd }, (_, i) => ({
                uPosition: newHeight - i * 0.5,
                moduleId: null,
            }));
            updatedSlots = [...newSlots, ...rackSlots];
        } else {
            // Shrinking: Remove from TOP
            const slotsToRemoveCount = currentSlots - targetSlots;
            const slotsToRemove = rackSlots.slice(0, slotsToRemoveCount);

            // Safety check
            const hasModules = slotsToRemove.some((s) => s.moduleId !== null);
            if (hasModules) {
                if (
                    !confirm(
                        `Reducing size will remove modules in the top ${slotsToRemoveCount / 2}U. Continue?`
                    )
                ) {
                    return; // Abort
                }
            }
            updatedSlots = rackSlots.slice(slotsToRemoveCount);
        }

        setRackSettings((prev) => ({ ...prev, heightU: newHeight }));
        setRackSlots(updatedSlots);
    };

    // --- Drag and Drop Handlers ---

    // Helper: Check if a module can be dropped at targetIndex
    const checkCanDrop = (
        targetIndex: number,
        moduleUSize: number,
        originalIndex?: number
    ): boolean => {
        // Enforce 1U alignment for modules >= 1U
        // 0.5U modules can be placed anywhere (Odd or Even)
        if (moduleUSize >= 1 && targetIndex % 2 !== 0) return false;

        // Collision Check (calculate needed first)
        const slotsNeeded = moduleUSize * 2; // Resolution 0.5U

        // Boundary Check: If bottom of module goes beyond rack bottom
        if (targetIndex + slotsNeeded > rackSlots.length) {
            return false;
        }

        let originalModuleId: string | null = null;
        if (originalIndex !== undefined && rackSlots[originalIndex]) {
            originalModuleId = rackSlots[originalIndex].moduleId;
        }

        for (let i = 0; i < slotsNeeded; i++) {
            const slotIndex = targetIndex + i;
            if (slotIndex >= rackSlots.length) return false;

            const slot = rackSlots[slotIndex];
            if (slot.moduleId !== null) {
                // If it's occupied, check if it's the module we are currently moving
                if (originalModuleId && slot.moduleId === originalModuleId) {
                    continue; // Same module, safe.
                }
                return false; // Collision with another module
            }
        }
        return true;
    };

    const handleDragStart = (e: React.DragEvent, module: RackModule, originalIndex?: number) => {
        setDraggedItem({ module, originalIndex });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (!draggedItem) return;

        let targetIndex = index;
        const uSize = draggedItem.module.uSize;

        // Custom Logic based on U size
        if (uSize === 0.5) {
            // 0.5U Logic: Precise targeting for split slots
            // If over a merged empty 1U slot (Even index, next is empty), check sub-position
            if (index % 2 === 0) {
                const nextSlot = rackSlots[index + 1];
                if (nextSlot && rackSlots[index].moduleId === null && nextSlot.moduleId === null) {
                    // This is a merged empty 1U slot. Check cursor position.
                    const rect = e.currentTarget.getBoundingClientRect();
                    const offsetY = e.clientY - rect.top;
                    // If in bottom half
                    if (offsetY > rect.height / 2) {
                        targetIndex = index + 1;
                    }
                }
            }
        } else {
            // Whole Unit Logic: Snap to even/top alignment
            // If hovering over an Odd (Bottom) slot of a U, align to the Even (Top) slot above it
            if (index % 2 !== 0) {
                targetIndex = index - 1;
            }
        }

        setDragOverIndex(targetIndex);
    };

    const handleDrop = (e: React.DragEvent, eventIndex: number) => {
        e.preventDefault();

        // Prefer the calculated dragOverIndex for consistency with visual feedback
        const targetIndex = dragOverIndex !== null ? dragOverIndex : eventIndex;

        setDragOverIndex(null);

        if (!draggedItem) return;

        const { module, originalIndex } = draggedItem;
        const slotsNeeded = module.uSize * 2;

        if (!checkCanDrop(targetIndex, module.uSize, draggedItem?.originalIndex)) {
            // Visual feedback is shown during drag, but if they drop anyway, we just cancel.
            setDraggedItem(null);
            return;
        }

        // Proceed to place item
        const newSlots = [...rackSlots];

        // 1. Clear old position if moving
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

        // 2. Place item
        const instanceId =
            originalIndex !== undefined
                ? rackSlots[originalIndex!].moduleId!
                : `${module.id}-${Date.now()}`;

        for (let i = 0; i < slotsNeeded; i++) {
            newSlots[targetIndex + i] = {
                ...newSlots[targetIndex + i],
                moduleId: instanceId,
                module: module,
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

    const handleEditModule = (e: React.MouseEvent, module: RackModule) => {
        e.stopPropagation();
        setCustomName(module.name);
        setCustomU(module.uSize);
        setCustomType(module.type);
        setCustomColor(module.color || COLOR_OPTIONS[0].value);
        setCustomImage(module.image || null);
        setCustomShowName(module.showName !== false); // Default true
        setEditingModuleId(module.id);
        setLibraryTab('custom');
    };

    const cancelEdit = () => {
        setCustomName('');
        setCustomU(1);
        setCustomType('generic');
        setCustomColor(COLOR_OPTIONS[0].value);
        setCustomImage(null);
        setCustomShowName(true);
        setEditingModuleId(null);
    };

    const createOrUpdateCustomModule = () => {
        if (!customName) return;

        if (editingModuleId) {
            // Update existing
            const updatedModuleData = {
                name: customName,
                uSize: customU,
                type: customType,
                color: customColor,
                image: customImage || undefined,
                showName: customShowName,
            };

            const updatedLibrary = customLibrary.map((mod) =>
                mod.id === editingModuleId ? { ...mod, ...updatedModuleData } : mod
            );
            setCustomLibrary(updatedLibrary);

            // Update instances in rack
            const updatedRackSlots = rackSlots.map((slot) => {
                if (slot.module && slot.module.id === editingModuleId) {
                    return {
                        ...slot,
                        module: {
                            ...slot.module,
                            ...updatedModuleData,
                        },
                    };
                }
                return slot;
            });
            setRackSlots(updatedRackSlots);
        } else {
            // Create new
            const newMod: RackModule = {
                id: `custom-${Date.now()}`,
                name: customName,
                uSize: customU,
                type: customType,
                color: customColor,
                image: customImage || undefined,
                showName: customShowName,
            };
            setCustomLibrary([...customLibrary, newMod]);
        }

        cancelEdit(); // Resets form and editing state
        setLibraryTab('catalog');
    };

    const deleteCustomModule = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this custom module?')) {
            if (editingModuleId === id) {
                cancelEdit();
            }
            setCustomLibrary(customLibrary.filter((m) => m.id !== id));
        }
    };

    const clearRack = () => {
        if (confirm('Clear entire rack layout?')) {
            initializeRack(rackSettings.heightU);
        }
    };

    // Group modules by type for the library view
    const getGroupedModules = () => {
        const allModules = [...PREDEFINED_MODULES, ...customLibrary].filter((m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const groups: Record<string, RackModule[]> = {};
        const typeOrder: ModuleType[] = [
            'server',
            'storage',
            'network',
            'power',
            'accessory',
            'generic',
        ];

        // Initialize groups in specific order
        typeOrder.forEach((type) => (groups[type] = []));

        // Distribute modules
        allModules.forEach((m) => {
            if (!groups[m.type]) groups[m.type] = [];
            groups[m.type].push(m);
        });

        return groups;
    };

    // --- Visual Components ---

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
                        <h1 className="font-bold tracking-tight">
                            RackPlanner{' '}
                            <span className="text-xs font-normal opacity-60 ml-1">
                                v{__APP_VERSION__}
                            </span>
                        </h1>
                    </div>

                    <div className="flex gap-4">
                        {/* Rack Settings in Header */}
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded px-2 py-1 text-xs">
                            <span className="text-gray-500 font-medium">Size:</span>
                            <input
                                type="number"
                                min={4}
                                max={52}
                                value={rackSettings.heightU}
                                onChange={(e) => updateRackHeight(parseInt(e.target.value))}
                                className="w-12 bg-transparent border-b border-gray-400 text-center focus:outline-none"
                            />
                            <span className="text-gray-500 font-medium">U</span>
                            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                            <select
                                value={rackSettings.widthStandard}
                                onChange={(e) =>
                                    setRackSettings({
                                        ...rackSettings,
                                        widthStandard: e.target.value as RackWidth,
                                    })
                                }
                                className="bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer hover:text-indigo-500"
                            >
                                <option value="19inch">19"</option>
                                <option value="10inch">10" Mini</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setAreAnimationsEnabled(!areAnimationsEnabled)}
                            className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors ${areAnimationsEnabled ? 'text-green-500' : 'text-gray-400'}`}
                            title={
                                areAnimationsEnabled ? 'Disable Animations' : 'Enable Animations'
                            }
                        >
                            <Power size={18} />
                        </button>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-yellow-500 dark:text-indigo-400"
                        >
                            {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                        </button>
                    </div>
                </header>

                <main className="flex-1 flex">
                    {/* LEFT: Rack Editor */}

                    <section
                        ref={containerRef}
                        className="flex-1 relative overflow-hidden flex flex-col justify-center items-center bg-gray-200 dark:bg-[#0d1117] transition-colors max-h-[calc(100vh-56px)]"
                    >
                        {/* The Rack */}

                        <div
                            className="flex flex-col relative transition-all duration-500 ease-in-out shrink-0"
                            style={{
                                width:
                                    rackSettings.widthStandard === '19inch'
                                        ? WIDTH_19_INCH
                                        : WIDTH_10_INCH,

                                transform: `scale(${scale})`,

                                transformOrigin: 'center center',
                            }}
                        >
                            {/* Rack Roof */}
                            <div className="h-8 bg-gray-700 dark:bg-gray-800 rounded-t-sm flex items-center justify-center border-b border-gray-600 shadow-xl z-10 shrink-0">
                                <div className="w-1/3 h-2 bg-black/20 rounded-full"></div>
                            </div>

                            {/* Rails Container */}
                            <div className="flex flex-col relative w-full border-x border-gray-800 bg-[#1a1b26] shadow-2xl shrink-0 transition-all duration-300 ease-in-out">
                                {/* Static Background Rails - Fixed Visuals */}
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    {Array.from({ length: rackSettings.heightU }).map((_, i) => {
                                        const uNum = rackSettings.heightU - i;
                                        return (
                                            <div
                                                key={`rail-${uNum}`}
                                                style={{ height: U_PIXELS, top: i * U_PIXELS }}
                                                className="absolute w-full border-b border-gray-800/50"
                                            >
                                                {/* LEFT RAIL */}
                                                <div
                                                    className="absolute top-0 bottom-0 flex flex-col items-center"
                                                    style={{
                                                        left: `-${RAIL_WIDTH}px`,
                                                        width: `${RAIL_WIDTH}px`,
                                                    }}
                                                >
                                                    {/* Label */}
                                                    <div className="absolute top-0 flex items-center justify-center w-full h-full z-10">
                                                        <span className="text-[10px] text-gray-600 dark:text-gray-500 font-mono font-bold opacity-60">
                                                            {uNum}
                                                        </span>
                                                        <div className="absolute bottom-0 w-1/2 h-px bg-gray-400/30 dark:bg-gray-700"></div>
                                                    </div>
                                                </div>

                                                {/* Left Silver Bar (Mounting Rail) */}
                                                <div className="absolute left-[1px] top-0 bottom-0 w-4 bg-gray-300 dark:bg-gray-700 border-r border-gray-400/30 dark:border-gray-800/50 shadow-inner flex flex-col justify-between py-2 items-center overflow-hidden">
                                                    <div className="w-[8px] h-[8px] bg-black/80 rounded-[1px]" />
                                                    <div className="w-[8px] h-[8px] bg-black/80 rounded-[1px]" />
                                                    <div className="w-[8px] h-[8px] bg-black/80 rounded-[1px]" />
                                                </div>

                                                {/* RIGHT RAIL */}
                                                <div
                                                    className="absolute top-0 bottom-0 flex flex-col items-center"
                                                    style={{
                                                        right: `-${RAIL_WIDTH}px`,
                                                        width: `${RAIL_WIDTH}px`,
                                                    }}
                                                >
                                                    {/* Label */}
                                                    <div className="absolute top-0 flex items-center justify-center w-full h-full z-10">
                                                        <span className="text-[10px] text-gray-600 dark:text-gray-500 font-mono font-bold opacity-60">
                                                            {uNum}
                                                        </span>
                                                        <div className="absolute bottom-0 w-1/2 h-px bg-gray-400/30 dark:bg-gray-700"></div>
                                                    </div>
                                                </div>

                                                {/* Right Silver Bar (Mounting Rail) */}
                                                <div className="absolute right-[1px] top-0 bottom-0 w-4 bg-gray-300 dark:bg-gray-700 border-l border-gray-400/30 dark:border-gray-800/50 shadow-inner flex flex-col justify-between py-2 items-center overflow-hidden">
                                                    <div className="w-[8px] h-[8px] bg-black/80 rounded-[1px]" />
                                                    <div className="w-[8px] h-[8px] bg-black/80 rounded-[1px]" />
                                                    <div className="w-[8px] h-[8px] bg-black/80 rounded-[1px]" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {rackSlots.map((slot, index) => {
                                    const isOccupied = slot.moduleId !== null;
                                    const prevSlot = index > 0 ? rackSlots[index - 1] : null;
                                    const nextSlot =
                                        index < rackSlots.length - 1 ? rackSlots[index + 1] : null;

                                    // Module Logic
                                    const isModuleStart =
                                        isOccupied && prevSlot?.moduleId !== slot.moduleId;

                                    // 0.5U / Split Logic
                                    const isEvenIndex = index % 2 === 0; // Top of a U

                                    // Merging Logic for Empty Slots
                                    // We merge two empty 0.5U slots into one 1U slot ONLY if they are a Top/Bottom pair (Even/Odd).
                                    // If Top(Even) is empty AND Bottom(Odd) is empty -> Merge.

                                    let shouldRender = true;
                                    let renderedHeight = U_PIXELS; // Default 1U
                                    let isMergedEmpty = false;

                                    if (isOccupied) {
                                        if (isModuleStart) {
                                            renderedHeight = (slot.module?.uSize || 1) * U_PIXELS;
                                        } else {
                                            shouldRender = false; // Module parts are hidden/handled by start
                                        }
                                    } else {
                                        // Empty Slot Logic
                                        if (isEvenIndex) {
                                            // Top Slot
                                            const nextOccupied = nextSlot?.moduleId !== null;
                                            if (!nextOccupied) {
                                                // Both Top and Bottom are empty -> Merge
                                                renderedHeight = U_PIXELS; // 1U
                                                isMergedEmpty = true;
                                            } else {
                                                // Top is empty, Bottom is occupied -> Split look
                                                renderedHeight = U_PIXELS / 2; // 0.5U
                                            }
                                        } else {
                                            // Bottom Slot (Odd)
                                            const prevOccupied = prevSlot?.moduleId !== null;
                                            if (!prevOccupied) {
                                                // Top was empty, so it handled this slot in a merge -> Skip
                                                shouldRender = false;
                                            } else {
                                                // Top was occupied, so this Bottom Empty slot is independent
                                                renderedHeight = U_PIXELS / 2; // 0.5U
                                            }
                                        }
                                    }

                                    if (!shouldRender) return null;

                                    // Drag visual logic (Keep as is, but consider 0.5U)
                                    const uSize = draggedItem?.module.uSize || 1;
                                    const slotsNeeded = uSize * 2;

                                    // Drag Over Logic
                                    // With 0.5U support, we need precise drag targeting.
                                    // If dragging 0.5U, we respect the exact dragOverIndex.
                                    // If dragging 1U+, we might be snapping effectiveDragIndex to even.
                                    // BUT, checkCanDrop enforces Even for 1U+.
                                    // So dragOverIndex might be Odd, but we want to visualize the snap to Even?
                                    // Or does the UI expect user to mouse over Even?
                                    // Let's stick to accurate feedback: If user hovers Odd with 1U, it's invalid (Red).
                                    // So we don't snap effectiveDragIndex for validity, but maybe for visual alignment if we wanted to be helpful.
                                    // For now, strict feedback:

                                    const isValid =
                                        dragOverIndex !== null
                                            ? checkCanDrop(
                                                  dragOverIndex,
                                                  uSize,
                                                  draggedItem?.originalIndex
                                              )
                                            : true;
                                    // Specificity check:
                                    // If dragging 0.5U (slotsNeeded=1).
                                    // If dragOverIndex = Even (0). Range [0, 1). Match 0.
                                    // If dragOverIndex = Odd (1). Range [1, 2). Match 1. (But index is 0!)

                                    // Highlight Logic correction for Merged Slots
                                    let highlightStyle: React.CSSProperties = { inset: 0 };
                                    let showHighlight = false;

                                    if (dragOverIndex !== null) {
                                        if (isMergedEmpty) {
                                            // Merged Slot Logic (Even Index, covers Index & Index+1)

                                            // 1. Precise Target Highlight (Top/Bottom of this specific merged slot)
                                            if (dragOverIndex === index) {
                                                showHighlight = true;
                                                // If 0.5U, only top half. If 1U+, full inset.
                                                highlightStyle =
                                                    uSize === 0.5
                                                        ? {
                                                              top: 0,
                                                              height: '50%',
                                                              left: 0,
                                                              right: 0,
                                                          }
                                                        : { inset: 0 };
                                            } else if (
                                                uSize === 0.5 &&
                                                dragOverIndex === index + 1
                                            ) {
                                                // 0.5U dragging to bottom half
                                                showHighlight = true;
                                                highlightStyle = {
                                                    bottom: 0,
                                                    height: '50%',
                                                    left: 0,
                                                    right: 0,
                                                };
                                            }
                                            // 2. Multi-U Overlap Logic
                                            // If a module starts ABOVE this slot, does it extend into/over this slot?
                                            // Range: [dragOverIndex, dragOverIndex + slotsNeeded)
                                            // Current Slot Range: [index, index + 2) (Includes index and index+1)
                                            // If dragOverIndex < index AND (dragOverIndex + slotsNeeded) > index
                                            else if (
                                                dragOverIndex < index &&
                                                dragOverIndex + slotsNeeded > index
                                            ) {
                                                showHighlight = true;
                                                highlightStyle = { inset: 0 };
                                            }
                                        } else {
                                            // Standard Slot Logic
                                            // If this slot is within the drag target range
                                            if (
                                                index >= dragOverIndex &&
                                                index < dragOverIndex + slotsNeeded
                                            ) {
                                                showHighlight = true;
                                                highlightStyle = { inset: 0 };
                                            }
                                        }
                                    }

                                    const isMainDragTarget =
                                        dragOverIndex === index ||
                                        (isMergedEmpty && dragOverIndex === index + 1);

                                    return (
                                        <div
                                            key={index}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDrop={(e) => handleDrop(e, index)}
                                            className="relative flex w-full transition-colors"
                                            // Use renderedHeight.
                                            // NOTE: Module Start slot calculates full height.
                                            style={{
                                                height: renderedHeight,
                                                minHeight: renderedHeight,
                                            }}
                                        >
                                            {/* (Left Rail removed - rendered in background) */}

                                            {/* Slot Content */}
                                            <div className="flex-1 relative w-full h-full group">
                                                {/* Empty Slot Placeholder */}
                                                {!isOccupied && (
                                                    <div className="relative w-full h-full flex items-center justify-center border-b border-gray-400/20 dark:border-white/5">
                                                        <div className="text-gray-400/20 dark:text-white/10 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity select-none pointer-events-none">
                                                            Empty {slot.uPosition}{' '}
                                                            {isMergedEmpty ? 'U' : ''}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Occupied Module */}
                                                {isModuleStart && slot.module && (
                                                    <div
                                                        draggable="true"
                                                        onDragStart={(e) =>
                                                            handleDragStart(e, slot.module!, index)
                                                        }
                                                        className="absolute inset-x-0 inset-y-0 m-px z-10 cursor-grab active:cursor-grabbing shadow-sm group-hover:shadow-lg transition-all"
                                                    >
                                                        <div className="relative w-full h-full">
                                                            <ModuleFace
                                                                module={slot.module}
                                                                rackWidth={
                                                                    rackSettings.widthStandard
                                                                }
                                                                isPowered={areAnimationsEnabled}
                                                            />

                                                            {/* Hover Overlay Actions */}
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-end px-2 opacity-0 group-hover:opacity-100">
                                                                <div className="bg-black/80 text-white text-[10px] px-2 py-1 rounded shadow-lg backdrop-blur-md flex items-center gap-2">
                                                                    <GripVertical
                                                                        size={12}
                                                                        className="text-gray-400"
                                                                    />
                                                                    <span className="font-semibold">
                                                                        {slot.module.name}
                                                                    </span>
                                                                    <span className="text-gray-400 border-l border-gray-600 pl-2 ml-1">
                                                                        {slot.module.uSize}U
                                                                    </span>
                                                                    <button
                                                                        onClick={() => {
                                                                            const newSlots = [
                                                                                ...rackSlots,
                                                                            ];
                                                                            const idToDelete =
                                                                                slot.moduleId;
                                                                            for (
                                                                                let i = 0;
                                                                                i < newSlots.length;
                                                                                i++
                                                                            ) {
                                                                                if (
                                                                                    newSlots[i]
                                                                                        .moduleId ===
                                                                                    idToDelete
                                                                                ) {
                                                                                    newSlots[i] = {
                                                                                        ...newSlots[
                                                                                            i
                                                                                        ],
                                                                                        moduleId:
                                                                                            null,
                                                                                        module: undefined,
                                                                                    };
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
                                                {/* Drop Zone Indicator */}
                                                {showHighlight && (
                                                    <div
                                                        className={`absolute border-2 ${isValid ? 'border-indigo-500 bg-indigo-500/10' : 'border-red-500 bg-red-500/10'} z-30 pointer-events-none flex items-center justify-center`}
                                                        style={highlightStyle}
                                                    >
                                                        {isMainDragTarget && (
                                                            <span
                                                                className={`text-xs font-bold ${isValid ? 'text-indigo-500' : 'text-red-500'} bg-white dark:bg-gray-900 px-2 py-1 rounded shadow`}
                                                            >
                                                                {isValid
                                                                    ? `Mount Here (${uSize}U)`
                                                                    : 'Cannot Mount Here'}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* (Right Rail removed - rendered in background) */}
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
                    <aside className="w-96 bg-white dark:bg-gray-900 border-l border-gray-200 flex flex-col shadow-2xl z-30 shrink-0 overflow-hidden max-h-[calc(100vh-56px)]">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 dark:border-gray-800">
                            <button
                                onClick={() => setLibraryTab('catalog')}
                                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wide ${libraryTab === 'catalog' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                Parts Library
                            </button>
                            <button
                                onClick={() => {
                                    if (editingModuleId) cancelEdit();
                                    setLibraryTab('custom');
                                }}
                                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wide ${libraryTab === 'custom' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                {editingModuleId ? 'Edit Module' : 'Add Custom'}
                            </button>
                        </div>

                        {/* Catalog View */}
                        {libraryTab === 'catalog' && (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                                    <div className="relative">
                                        <Search
                                            className="absolute left-3 top-2.5 text-gray-400"
                                            size={14}
                                        />
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
                                                            onDragStart={(e) =>
                                                                handleDragStart(e, module)
                                                            }
                                                            className="group bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 cursor-grab hover:border-indigo-500 hover:shadow-md transition-all flex flex-col gap-2"
                                                        >
                                                            {/* Visual Preview */}
                                                            <div
                                                                className="w-full rounded overflow-hidden relative"
                                                                style={{
                                                                    height:
                                                                        module.uSize *
                                                                        U_PIXELS *
                                                                        0.5,
                                                                }}
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: '200%', // 100 / 0.5
                                                                        height:
                                                                            module.uSize * U_PIXELS,
                                                                        transform: 'scale(0.5)',
                                                                        transformOrigin: 'top left',
                                                                    }}
                                                                >
                                                                    <ModuleFace
                                                                        module={module}
                                                                        rackWidth="10inch"
                                                                        isPowered={false}
                                                                    />
                                                                </div>
                                                                {/* Draggable Hint */}
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                                    <Move
                                                                        className="text-white drop-shadow-md"
                                                                        size={16}
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Meta - Simplified */}
                                                            <div className="flex items-center justify-between px-1">
                                                                <div className="text-[10px] text-gray-700 dark:text-gray-300 font-medium leading-tight">
                                                                    {module.name}
                                                                </div>
                                                                {module.id.startsWith(
                                                                    'custom-'
                                                                ) && (
                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            onClick={(e) =>
                                                                                handleEditModule(
                                                                                    e,
                                                                                    module
                                                                                )
                                                                            }
                                                                            className="text-gray-400 hover:text-indigo-500"
                                                                        >
                                                                            <Pencil size={12} />
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) =>
                                                                                deleteCustomModule(
                                                                                    e,
                                                                                    module.id
                                                                                )
                                                                            }
                                                                            className="text-gray-400 hover:text-red-500"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {Object.values(getGroupedModules()).every(
                                        (g) => g.length === 0
                                    ) && (
                                        <div className="text-center p-4 text-gray-500 text-sm">
                                            No items found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Custom Creator View */}
                        {libraryTab === 'custom' && (
                            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">
                                        Item Name
                                    </label>
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500"
                                        placeholder="e.g. My Custom Server"
                                    />
                                    <div className="flex items-center gap-2 mt-1">
                                        <input
                                            type="checkbox"
                                            id="showName"
                                            checked={customShowName}
                                            onChange={(e) => setCustomShowName(e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label
                                            htmlFor="showName"
                                            className="text-xs text-gray-500 cursor-pointer select-none"
                                        >
                                            Show Name on Faceplate
                                        </label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">
                                            Height (U)
                                        </label>
                                        <select
                                            value={customU}
                                            onChange={(e) => setCustomU(Number(e.target.value))}
                                            className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded p-2 text-sm"
                                        >
                                            {[0.5, 1, 2, 3, 4, 5, 6, 8, 10].map((u) => (
                                                <option key={u} value={u}>
                                                    {u}U
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500">
                                            Type
                                        </label>
                                        <select
                                            value={customType}
                                            onChange={(e) =>
                                                setCustomType(e.target.value as ModuleType)
                                            }
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

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500">
                                        Color
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`w-8 h-8 rounded border border-gray-300 dark:border-gray-600 ${customColor}`}
                                        ></div>
                                        <select
                                            value={customColor}
                                            onChange={(e) => setCustomColor(e.target.value)}
                                            className="flex-1 bg-gray-100 dark:bg-gray-800 border-none rounded p-2 text-sm"
                                        >
                                            {COLOR_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500">
                                        Faceplate Image
                                    </label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-indigo-500 hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer overflow-hidden relative"
                                    >
                                        {customImage ? (
                                            <img
                                                src={customImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
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
                                    <p className="text-[10px] text-gray-500">
                                        Image will be cropped to fit the U-size aspect ratio.
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    {editingModuleId && (
                                        <button
                                            onClick={cancelEdit}
                                            className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-semibold shadow-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button
                                        onClick={createOrUpdateCustomModule}
                                        disabled={!customName}
                                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-sm font-semibold shadow-sm transition-colors"
                                    >
                                        {editingModuleId ? 'Update Module' : 'Save to Library'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="p-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                            <button
                                onClick={clearRack}
                                className="flex items-center justify-center gap-2 w-full py-1.5 text-red-500 hover:bg-red-500/10 rounded text-xs font-medium transition-colors"
                            >
                                <Trash2 size={12} /> Clear Rack
                            </button>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
}
