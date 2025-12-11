import type { RackWidth } from '../../../types';

export const PDUFace = ({ rackWidth = '19inch', isPowered = true }: { rackWidth?: RackWidth; isPowered?: boolean }) => {
    const outletCount = rackWidth === '10inch' ? 4 : 10;

    return (
        <div className="flex items-center gap-6 w-full justify-start px-4 overflow-hidden">
            {/* Power Switch Section */}
            <div className="flex items-center gap-3 border-r border-white/10 pr-6 shrink-0">
                <div className="relative">
                    {/* Switch Housing */}
                    <div className="w-10 h-6 bg-gray-800 rounded border border-gray-600 flex items-center px-1">
                        {/* Rocker Switch (On position) */}
                        <div className="w-4 h-5 bg-gray-600 rounded-sm shadow-inner flex items-center justify-center border-t border-gray-400">
                            <div className="w-2 h-0.5 bg-gray-900/50"></div>
                        </div>
                        <div className="w-4 h-5 bg-gray-900/50 rounded-sm border-b border-gray-950"></div>
                    </div>
                </div>

                {/* Indicator LED */}
                <div className="flex flex-col items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isPowered ? 'bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)] animate-pulse' : 'bg-red-900/50'}`}></div>
                    <span className="text-[6px] text-gray-400 font-mono tracking-wider">PWR</span>
                </div>
            </div>

            {/* Schuko Outlets */}
            <div className="flex items-center gap-8 overflow-hidden">
                {Array.from({ length: outletCount }).map((_, i) => (
                    <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center relative group shrink-0 rotate-45"
                    >
                        {/* Ground Clips (Top/Bottom) */}
                        <div className="absolute top-0 w-3 h-1.5 bg-gray-400 rounded-b-sm shadow-sm"></div>
                        <div className="absolute bottom-0 w-3 h-1.5 bg-gray-400 rounded-t-sm shadow-sm"></div>

                        {/* Socket Face (Recessed) */}
                        <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center shadow-inner relative">
                            {/* Pin Holes */}
                            <div className="flex gap-3">
                                <div className="w-1.5 h-1.5 bg-black rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"></div>
                                <div className="w-1.5 h-1.5 bg-black rounded-full shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"></div>
                            </div>

                            {/* Center Screw/Detail */}
                            <div className="absolute w-0.5 h-0.5 bg-gray-600 rounded-full opacity-50"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
