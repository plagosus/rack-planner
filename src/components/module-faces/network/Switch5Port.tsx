import { Port } from './Port';

export const Switch5Port = ({ animationsEnabled, isPowered }: { animationsEnabled?: boolean; isPowered?: boolean }) => {
    return (
        <div className="flex gap-1 w-full max-w-[90%] justify-end pr-4 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                    <Port animationsEnabled={animationsEnabled} isPowered={isPowered} />
                </div>
            ))}
        </div>
    );
};
