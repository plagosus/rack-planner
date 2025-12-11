import { Port } from './Port';

export const Switch5Port = () => {
    return (
        <div className="flex gap-1 w-full max-w-[90%] justify-end items-center pr-4 mt-3">
            {/* 1 Row of 5 Ports */}
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={`port-${i}`}>
                    <Port />
                </div>
            ))}
        </div>
    );
};
