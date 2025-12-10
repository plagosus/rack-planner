export const UPSFace = () => {
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
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.6)] animate-pulse"></div>
                    <span className="text-[6px] text-gray-400 font-mono tracking-wider">PWR</span>
                </div>
            </div>
            {/* No outlets for UPS */}
        </div>
    );
};
