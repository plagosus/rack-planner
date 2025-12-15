import type { RackModule, RackWidth } from '../../types';
import { CableManagementFace } from './accessory/CableManagementFace';
import { PatchPanelFace } from './accessory/PatchPanelFace';
import { RPIMountFace } from './accessory/RPIMountFace';
import { ShelfFace } from './accessory/ShelfFace';
import { VentFace } from './accessory/VentFace';

export const AccessoryFace = ({
    module,
    rackWidth = '19inch',
    isPowered,
}: {
    module: RackModule;
    rackWidth?: RackWidth;
    isPowered?: boolean;
}) => {
    const id = module.id.toLowerCase();
    const name = module.name.toLowerCase();

    if (module.id === 'rpi-mount-1u') {
        return <RPIMountFace />;
    }
    if (id === 'cable-man-1u' || name.includes('cable management')) {
        return <CableManagementFace />;
    }

    if (id === 'patch-panel' || name.includes('patch panel')) {
        return <PatchPanelFace rackWidth={rackWidth} isPowered={isPowered} uSize={module.uSize} />;
    }

    if (id === 'shelf' || name.includes('shelf')) {
        return <ShelfFace />;
    }

    if (id === 'rpi-mount' || name.includes('raspberry') || name.includes('rpi')) {
        return <RPIMountFace rackWidth={rackWidth} uSize={module.uSize} />;
    }

    // Default to Vent if it seems like a vent, or if generic accessory
    if (name.includes('vent')) {
        return <VentFace uSize={module.uSize} />;
    }

    return null;
};
