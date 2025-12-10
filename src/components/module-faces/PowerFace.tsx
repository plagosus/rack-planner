export const PowerFace = () => {
    return (
        <div className="flex items-center gap-4 w-full justify-between px-2">
            <div className="w-4 h-3 bg-red-800 border border-red-900 rounded-sm flex items-center justify-center">
                <div className="w-2 h-0.5 bg-red-400"></div>
            </div>
            <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="w-4 h-4 bg-black rounded-full border border-gray-700"
                    ></div>
                ))}
            </div>
        </div>
    );
};
