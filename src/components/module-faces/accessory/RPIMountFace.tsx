import { type RackWidth } from '../../../types';
import { RPIMountSlot } from './RPIMountSlot';

export const RPIMountFace = ({
    rackWidth,
    uSize = 1,
}: {
    rackWidth?: RackWidth;
    uSize?: number;
}) => {
    const is10Inch = rackWidth === '10inch';
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
            <div className="flex gap-4 items-center justify-center w-full px-2">
                {Array.from({ length: slotCount }).map((_, i) => (
                    <RPIMountSlot key={i} vertical={is2U} />
                ))}
            </div>
        </div>
    );
};
