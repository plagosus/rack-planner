import type { RackModule, RackWidth } from '../../types';
import { PDUFace } from './power/PDUFace';
import { UPSFace } from './power/UPSFace';

export const PowerFace = ({
    module,
    rackWidth = '19inch',
    animationsEnabled,
    isPowered,
}: {
    module: RackModule;
    rackWidth?: RackWidth;
    animationsEnabled?: boolean;
    isPowered?: boolean;
}) => {
    if (module.id.startsWith('pdu-')) {
        return <PDUFace rackWidth={rackWidth} animationsEnabled={animationsEnabled} isPowered={isPowered} />;
    } else if (module.id.startsWith('ups-')) {
        return <UPSFace animationsEnabled={animationsEnabled} isPowered={isPowered} />;
    }
    // Fallback for any other 'power' type not explicitly handled
    return <UPSFace />;
};
