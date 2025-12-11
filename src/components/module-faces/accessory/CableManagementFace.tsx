export const CableManagementFace = () => {
    return (
        <div className="w-full h-full flex items-center justify-center px-4">
            {/* Duct Cover */}
            <div className="w-full h-8 bg-neutral-800 rounded border-y border-neutral-700 shadow-md flex items-center justify-around overflow-hidden">
                {/* Visual Slots */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="w-1.5 h-full bg-black/40 border-x border-white/5"></div>
                ))}
            </div>
        </div>
    );
};
