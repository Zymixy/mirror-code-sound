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

  // Mouse events
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

  // Touch events for mobile/tablet
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      
      if (isDragging && !win.isMaximized) {
        e.preventDefault();
        onPositionChange({
          x: touch.clientX - dragOffset.current.x,
          y: Math.max(0, touch.clientY - dragOffset.current.y),
        });
      }
      if (isResizing && !win.isMaximized && windowRef.current) {
        e.preventDefault();
        const rect = windowRef.current.getBoundingClientRect();
        onSizeChange({
          width: Math.max(300, touch.clientX - rect.left),
          height: Math.max(200, touch.clientY - rect.top),
        });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
    document.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
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

  const handleHeaderTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    onFocus();
    setIsDragging(true);
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      dragOffset.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
  }, [onFocus]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  }, []);

  const handleResizeTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length !== 1) return;
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
      onTouchStart={onFocus}
    >
      <div
        className="h-10 bg-card flex items-center justify-between px-3 cursor-move select-none touch-none"
        onMouseDown={handleHeaderMouseDown}
        onTouchStart={handleHeaderTouchStart}
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
          className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize touch-none"
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeTouchStart}
        >
          <div className="absolute bottom-1 right-1 w-3 h-3 border-r-2 border-b-2 border-muted-foreground/50" />
        </div>
      )}
    </div>
  );
});
