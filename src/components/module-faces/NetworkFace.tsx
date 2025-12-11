import type { RackModule } from '../../types';
import { Switch24Port } from './network/Switch24Port';
import { Switch16Port } from './network/Switch16Port';
import { Switch8Port } from './network/Switch8Port';
import { Switch5Port } from './network/Switch5Port';

export const NetworkFace = ({ module, isPowered }: { module: RackModule; isPowered?: boolean }) => {
    // Determine which networking device to show
    const name = module.name.toLowerCase();
    const id = module.id.toLowerCase();

    if (id === 'switch-24' || name.includes('24-port')) {
        return <Switch24Port isPowered={isPowered} />;
    }
    if (id === 'switch-16' || name.includes('16-port')) {
        return <Switch16Port isPowered={isPowered} />;
    }
    if (id === 'switch-8' || name.includes('8-port')) {
        return <Switch8Port isPowered={isPowered} />;
    }
    if (id === 'switch-5' || name.includes('5-port')) {
        return <Switch5Port isPowered={isPowered} />;
    }

    // Default Fallback (Generic networking look - maybe flashing lights)
    return (
        <div className="flex gap-1 justify-end w-full pr-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                    key={i}
                    className="w-3 h-3 bg-black/80 rounded-sm border border-gray-600 shadow-inner"
                ></div>
            ))}
        </div>
    );
};
