import { useEffect, useState } from 'react';

export const DriveBay35 = ({ className = '', forceOff = false }: { className?: string; forceOff?: boolean }) => {
    const [mode, setMode] = useState<'off' | 'idle' | 'reading'>('idle');
    const [isAmberOn, setIsAmberOn] = useState(false);

    // Mode switching logic
    useEffect(() => {
        if (forceOff) {
            setMode('off');
            return;
        }

        if (mode === 'off') return;

        let timeoutId: ReturnType<typeof setTimeout>;

        if (mode === 'idle') {
            // Stay in idle for 5-20 seconds
            const duration = Math.random() * 25000 + 5000;
            timeoutId = setTimeout(() => {
                setMode('reading');
            }, duration);
        } else if (mode === 'reading') {
            // Stay in reading for up to 10 seconds (using 2-10s range for better effect)
            const duration = Math.random() * 8000 + 2000;
            timeoutId = setTimeout(() => {
                setMode('idle');
            }, duration);
        }

        return () => clearTimeout(timeoutId);
    }, [mode]);

    // Blinking logic (only active in 'reading' mode)
    useEffect(() => {
        if (mode !== 'reading') {
            setIsAmberOn(false);
            return;
        }

        let timeoutId: ReturnType<typeof setTimeout>;
        const toggleBlink = () => {
            // Randomly toggle blinking
            const shouldBeOn = Math.random() > 0.5;
            setIsAmberOn(shouldBeOn);

            // Schedule next toggle in 50-200ms
            timeoutId = setTimeout(toggleBlink, Math.random() * 150 + 50);
        };

        toggleBlink();

        return () => clearTimeout(timeoutId);
    }, [mode]);

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
