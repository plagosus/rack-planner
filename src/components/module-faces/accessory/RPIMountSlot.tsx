export const RPIMountSlot = ({ vertical = false }: { vertical?: boolean }) => {
    return (
        <div
            className={`${vertical
                ? 'w-[70px] h-[130px] flex-col py-3'
                : 'w-[150px] h-[45px] flex-row px-3'
                } border-[1px] border-white/20 rounded-md bg-transparent flex items-center justify-between`}
        >
            <div className="w-2 h-2 rounded-full border border-white/20 bg-transparent" />
            <div className="w-2 h-2 rounded-full border border-white/20 bg-transparent" />
        </div>
    );
};
