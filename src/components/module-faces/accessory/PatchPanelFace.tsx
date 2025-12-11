import { Port } from '../network/Port';
import { type RackWidth } from '../../../types';

export const PatchPanelFace = ({ rackWidth }: { rackWidth?: RackWidth }) => {
    const is10Inch = rackWidth === '10inch';
    const portCount = is10Inch ? 12 : 24;

    return (
        <div className="flex w-full h-full items-center justify-center px-4">
            <div className="flex w-full justify-between gap-[2px]">
                {Array.from({ length: portCount }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-full">
                        {/* White Label */}
                        <div className="w-[80%] h-2 bg-white/70 rounded-[1px] shadow-sm"></div>
                        {/* Port */}
                        <Port className="w-5 h-5" />
                    </div>
                ))}
            </div>
        </div>
    );
};
