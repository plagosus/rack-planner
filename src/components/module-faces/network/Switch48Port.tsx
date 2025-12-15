import type { RackWidth } from '../../../types';
import { Port } from './Port';

export const Switch48Port = ({
    isPowered,
    rackWidth = '19inch',
}: {
    isPowered?: boolean;
    rackWidth?: RackWidth;
}) => {
    const is10Inch = rackWidth === '10inch';

    if (is10Inch) {
        // 10-inch Rack Layout (Currently same as 19-inch, but separated for future customization)
        return (
            <div className="flex flex-col gap-1 w-full max-w-[90%] items-end pr-4 mt-3">
                {/* 2 Rows of 12 Ports (3 groups of 4) */}
                <div className="flex gap-3 justify-end w-full">
                    {[0, 1, 2].map((groupIndex) => (
                        <div key={`top-group-${groupIndex}`} className="flex gap-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={`top-${groupIndex}-${i}`}>
                                    <Port isPowered={isPowered} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="flex gap-3 justify-end w-full">
                    {[0, 1, 2].map((groupIndex) => (
                        <div key={`bottom-group-${groupIndex}`} className="flex gap-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={`bottom-${groupIndex}-${i}`}>
                                    <Port isPowered={isPowered} />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // 19-inch Rack Layout (Standard)
    return (
        <div className="flex flex-col gap-1 w-full max-w-[95%] items-end pr-2 mt-3">
            {/* 2 Rows of 24 Ports (4 groups of 6) */}
            <div className="flex gap-5 justify-end w-full">
                {[0, 1, 2].map((groupIndex) => (
                    <div key={`top-group-${groupIndex}`} className="flex gap-[2px]">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={`top-${groupIndex}-${i}`}>
                                <Port isPowered={isPowered} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex gap-5 justify-end w-full">
                {[0, 1, 2].map((groupIndex) => (
                    <div key={`bottom-group-${groupIndex}`} className="flex gap-[2px]">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={`bottom-${groupIndex}-${i}`}>
                                <Port isPowered={isPowered} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
