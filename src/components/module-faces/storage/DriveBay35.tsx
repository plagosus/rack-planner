import { useDriveLedMode } from './utils';

export const DriveBay35 = ({ className = '', forceOff = false, isPowered = true }: { className?: string; forceOff?: boolean; isPowered?: boolean }) => {
    const { mode, isAmberOn } = useDriveLedMode(forceOff || !isPowered);
    return (
        <div
            className={`h-12 bg-gray-900 border border-gray-700 rounded-sm shadow-inner flex items-center p-0 gap-0 overflow-hidden  ${className}`}
        >
            {/* LEDs (left side, vertical) */}
            <div className={`flex flex-col gap-1.5 pl-4`}>
                {/* Green LED (Power/Status) */}
                <div
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${mode !== 'off'
                        ? 'bg-green-500/80 shadow-[0_0_4px_rgba(34,197,94,0.8)]'
                        : 'bg-green-900/30'
                        }`}
                ></div>

                {/* Amber LED (Activity) */}
                <div
                    className={`w-1 h-1 rounded-full transition-all duration-75 ${isAmberOn
                        ? 'bg-amber-500/80 shadow-[0_0_4px_rgba(245,158,11,0.8)]'
                        : 'bg-amber-900/30'
                        }`}
                ></div>
            </div>
        </div>
    );
};
