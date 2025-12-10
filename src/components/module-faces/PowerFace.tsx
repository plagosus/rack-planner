import type { RackModule, RackWidth } from '../../types';
import { PDUFace } from './power/PDUFace';
import { UPSFace } from './power/UPSFace';

export const PowerFace = ({
    module,
    rackWidth = '19inch',
}: {
    module: RackModule;
    rackWidth?: RackWidth;
}) => {
    if (module.id.startsWith('pdu-')) {
        return <PDUFace rackWidth={rackWidth} />;
    } else if (module.id.startsWith('ups-')) {
        return <UPSFace />;
    }
    // Fallback for any other 'power' type not explicitly handled
    return <UPSFace />;
};
