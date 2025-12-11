import { useDriveLedMode } from './utils';

export const DriveBay35 = ({ className = '', forceOff = false }: { className?: string; forceOff?: boolean }) => {
    const { mode, isAmberOn } = useDriveLedMode(forceOff);

    return (
        <div
            className={`h-12 bg-gray-900 border border-gray-700 rounded-sm shadow-inner flex items-center p-0 gap-0 overflow-hidden ${className}`}
        >
            {/* LEDs (Stacked) */}
            <div className="flex flex-col gap-1.5 pl-4">
                {/* Green LED (Power) - On in idle and reading modes */}
                <div
                    className={`w-1 h-1 rounded-full transition-all duration-300 ${mode !== 'off'
                        ? 'bg-green-500/60 shadow-[0_0_4px_rgba(34,197,94,0.6)]'
                        : 'bg-green-900/60'
                        }`}
                ></div>

                {/* Amber LED (Activity) - Blinking only in reading mode */}
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
