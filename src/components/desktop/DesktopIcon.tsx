import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

type IconType = LucideIcon | ComponentType<{ className?: string }>;

interface DesktopIconProps {
  icon: IconType;
  label: string;
  onDoubleClick: () => void;
}

export const DesktopIcon = memo(function DesktopIcon({ 
  icon: Icon, 
  label, 
  onDoubleClick 
}: DesktopIconProps) {
  return (
    <button
      onDoubleClick={onDoubleClick}
      className="flex flex-col items-center gap-1 p-2 w-20 rounded-lg hover:bg-foreground/10 transition-colors group select-none"
    >
      <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-8 h-8 text-primary drop-shadow-lg" />
      </div>
      <span className="text-xs text-center text-foreground drop-shadow-md leading-tight line-clamp-2">
        {label}
      </span>
    </button>
  );
});
