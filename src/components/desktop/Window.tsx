import { useRef, useState, useEffect, useCallback, memo } from "react";
import { X, Minus, Square, Copy } from "lucide-react";
import { WindowState } from "@/hooks/useWindowManager";

interface WindowProps {
  window: WindowState;
  isFocused: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onPositionChange: (pos: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  children: React.ReactNode;
}

export const Window = memo(function Window({
  window: win,
  isFocused,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
  children,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !win.isMaximized) {
        onPositionChange({
          x: e.clientX - dragOffset.current.x,
          y: Math.max(0, e.clientY - dragOffset.current.y),
        });
      }
      if (isResizing && !win.isMaximized && windowRef.current) {
        const rect = windowRef.current.getBoundingClientRect();
        onSizeChange({
          width: Math.max(400, e.clientX - rect.left),
          height: Math.max(300, e.clientY - rect.top),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, win.isMaximized, onPositionChange, onSizeChange]);

  const handleHeaderMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    onFocus();
    setIsDragging(true);
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  }, [onFocus]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  if (win.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className="absolute rounded-lg overflow-hidden window-shadow animate-window-open"
      style={{
        left: win.isMaximized ? 0 : win.position.x,
        top: win.isMaximized ? 0 : win.position.y,
        width: win.isMaximized ? "100%" : win.size.width,
        height: win.isMaximized ? "calc(100vh - 48px)" : win.size.height,
        zIndex: win.zIndex,
      }}
      onMouseDown={onFocus}
    >
      <div
        className="h-10 bg-card flex items-center justify-between px-3 cursor-move select-none"
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-2">
          <win.icon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium truncate max-w-[200px]">{win.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onMinimize}
            className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onMaximize}
            className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded transition-colors"
          >
            {win.isMaximized ? <Copy className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-card h-[calc(100%-40px)] overflow-auto custom-scrollbar">
        {children}
      </div>

      {!win.isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  );
});
