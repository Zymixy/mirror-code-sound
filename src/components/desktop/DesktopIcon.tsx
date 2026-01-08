import { memo, useCallback, forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

type IconType = LucideIcon | ComponentType<{ className?: string }>;

interface DesktopIconProps {
  id: string;
  icon: IconType;
  label: string;
  position: { x: number; y: number };
  isSelected: boolean;
  isDragging: boolean;
  onDoubleClick: () => void;
  onMouseDown: (e: React.MouseEvent, id: string) => void;
  onTouchStart: (e: React.TouchEvent, id: string) => void;
  onClick: (e: React.MouseEvent, id: string) => void;
}

export const DesktopIcon = memo(forwardRef<HTMLButtonElement, DesktopIconProps>(function DesktopIcon({ 
  id,
  icon: Icon, 
  label,
  position,
  isSelected,
  isDragging,
  onDoubleClick,
  onMouseDown,
  onTouchStart,
  onClick,
}, ref) {
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onMouseDown(e, id);
  }, [onMouseDown, id]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    onTouchStart(e, id);
  }, [onTouchStart, id]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    onClick(e, id);
  }, [onClick, id]);

  return (
    <button
      ref={ref}
      data-icon-id={id}
      onDoubleClick={onDoubleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      className={cn(
        "absolute flex flex-col items-center gap-1 p-2 w-20 rounded-lg transition-colors group select-none touch-none",
        isSelected ? "bg-primary/30 ring-1 ring-primary" : "hover:bg-foreground/10",
        isDragging && "opacity-70 cursor-grabbing"
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-8 h-8 text-primary drop-shadow-lg" />
      </div>
      <span className="text-xs text-center text-foreground drop-shadow-md leading-tight line-clamp-2">
        {label}
      </span>
    </button>
  );
}));
