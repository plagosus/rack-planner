import { type RackWidth } from '../../../types';
import { RPIMountSlot } from './RPIMountSlot';

export const RPIMountFace = ({
    rackWidth,
    uSize = 1,
    animationsEnabled,
    isPowered,
}: {
    rackWidth?: RackWidth;
    uSize?: number;
    animationsEnabled?: boolean;
    isPowered?: boolean;
}) => {
    const is10Inch = rackWidth === '10inch';
    const is1U = uSize === 1;
    const is2U = uSize === 2;

    // Slot count logic
    let slotCount;
    if (is2U) {
        slotCount = is10Inch ? 4 : 10;
    } else {
        slotCount = is10Inch ? 2 : 4;
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center py-2">
            {/* Horizontal Slots (1U) */}
            {is1U && !is10Inch && (
                <div className="flex justify-between items-center w-full px-6 gap-4">
                    <RPIMountSlot animationsEnabled={animationsEnabled} isPowered={isPowered} />
                    <RPIMountSlot animationsEnabled={animationsEnabled} isPowered={isPowered} />
                    <RPIMountSlot animationsEnabled={animationsEnabled} isPowered={isPowered} />
                    <RPIMountSlot animationsEnabled={animationsEnabled} isPowered={isPowered} />
                </div>
            )}

            {is1U && is10Inch && (
                <div className="flex justify-evenly items-center w-full px-4 gap-4">
                    <RPIMountSlot animationsEnabled={animationsEnabled} isPowered={isPowered} />
                    <RPIMountSlot animationsEnabled={animationsEnabled} isPowered={isPowered} />
                </div>
            )}

            {/* Vertical Slots (2U) */}
            {is2U && (
                <div className="flex justify-evenly items-center w-full px-4 h-full">
                    {Array.from({ length: slotCount }).map((_, i) => (
                        <RPIMountSlot key={i} vertical animationsEnabled={animationsEnabled} isPowered={isPowered} />
                    ))}
                </div>
            )}
        </div>
    );
};
