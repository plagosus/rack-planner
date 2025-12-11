export const UPSFace = ({ animationsEnabled = true, isPowered = true }: { animationsEnabled?: boolean; isPowered?: boolean }) => {
    return (
        <div className="flex items-center justify-between w-full h-full px-8 bg-gray-800 relative overflow-hidden">
            {/* LCD Screen Area - Left */}
            <div className="flex flex-col gap-1 z-10">
                <div className="w-24 h-10 bg-black rounded border-2 border-gray-600 flex items-center justify-center relative overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                    {/* Screen Content - Glowing Blue text */}
                    {isPowered ? (
                        <div className={`text-[10px] font-mono text-blue-400 drop-shadow-[0_0_2px_rgba(59,130,246,0.8)] flex flex-col items-center leading-tight opacity-90`}>
                            <span>OUTPUT</span>
                            <span className="text-sm font-bold">230V</span>
                        </div>
                    ) : (
                        <div className="w-full h-full bg-black"></div>
                    )}
                    {/* Screen Glare */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                </div>
            </div>

            {/* Status LEDs & Button - Center */}
            <div className="flex items-center gap-4 z-10">
                <div className="flex gap-2">
                    <div className="flex flex-col items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${isPowered ? 'bg-green-500 shadow-[0_0_4px_2px_rgba(34,197,94,0.4)]' : 'bg-green-900/50'} ${animationsEnabled && isPowered ? 'animate-pulse' : ''}`}></div>
                        <span className="text-[5px] text-gray-500 uppercase">Line</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-900/50 border border-yellow-900/20"></div>
                        <span className="text-[5px] text-gray-500 uppercase">Batt</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
