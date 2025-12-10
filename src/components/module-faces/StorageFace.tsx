export const StorageFace = () => {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="w-3 h-full min-h-[12px] border border-black/40 bg-black/20 rounded-sm flex flex-col items-center pt-0.5"
                >
                    <div className="w-1.5 h-0.5 bg-green-900 mb-0.5"></div>
                    <div className="w-full h-px bg-black/30 mt-auto mb-1"></div>
                </div>
            ))}
        </div>
    );
};
