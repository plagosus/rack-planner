import type { RackModule } from '../types';

export const PREDEFINED_MODULES: RackModule[] = [
    // Generics
    { id: 'gen-1u', name: 'Generic 1U', uSize: 1, type: 'generic', color: 'bg-gray-700' },
    { id: 'gen-2u', name: 'Generic 2U', uSize: 2, type: 'generic', color: 'bg-gray-700' },
    { id: 'gen-3u', name: 'Generic 3U', uSize: 3, type: 'generic', color: 'bg-gray-700' },
    { id: 'gen-4u', name: 'Generic 4U', uSize: 4, type: 'generic', color: 'bg-gray-700' },

    // Servers
    { id: 'server-1u', name: 'Server 1U', uSize: 1, type: 'server', color: 'bg-indigo-950' },
    { id: 'server-2u', name: 'Server 2U', uSize: 2, type: 'server', color: 'bg-indigo-950' },
    { id: 'server-3u', name: 'Server 3U', uSize: 3, type: 'server', color: 'bg-indigo-950' },
    { id: 'server-4u', name: 'Server 4U', uSize: 4, type: 'server', color: 'bg-indigo-950' },

    // Storage
    { id: 'nas-1u-35', name: '1U 3.5" HDD Bay', uSize: 1, type: 'storage', color: 'bg-gray-800' },
    { id: 'nas-2u-35', name: '2U 3.5" HDD Bay', uSize: 2, type: 'storage', color: 'bg-gray-800' },
    { id: 'nas-2u-25', name: '2U 2.5" SSD Bay', uSize: 2, type: 'storage', color: 'bg-gray-800' },

    // Networking
    { id: 'switch-24', name: '24-Port Switch', uSize: 1, type: 'network', color: 'bg-cyan-950' },
    { id: 'switch-16', name: '16-Port Switch', uSize: 1, type: 'network', color: 'bg-cyan-950' },
    { id: 'switch-8', name: '8-Port Switch', uSize: 1, type: 'network', color: 'bg-cyan-950' },
    { id: 'switch-5', name: '5-Port Switch', uSize: 1, type: 'network', color: 'bg-cyan-950' },

    // Power
    { id: 'pdu-1u', name: 'PDU 1U', uSize: 1, type: 'power', color: 'bg-gray-800' },
    { id: 'ups-1u', name: 'UPS 1U', uSize: 1, type: 'power', color: 'bg-gray-800' },

    // Accessories
    {
        id: 'patch-panel',
        name: 'Patch Panel',
        uSize: 1,
        type: 'accessory',
        color: 'bg-neutral-900',
    },
    {
        id: 'cable-man-1u',
        name: 'Cable Management',
        uSize: 1,
        type: 'accessory',
        color: 'bg-neutral-800',
    },
    { id: 'vent-1u', name: '1U Vent', uSize: 1, type: 'accessory', color: 'bg-slate-700' },
    { id: 'vent-2u', name: '2U Vent', uSize: 2, type: 'accessory', color: 'bg-slate-700' },
    { id: 'vent-3u', name: '3U Vent', uSize: 3, type: 'accessory', color: 'bg-slate-700' },
    { id: 'shelf', name: 'Shelf', uSize: 1, type: 'accessory', color: 'bg-slate-800' },
    {
        id: 'rpi-mount',
        name: '1U Raspberry Pi Mount',
        uSize: 1,
        type: 'accessory',
        color: 'bg-slate-900',
    },
    {
        id: 'rpi-mount-2u',
        name: '2U Raspberry Pi Mount',
        uSize: 2,
        type: 'accessory',
        color: 'bg-slate-900',
    },
    { id: 'shelf-05u', name: 'Shelf 0.5U', uSize: 0.5, type: 'accessory', color: 'bg-slate-800' },
    {
        id: 'patch-panel-05u',
        name: 'Patch Panel 0.5U',
        uSize: 0.5,
        type: 'accessory',
        color: 'bg-neutral-900',
    },
];
