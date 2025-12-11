import { type RackWidth } from '../../../types';
import { DriveBay25 } from './DriveBay25';
import { calculateOffThreshold } from './utils';

export const Nas2u25Face = ({ rackWidth, animationsEnabled, isPowered }: { rackWidth?: RackWidth; animationsEnabled?: boolean; isPowered?: boolean }) => {
    const drivesPerRow = rackWidth === '10inch' ? 10 : 20; // High density 2.5"
    const offThreshold = calculateOffThreshold(drivesPerRow);

    return (
        <div className="flex flex-col items-center justify-evenly h-full w-full gap-0 px-2">
            {/* Row 1 */}
            <div className="flex items-center justify-between w-full  gap-0">
                {Array.from({ length: drivesPerRow }).map((_, i) => (
                    <DriveBay25 key={i} className={'shrink-0'} forceOff={i >= offThreshold} animationsEnabled={animationsEnabled} isPowered={isPowered} />
                ))}
            </div>
        </div>

    );
};
