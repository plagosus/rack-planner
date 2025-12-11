export const VentFace = ({ uSize = 1 }: { uSize?: number }) => {
    // 1U approx 40px useful height? Using explicit heights to ensure visibility.
    const heightClass = uSize === 1 ? 'h-12' : uSize === 2 ? 'h-32' : 'h-48';

    return (
        <div className={`w-full ${heightClass} px-4 py-1`}>
            <div
                className="w-full h-full bg-black/20 rounded border border-white/5"
                style={{
                    backgroundImage: `
                        radial-gradient(circle, rgba(0,0,0,0.6) 3px, transparent 3px),
                        radial-gradient(circle, rgba(0,0,0,0.6) 3px, transparent 3px)
                    `,
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 4px 4px', // Staggered grid
                }}
            ></div>
        </div>
    );
};
