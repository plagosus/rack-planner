
export const Switch8Port = () => {
    return (
        <div className="flex gap-1 w-full max-w-[90%] justify-end items-center pr-4 mt-3">
            {/* 1 Row of 8 Ports */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={`port-${i}`}
                    className="w-3 h-3 bg-black/80 rounded-[1px] border border-gray-600 shadow-inner"
                ></div>
            ))}
        </div>
    );
};
