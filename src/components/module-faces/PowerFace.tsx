import type { RackModule, RackWidth } from '../../types';
import { PDUFace } from './power/PDUFace';
import { UPSFace } from './power/UPSFace';

export const PowerFace = ({
    module,
    rackWidth = '19inch',
    isPowered,
}: {
    module: RackModule;
    rackWidth?: RackWidth;
    isPowered?: boolean;
}) => {
    if (module.id.startsWith('pdu-')) {
        return <PDUFace rackWidth={rackWidth} isPowered={isPowered} />;
    } else if (module.id.startsWith('ups-')) {
        return <UPSFace isPowered={isPowered} />;
    }
    // Fallback for any other 'power' type not explicitly handled
    return <UPSFace />;
};
