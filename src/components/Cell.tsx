type CellProps = {
  color: string | null;
  isClearing?: boolean;
};

function Cell({ color, isClearing = false }: CellProps) {
  return (
    <div
      className={`
        w-full h-full
        border border-gray-700
        ${isClearing ? 'bg-white animate-pulse transition-all duration-500' : (color || 'bg-gray-800')}
      `}
    />
  );
}

export default Cell;
