import type { RackModule, RackWidth } from '../../types';
import type {JSX} from "react";

const DriveBay35 = ({ className = '' }: { className?: string }) => (
    <div className={`h-12 bg-gray-900 border border-gray-700 rounded-sm shadow-inner flex items-center justify-between px-6 py-1 ${className}`}>
        {/* Drive Label / Detail */}
        <div className="flex flex-col gap-0.5">
            <div className="w-6 h-0.5 bg-gray-700 rounded-full"></div>
            <div className="w-4 h-0.5 bg-gray-700 rounded-full"></div>
        </div>

        {/* Handle and LED */}
        <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-green-500 rounded-full"></div> {/* LED */}
            <div className="w-1 h-full bg-gray-600 rounded-sm"></div> {/* Vertical Handle */}
        </div>
    </div>
);

const DriveBay25 = () => (
    <div className="w-6 h-full bg-gray-900 border border-gray-700 rounded-sm shadow-inner flex flex-col justify-end p-0.5">
        <div className="w-full h-0.5 bg-gray-600 rounded-t-sm mb-0.5"></div> {/* Handle line */}
        <div className="w-0.5 h-0.5 bg-blue-500 rounded-full mb-0.5 self-center"></div> {/* LED */}
    </div>
);

export const StorageFace = ({ module, rackWidth = '19inch' }: { module: RackModule; rackWidth?: RackWidth }) => {
    let driveCount = 0;
    let DriveComponent: ({ className }: { className?: string }) => JSX.Element = DriveBay35;
    let driveClassName = '';

    if (module.id === 'nas-1u-35') {
        const drivesPerRow = rackWidth === '10inch' ? 2 : 4;
        return (
            <div className="flex flex-col items-center justify-evenly h-full w-full gap-2 px-2">
                {/* Row 1 */}
                <div className="flex items-center justify-between w-full gap-0">
                    {Array.from({ length: drivesPerRow }).map((_, i) => (
                        <DriveBay35 key={i} className={'flex-1'} />
                    ))}
                </div>

            </div>
        );
    } else if (module.id === 'nas-2u-35') {
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
    } else if (module.id === 'nas-1u-25') {
        driveCount = 8;
        DriveComponent = DriveBay25;
        // For 1U 2.5", 8 bays will be smaller.
        driveClassName = 'w-1/8'; // Roughly 8 drives across
    }

    if (driveCount === 0) {
        return <div className="text-gray-400 text-xs">Unknown Storage Type</div>;
    }

    return (
        <div className="flex items-center justify-between h-full gap-2 px-2">
            {Array.from({ length: driveCount }).map((_, i) => (
                <DriveComponent key={i} className={driveClassName} />
            ))}
        </div>
    );
};
