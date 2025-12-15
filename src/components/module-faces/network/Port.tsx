import { useEffect, useState } from 'react';

export const Port = ({
    className = 'w-5 h-5',
    isPowered = true,
}: {
    className?: string;
    isPowered?: boolean;
}) => {
    // 3 states: 'off', 'online' (linked), 'active' (transmitting)
    // Initialize random state to avoid unison effect
    const [status, setStatus] = useState<'off' | 'online' | 'active'>(() => {
        // Random initial state
        const rand = Math.random();
        if (rand < 0.1) return 'off';
        if (rand < 0.6) return 'online';
        return 'active';
    });

    const [isAmberOn, setIsAmberOn] = useState(false);

    // State simulation loop
    useEffect(() => {
        if (!isPowered) return;

        if (status === 'off') {
            const timeout = setTimeout(() => {
                if (Math.random() > 0.9) setStatus('online');
            }, 5000);
            return () => clearTimeout(timeout);
        }

        // Toggle between online and active (traffic bursts)
        const duration =
            status === 'online'
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
    }, [status, isPowered]);

    // Blinking logic for Amber LED (Active mode)
    useEffect(() => {
        if (!isPowered || status !== 'active') {
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
    }, [status, isPowered]);

    return (
        <div className="flex flex-col items-center gap-[0px]">
            {/* Port */}
            <div
                className={`bg-black/80 rounded-[1px] border border-gray-600 shadow-inner flex items-start pt-[1px] justify-center ${className}`}
            >
                {/* LEDs */}
                <div className="flex justify-between w-full px-[1px]">
                    {/* Green LED: On when online or active */}
                    <div
                        className={`w-0.5 h-0.5 rounded-[0.5px] transition-colors duration-200 ${isPowered && status !== 'off'
                            ? 'bg-green-500/50 shadow-[0_0_2px_rgba(34,197,94,0.6)]'
                            : 'bg-green-900/60'
                            }`}
                    ></div>

                    {/* Amber LED: Blinking when active, Off otherwise */}
                    <div
                        className={`w-0.5 h-0.5 rounded-[0.5px] transition-colors duration-50 ${isPowered && status === 'active' && isAmberOn
                            ? 'bg-amber-500/40 shadow-[0_0_2px_rgba(245,158,11,0.6)]'
                            : 'bg-amber-900/60'
                            }`}
                    ></div>
                </div>
            </div>
        </div>
    );
};
