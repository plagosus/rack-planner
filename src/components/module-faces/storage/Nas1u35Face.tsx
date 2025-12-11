import { type RackWidth } from '../../../types';
import { DriveBay35 } from './DriveBay35';
import { calculateOffThreshold } from './utils';

export const Nas1u35Face = ({
    rackWidth,
    isPowered,
}: {
    rackWidth?: RackWidth;
    isPowered?: boolean;
}) => {
    const drivesPerRow = rackWidth === '10inch' ? 2 : 4;
    const offThreshold = calculateOffThreshold(drivesPerRow);

    return (
        <div className="flex flex-col items-center justify-evenly h-full w-full gap-2 px-2">
            {/* Row 1 */}
            <div className="flex items-center justify-between w-full gap-0">
                {Array.from({ length: drivesPerRow }).map((_, i) => (
                    <DriveBay35
                        key={i}
                        className={'flex-1'}
                        forceOff={i >= offThreshold}
                        isPowered={isPowered}
                    />
                ))}
            </div>
        </div>
    );
};
