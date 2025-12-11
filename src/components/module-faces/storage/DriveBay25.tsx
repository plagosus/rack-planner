
export const DriveBay25 = ({ className = '' }: { className?: string }) => (
    <div
        className={`w-10 h-32 bg-gray-900 border border-gray-700 rounded-sm shadow-inner flex flex-col justify-between p-0.5 ${className}`}
    >
        {/* Handle and LED (now on top) */}
        <div className="flex justify-end gap-0.5 w-full">
            <div className="h-1 w-full bg-gray-600 rounded-b-sm"></div> {/* Handle line */}
            <div className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div> {/* LED */}
        </div>
        {/* Some detail */}
        <div className="w-full h-0.5 bg-gray-700 rounded-full self-center"></div>
    </div>
);
