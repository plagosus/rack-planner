import { Port } from '../network/Port';
import { type RackWidth } from '../../../types';

export const PatchPanelFace = ({
    rackWidth,
    isPowered,
}: {
    rackWidth?: RackWidth;
    isPowered?: boolean;
}) => {
    const is10Inch = rackWidth === '10inch';
    const portCount = is10Inch ? 12 : 24;

    return (
        <div className="flex w-full h-full items-center justify-center px-4">
            <div className="flex w-full justify-between gap-[2px]">
                {Array.from({ length: portCount }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                        {/* White Label */}
                        <div className="w-[75%] h-1.5 bg-white/70 rounded-[1px] shadow-sm"></div>
                        {/* Keystone */}
                        <div className="w-[85%] aspect-square bg-black rounded-[2px] flex items-center justify-center">
                            <Port isPowered={isPowered} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
