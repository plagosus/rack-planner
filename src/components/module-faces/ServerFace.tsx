export const ServerFace = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
                <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
            </div>
            <div className="w-20 h-1.5 bg-black/50 rounded-full"></div>
            <div className="flex gap-0.5">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="w-4 h-6 border border-black/30 bg-black/10 rounded-sm"
                    ></div>
                ))}
            </div>
        </div>
    );
};
