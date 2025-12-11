import { Port } from './Port';

export const Switch16Port = ({ isPowered }: { isPowered?: boolean }) => {
    return (
        <div className="flex flex-col gap-1 w-full max-w-[90%] items-end pr-4 mt-3">
            {/* 2 Rows of 8 Ports (2 groups of 4) */}
            <div className="flex gap-3 justify-end w-full">
                {[0, 1].map((groupIndex) => (
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
                {[0, 1].map((groupIndex) => (
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
};
