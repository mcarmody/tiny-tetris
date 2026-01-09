type CellProps = {
  color: string | null;
};

function Cell({ color }: CellProps) {
  return (
    <div
      className={`
        w-full h-full
        border border-gray-700
        ${color || 'bg-gray-800'}
      `}
    />
  );
}

export default Cell;
