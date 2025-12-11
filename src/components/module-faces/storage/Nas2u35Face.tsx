import { type RackWidth } from '../../../types';
import { DriveBay35 } from './DriveBay35';

export const Nas2u35Face = ({ rackWidth }: { rackWidth?: RackWidth }) => {
    const drivesPerRow = rackWidth === '10inch' ? 2 : 4;
    // Special rendering for 2U with 3 rows of caddies
    return (
        <div className="flex flex-col items-center justify-evenly h-full w-full gap-0 px-2">
            {/* Row 1 */}
            <div className="flex items-center justify-between w-full gap-0">
                {Array.from({ length: drivesPerRow }).map((_, i) => (
                    <DriveBay35 key={i} className={'flex-1'} />
                ))}
            </div>
            {/* Row 2 */}
            <div className="flex items-center justify-between w-full gap-0">
                {Array.from({ length: drivesPerRow }).map((_, i) => (
                    <DriveBay35 key={i} className={'flex-1'} />
                ))}
            </div>
            {/* Row 3 */}
            <div className="flex items-center justify-between w-full gap-0">
                {Array.from({ length: drivesPerRow }).map((_, i) => (
                    <DriveBay35 key={i} className={'flex-1'} />
                ))}
            </div>
        </div>
    );
};
