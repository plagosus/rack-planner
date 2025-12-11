
export const DriveBay35 = ({ className = '' }: { className?: string }) => (
    <div
        className={`h-12 bg-gray-900 border border-gray-700 rounded-sm shadow-inner flex items-center justify-between px-6 py-1 ${className}`}
    >
        {/* Drive Label / Detail */}
        <div className="flex flex-col gap-0.5">
            <div className="w-6 h-0.5 bg-gray-700 rounded-full"></div>
            <div className="w-4 h-0.5 bg-gray-700 rounded-full"></div>
        </div>

        {/* Handle and LED */}
        <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-green-500 rounded-full"></div> {/* LED */}
            <div className="w-1 h-full bg-gray-600 rounded-sm"></div> {/* Vertical Handle */}
        </div>
    </div>
);
