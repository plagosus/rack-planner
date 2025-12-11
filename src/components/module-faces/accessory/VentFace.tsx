export const VentFace = () => {
    return (
        <div className="flex flex-col gap-1 w-full opacity-30">
            {[1, 2, 3].map((i) => (
                <div key={i} className="w-full h-0.5 bg-black rounded-full"></div>
            ))}
        </div>
    );
};
