import type { RackModule, RackWidth } from '../../types';
import { Nas1u35Face } from './storage/Nas1u35Face';
import { Nas2u35Face } from './storage/Nas2u35Face';
import { Nas2u25Face } from './storage/Nas2u25Face';


export const StorageFace = ({
    module,
    rackWidth = '19inch',
}: {
    module: RackModule;
    rackWidth?: RackWidth;
}) => {
    if (module.id === 'nas-1u-35') {
        return <Nas1u35Face rackWidth={rackWidth} />;
    }

    if (module.id === 'nas-2u-35') {
        return <Nas2u35Face rackWidth={rackWidth} />;
    }

    if (module.id === 'nas-2u-25') {
        return <Nas2u25Face rackWidth={rackWidth} />;
    }

    return <div className="text-gray-400 text-xs">Unknown Storage Type</div>;
};

