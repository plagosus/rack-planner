export const NetworkingFace = () => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="w-3 h-3 bg-black/80 rounded-sm border border-gray-600 shadow-inner"
                ></div>
            ))}
        </div>
    );
};
