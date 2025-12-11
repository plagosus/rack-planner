import { type RackWidth } from '../../../types';
import { DriveBay25 } from './DriveBay25';

export const Nas2u25Face = ({ rackWidth }: { rackWidth?: RackWidth }) => {
    const caddiesPerRow = rackWidth === '10inch' ? 10 : 20; // 8 for 10in, 16 for 19in - Keeping logic from original file but comments said 8/16 while code said 10/20. Following code.
    return (
        <div className="flex flex-col items-center justify-evenly h-full w-full gap-0 px-2">
            {/* Row 1 */}
            <div className="flex items-center justify-between w-full gap-0">
                {Array.from({ length: caddiesPerRow }).map((_, i) => (
                    <DriveBay25 key={i} className={'shrink-0'} />
                ))}
            </div>
        </div>
    );
};
