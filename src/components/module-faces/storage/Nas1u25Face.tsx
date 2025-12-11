import { DriveBay25 } from './DriveBay25';

export const Nas1u25Face = () => {
    const driveCount = 8;

    return (
        <div className="flex items-center justify-between h-full gap-2 px-2">
            {Array.from({ length: driveCount }).map((_, i) => (
                <DriveBay25 key={i} className={'w-1/8'} />
            ))}
        </div>
    );
};
