import { type RackWidth } from '../../../types';
import { DriveBay35 } from './DriveBay35';
import { calculateOffThreshold } from './utils';

export const Nas2u35Face = ({
    rackWidth,
    isPowered,
}: {
    rackWidth?: RackWidth;
    isPowered?: boolean;
}) => {
    const drivesPerRow = rackWidth === '10inch' ? 2 : 4;
    const totalDrives = drivesPerRow * 2;
    const offThreshold = calculateOffThreshold(totalDrives);

    return (
        <div className="flex flex-col items-center justify-evenly h-full w-full gap-1 px-2">
            {/* Row 1 */}
            <div className="flex items-center justify-between w-full gap-0">
                {Array.from({ length: drivesPerRow }).map((_, i) => (
                    <DriveBay35
                        key={`r1-${i}`}
                        className={'flex-1'}
                        forceOff={i >= offThreshold}
                        isPowered={isPowered}
                    />
                ))}
            </div>

            {/* Row 2 */}
            <div className="flex items-center justify-between w-full gap-0">
                {Array.from({ length: drivesPerRow }).map((_, i) => (
                    <DriveBay35
                        key={`r2-${i}`}
                        className={'flex-1'}
                        forceOff={i + drivesPerRow >= offThreshold}
                        isPowered={isPowered}
                    />
                ))}
            </div>

            {/* Row 3 */}
            <div className="flex items-center justify-between w-full gap-0">
                {Array.from({ length: drivesPerRow }).map((_, i) => (
                    <DriveBay35
                        key={`r3-${i}`}
                        className={'flex-1'}
                        forceOff={i + drivesPerRow >= offThreshold}
                        isPowered={isPowered}
                    />
                ))}
            </div>
        </div>
    );
};
