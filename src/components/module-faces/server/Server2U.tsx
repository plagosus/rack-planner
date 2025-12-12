import { type RackWidth } from '../../../types';

interface Server2UProps {
    isPowered?: boolean;
    rackWidth?: RackWidth;
}

export const Server2U = ({ isPowered, rackWidth = '19inch' }: Server2UProps) => {
    const fanCount = rackWidth === '19inch' ? 4 : 2;
    const fans = Array.from({ length: fanCount }, (_, i) => i);

    return (
        <div className="w-full h-full relative flex items-center">
            {/* Top Left: Power Button & USBs */}
            <div className="absolute left-[5px] top-[0px] flex flex-col gap-3">
                {/* Power Button */}
                <div className={`w-4 h-4 rounded-full border-2 border-white/20 flex items-center justify-center ${isPowered ? 'bg-white/5' : 'bg-transparent'}`}>
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isPowered
                        ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                        : 'bg-green-900/30'
                        }`}
                    />
                </div>

                {/* USB Ports */}
                <div className="flex flex-col gap-0.5">
                    <div className="w-4 h-1.5 border border-white/20 bg-black/40 rounded-[1px]" />
                    <div className="w-4 h-1.5 border border-white/20 bg-black/40 rounded-[1px]" />
                </div>
            </div>

            {/* Right Side: Larger Fan Grilles */}
            <div className="w-full flex justify-end items-center gap-3 pr-4">
                {fans.map((i) => (
                    <div key={i} className={`${rackWidth === '19inch' ? 'w-49' : 'w-40'} h-26 rounded-md border-2 border-white/10 flex items-center justify-center bg-black/20`}>
                        <div className="w-34 h-20 rounded-sm border border-white/5" />
                    </div>
                ))}
            </div>
        </div>
    );
};
