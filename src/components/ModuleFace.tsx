import { type RackModule, type RackWidth } from '../types';
import { NetworkFace } from './module-faces/NetworkFace';
import { ServerFace } from './module-faces/ServerFace';
import { StorageFace } from './module-faces/StorageFace';
import { PowerFace } from './module-faces/PowerFace';
import { AccessoryFace } from './module-faces/AccessoryFace';

export const ModuleFace = ({
    module,
    rackWidth,
    className = '',
}: {
    module: RackModule;
    rackWidth?: RackWidth;
    className?: string;
}) => {
    const hasImage = !!module.image;

    // Simple visual helpers based on type/name
    const holeCount = (module.uSize || 1) * 3;

    return (
        <div
            className={`w-full h-full relative overflow-hidden flex items-center justify-center border-y border-white/10 shadow-inner ${module.color || 'bg-gray-700'} ${className}`}
            style={
                hasImage
                    ? {
                        backgroundImage: `url(${module.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }
                    : {}
            }
        >
            {!hasImage && (
                <div className="flex flex-col items-center opacity-80 pointer-events-none w-full px-4">
                    <span className="font-mono text-xs uppercase tracking-widest text-white/50 mb-1">
                        {module.name.substring(0, 32)}
                    </span>

                    {/* Visual Features based on Type */}
                    <div className="flex gap-2 w-full justify-center">
                        {/* Networking: Ports */}
                        {module.type === 'network' && <NetworkFace module={module} />}

                        {/* Server: Indicators or Drive Bays */}
                        {module.type === 'server' && <ServerFace />}

                        {/* Storage: Drive Arrays */}
                        {module.type === 'storage' && (
                            <StorageFace module={module} rackWidth={rackWidth} />
                        )}

                        {/* Power: Switch/Outlets */}
                        {module.type === 'power' && (
                            <PowerFace module={module} rackWidth={rackWidth} />
                        )}

                        {/* Accessories */}
                        {module.type === 'accessory' && (
                            <AccessoryFace module={module} rackWidth={rackWidth} />
                        )}
                    </div>
                </div>
            )}

            {/* Bolt Holes Visuals - Adjusted for scale */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col gap-5">
                {Array.from({ length: holeCount }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-black/50 shadow-inner"></div>
                ))}
            </div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-5">
                {Array.from({ length: holeCount }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-black/50 shadow-inner"></div>
                ))}
            </div>
        </div>
    );
};
