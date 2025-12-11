
export const RPIMountFace = () => {
    return (
        <div className="w-full h-full flex items-center justify-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-8 h-full bg-green-900/40 border border-green-800 mx-1 flex flex-col items-center justify-center relative">
                    {/* Fake RPi PCB */}
                    <div className="w-6 h-[80%] bg-emerald-700/80 border border-emerald-600 rounded-sm shadow-md"></div>
                    <div className="absolute top-2 w-4 h-4 bg-gray-400 rounded-sm"></div> {/* USB/Ethernet */}
                </div>
            ))}
        </div>
    );
};
