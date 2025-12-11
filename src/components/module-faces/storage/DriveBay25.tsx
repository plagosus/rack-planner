import { useDriveLedMode } from './utils';

export const DriveBay25 = ({ className = '', forceOff = false, animationsEnabled, isPowered = true }: { className?: string; forceOff?: boolean; animationsEnabled?: boolean; isPowered?: boolean }) => {
    const { mode, isAmberOn } = useDriveLedMode(forceOff || !isPowered, animationsEnabled);

    return (
        <div
            className={`w-10 h-32 bg-gray-900 border border-gray-700 rounded-sm shadow-inner flex flex-col items-center justify-start p-1 gap-2 ${className}`}
        >
            {/* LEDs (Horizontal on top) */}
            <div className="flex gap-1.5 pt-1">
                {/* Green LED (Power) */}
                <div
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${mode !== 'off'
                        ? 'bg-green-500/60 shadow-[0_0_4px_rgba(34,197,94,0.6)]'
                        : 'bg-green-900/60'
                        }`}
                ></div>

                {/* Amber LED (Activity) */}
                <div
                    className={`w-1 h-1 rounded-full transition-all duration-75 ${isAmberOn
                        ? 'bg-amber-500/40 shadow-[0_0_3px_rgba(245,158,11,0.5)]'
                        : 'bg-amber-900/60'
                        }`}
                ></div>
            </div>
        </div>
    );
};
