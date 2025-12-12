import { type RackModule, type RackWidth } from '../../types';
import { Server1U } from './server/Server1U';
import { Server2U } from './server/Server2U';
import { Server3U } from './server/Server3U';
import { Server4U } from './server/Server4U';

interface ServerFaceProps {
    module: RackModule;
    isPowered?: boolean;
    rackWidth?: RackWidth;
}

export const ServerFace = ({ module, isPowered, rackWidth }: ServerFaceProps) => {
    const uSize = module.uSize || 1;

    switch (uSize) {
        case 2:
            return <Server2U isPowered={isPowered} rackWidth={rackWidth} />;
        case 3:
            return <Server3U isPowered={isPowered} rackWidth={rackWidth} />;
        case 4:
            return <Server4U isPowered={isPowered} rackWidth={rackWidth} />;
        default:
            return <Server1U isPowered={isPowered} rackWidth={rackWidth} />;
    }
};
