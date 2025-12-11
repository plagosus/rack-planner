import { Port } from './Port';

export const Switch8Port = () => {
    return (
        <div className="flex flex-col gap-1 w-full max-w-[90%] items-end pr-4 mt-3">
            {/* 2 Rows of 4 Ports */}
            <div className="flex gap-1 justify-end w-full">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`top-${i}`}>
                        <Port />
                    </div>
                ))}
            </div>
            <div className="flex gap-1 justify-end w-full">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`bottom-${i}`}>
                        <Port />
                    </div>
                ))}
            </div>
        </div>
    );
};
