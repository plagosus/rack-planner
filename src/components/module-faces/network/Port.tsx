import { useEffect, useState } from 'react';

export const Port = ({ className = "w-4 h-4" }: { className?: string }) => {
    // 3 states: 'off', 'online' (linked), 'active' (transmitting)
    // Initialize random state to avoid unison effect
    const [status, setStatus] = useState<'off' | 'online' | 'active'>(() => {
        const rand = Math.random();
        if (rand > 0.95) return 'off'; // 5% chance starts unplugged
        if (rand > 0.6) return 'active';
        return 'online';
    });

    const [isAmberOn, setIsAmberOn] = useState(false);

    // State simulation loop
    useEffect(() => {
        if (status === 'off') {
            // Small chance to plug in
            if (Math.random() > 0.995) {
                // checking very rarely? No, need a timeout.
            }
            // For now, if off, stay off (simulation of unplugged). 
            // Or maybe randomly plug in? Let's keep it simple: if off, stay off for now.
            // Actually, user might want everything lit up. 
            // Let's make it so 'off' can transition to 'online' rarely.
            const timeout = setTimeout(() => {
                if (Math.random() > 0.9) setStatus('online'); // 10% chance to wake up every 5s logic below?
                // actually we shouldn't act if we return inside useEffect. 
            }, 5000);
            return () => clearTimeout(timeout);
        }

        // Toggle between online and active (traffic bursts)
        const duration = status === 'online'
            ? Math.random() * 5000 + 1000 // Stay idle 1-6s
            : Math.random() * 3000 + 500; // Burst 0.5-3.5s

        const timeoutId = setTimeout(() => {
            if (status === 'online') {
                setStatus('active');
            } else {
                setStatus('online');
            }
        }, duration);

        return () => clearTimeout(timeoutId);
    }, [status]);

    // Blinking logic for Amber LED (Active mode)
    useEffect(() => {
        if (status !== 'active') {
            setIsAmberOn(false);
            return;
        }

        let timeoutId: ReturnType<typeof setTimeout>;
        const toggleBlink = () => {
            const shouldBeOn = Math.random() > 0.3; // More activity than idle
            setIsAmberOn(shouldBeOn);
            // Very fast blinking for network activity
            timeoutId = setTimeout(toggleBlink, Math.random() * 100 + 20);
        };

        toggleBlink();
        return () => clearTimeout(timeoutId);
    }, [status]);

    return (
        <div className="flex flex-col items-center gap-[0px]">

            {/* Port */}
            <div className={`bg-black/80 rounded-[1px] border border-gray-600 shadow-inner ${className}`}>
                {/* LEDs */}
                <div className="flex justify-between w-full px-[1px]">
                    {/* Green LED: On when online or active */}
                    <div className={`w-0.75 h-0.75 rounded-[0.5px] transition-colors duration-200 ${status !== 'off'
                        ? 'bg-green-500/50 shadow-[0_0_2px_rgba(34,197,94,0.6)]'
                        : 'bg-green-900/60'
                        }`}></div>

                    {/* Amber LED: Blinking when active, Off otherwise */}
                    <div className={`w-0.75 h-0.75 rounded-[0.5px] transition-colors duration-50 ${isAmberOn
                        ? 'bg-amber-500/40 shadow-[0_0_2px_rgba(245,158,11,0.6)]'
                        : 'bg-amber-900/60'
                        }`}></div>
                </div></div>
        </div>
    );
};
