export const ShelfFace = () => {
    return (
        <div className="w-full h-full relative">
            {/* Shelf Lip */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black/60 to-transparent"></div>
            {/* Surface Texture */}
            <div className="w-full h-full bg-white/5 opacity-10"></div>
        </div>
    );
};
