
export const Switch24Port = () => {
    return (
        <div className="flex flex-col gap-1 w-full max-w-[90%] items-end pr-4 mt-3">
            {/* 2 Rows of 12 Ports */}
            <div className="flex gap-1 justify-end w-full">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={`top-${i}`}
                        className="w-3 h-3 bg-black/80 rounded-[1px] border border-gray-600 shadow-inner"
                    ></div>
                ))}
            </div>
            <div className="flex gap-1 justify-end w-full">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div
                        key={`bottom-${i}`}
                        className="w-3 h-3 bg-black/80 rounded-[1px] border border-gray-600 shadow-inner"
                    ></div>
                ))}
            </div>
        </div>
    );
};
