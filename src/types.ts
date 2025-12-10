export type ModuleType = 'server' | 'networking' | 'storage' | 'power' | 'accessory' | 'generic';
export type RackWidth = '19inch' | '10inch';

export interface RackModule {
    id: string;
    name: string;
    uSize: number;
    type: ModuleType;
    image?: string; // Data URL for custom image
    color?: string; // Tailwind color class or hex
}

export interface RackSlot {
    uPosition: number;
    moduleId: string | null;
    module?: RackModule;
}

export interface RackSettings {
    heightU: number;
    widthStandard: RackWidth;
}
