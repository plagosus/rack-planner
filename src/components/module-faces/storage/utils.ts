import { useEffect, useState } from 'react';

export const calculateOffThreshold = (totalDrives: number) => {
    // Keep at least 3 drives active (idle/reading), unless total drives is small
    return Math.max(3, Math.floor(totalDrives * 0.8));
};

export const useDriveLedMode = (forceOff: boolean = false) => {
    const [internalMode, setInternalMode] = useState<'idle' | 'reading'>('idle');
    const [isAmberOn, setIsAmberOn] = useState(false);

    const mode = forceOff ? 'off' : internalMode;

    // Mode switching logic
    useEffect(() => {
        if (forceOff) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        // If explicitly in off state (not forced), we shouldn't be here if we only use internalMode 'idle' | 'reading'
        // But for safety/completeness of logic flow:

        if (internalMode === 'idle') {
            // Stay in idle for 5-20 seconds
            const duration = Math.random() * 25000 + 5000;
            timeoutId = setTimeout(() => {
                setInternalMode('reading');
            }, duration);
        } else if (internalMode === 'reading') {
            // Stay in reading for up to 10 seconds
            const duration = Math.random() * 8000 + 2000;
            timeoutId = setTimeout(() => {
                setInternalMode('idle');
            }, duration);
        }

        return () => clearTimeout(timeoutId);
    }, [internalMode, forceOff]);

    // Blinking logic (only active in 'reading' mode)
    useEffect(() => {
        if (mode !== 'reading') {
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

    return {
        mode,
        isAmberOn: mode === 'reading' && isAmberOn,
    };
};
