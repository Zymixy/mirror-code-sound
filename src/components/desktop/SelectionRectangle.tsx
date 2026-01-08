import { memo } from "react";

interface SelectionRectangleProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export const SelectionRectangle = memo(function SelectionRectangle({
  startX,
  startY,
  endX,
  endY,
}: SelectionRectangleProps) {
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  const width = Math.abs(endX - startX);
  const height = Math.abs(endY - startY);

  return (
    <div
      className="absolute border border-primary/70 bg-primary/20 pointer-events-none z-50"
      style={{
        left,
        top,
        width,
        height,
      }}
    />
  );
});
