import { useEffect, useState } from 'react';

export const calculateOffThreshold = (totalDrives: number) => {
    // Keep at least 3 drives active (idle/reading), unless total drives is small (handled by Math.max logic implicitly if total < 3? No, wait)
    // The requirement was: "keep at least 2 drives on idle". The user last changed it to Math.max(3, ...). I will stick to 3.
    return Math.max(3, Math.floor(totalDrives * 0.8));
};

export const useDriveLedMode = (forceOff: boolean = false) => {
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
    }, [mode, forceOff]);

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

    return { mode, isAmberOn };
};
