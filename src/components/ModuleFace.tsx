import { type RackModule } from '../types';
import { NetworkingFace } from './module-faces/NetworkingFace';
import { ServerFace } from './module-faces/ServerFace';
import { StorageFace } from './module-faces/StorageFace';
import { PowerFace } from './module-faces/PowerFace';
import { VentFace } from './module-faces/VentFace';

export const ModuleFace = ({
    module,
    className = '',
}: {
    module: RackModule;
    className?: string;
}) => {
    const hasImage = !!module.image;

    // Simple visual helpers based on type/name
    const isVent = module.name.toLowerCase().includes('vent');

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
                        {module.name.substring(0, 18)}
                    </span>

                    {/* Visual Features based on Type */}
                    <div className="flex gap-2 w-full justify-center">
                        {/* Networking: Ports */}
                        {module.type === 'networking' && <NetworkingFace />}

                        {/* Server: Indicators or Drive Bays */}
                        {module.type === 'server' && <ServerFace />}

                        {/* Storage: Drive Arrays */}
                        {module.type === 'storage' && <StorageFace />}

                        {/* Power: Switch/Outlets */}
                        {module.type === 'power' && <PowerFace />}

                        {/* Vents: Horizontal Lines */}
                        {isVent && <VentFace />}
                    </div>
                </div>
            )}

            {/* Bolt Holes Visuals - Adjusted for scale */}
            <div className="absolute left-1 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                <div className="w-2 h-2 rounded-full bg-black/50 shadow-inner"></div>
                <div className="w-2 h-2 rounded-full bg-black/50 shadow-inner"></div>
            </div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                <div className="w-2 h-2 rounded-full bg-black/50 shadow-inner"></div>
                <div className="w-2 h-2 rounded-full bg-black/50 shadow-inner"></div>
            </div>
        </div>
    );
};
