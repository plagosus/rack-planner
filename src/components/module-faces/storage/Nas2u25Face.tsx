import { type RackWidth } from '../../../types';
import { DriveBay25 } from './DriveBay25';
import { calculateOffThreshold } from './utils';

export const Nas2u25Face = ({ rackWidth }: { rackWidth?: RackWidth }) => {
    const caddiesPerRow = rackWidth === '10inch' ? 10 : 20;
    const totalDrives = caddiesPerRow;
    const offThreshold = calculateOffThreshold(totalDrives);

    return (
        <div className="flex flex-col items-center justify-evenly h-full w-full gap-0 px-2">
            {/* Row 1 */}
            <div className="flex items-center justify-between w-full gap-0">
                {Array.from({ length: caddiesPerRow }).map((_, i) => (
                    <DriveBay25 key={i} className={'shrink-0'} forceOff={i >= offThreshold} />
                ))}
            </div>
        </div>
    );
};
