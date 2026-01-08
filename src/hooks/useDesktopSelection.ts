import { useState, useCallback, useRef } from "react";

interface SelectionRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface IconPosition {
  id: string;
  x: number;
  y: number;
}

export function useDesktopSelection(initialPositions: IconPosition[]) {
  const [iconPositions, setIconPositions] = useState<IconPosition[]>(initialPositions);
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const [draggingIcon, setDraggingIcon] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isSelecting = useRef(false);

  const startSelection = useCallback((x: number, y: number) => {
    isSelecting.current = true;
    setSelectionRect({ startX: x, startY: y, endX: x, endY: y });
    setSelectedIcons(new Set());
  }, []);

  const updateSelection = useCallback((x: number, y: number) => {
    if (!isSelecting.current) return;
    setSelectionRect(prev => prev ? { ...prev, endX: x, endY: y } : null);
  }, []);

  const endSelection = useCallback((iconRefs: Map<string, DOMRect>) => {
    if (!isSelecting.current || !selectionRect) {
      isSelecting.current = false;
      setSelectionRect(null);
      return;
    }

    const rect = {
      left: Math.min(selectionRect.startX, selectionRect.endX),
      right: Math.max(selectionRect.startX, selectionRect.endX),
      top: Math.min(selectionRect.startY, selectionRect.endY),
      bottom: Math.max(selectionRect.startY, selectionRect.endY),
    };

    const selected = new Set<string>();
    iconRefs.forEach((iconRect, id) => {
      if (
        iconRect.left < rect.right &&
        iconRect.right > rect.left &&
        iconRect.top < rect.bottom &&
        iconRect.bottom > rect.top
      ) {
        selected.add(id);
      }
    });

    setSelectedIcons(selected);
    isSelecting.current = false;
    setSelectionRect(null);
  }, [selectionRect]);

  const startIconDrag = useCallback((id: string, clientX: number, clientY: number, iconRect: DOMRect) => {
    setDraggingIcon(id);
    dragOffset.current = {
      x: clientX - iconRect.left,
      y: clientY - iconRect.top,
    };
    if (!selectedIcons.has(id)) {
      setSelectedIcons(new Set([id]));
    }
  }, [selectedIcons]);

  const updateIconDrag = useCallback((clientX: number, clientY: number) => {
    if (!draggingIcon) return;

    const newX = clientX - dragOffset.current.x;
    const newY = clientY - dragOffset.current.y;

    setIconPositions(prev => {
      const draggingPos = prev.find(p => p.id === draggingIcon);
      if (!draggingPos) return prev;

      const deltaX = newX - draggingPos.x;
      const deltaY = newY - draggingPos.y;

      return prev.map(pos => {
        if (selectedIcons.has(pos.id)) {
          return {
            ...pos,
            x: Math.max(0, pos.x + deltaX),
            y: Math.max(0, pos.y + deltaY),
          };
        }
        return pos;
      });
    });
  }, [draggingIcon, selectedIcons]);

  const endIconDrag = useCallback(() => {
    setDraggingIcon(null);
  }, []);

  const selectIcon = useCallback((id: string, addToSelection: boolean) => {
    if (addToSelection) {
      setSelectedIcons(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    } else {
      setSelectedIcons(new Set([id]));
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIcons(new Set());
  }, []);

  return {
    iconPositions,
    selectedIcons,
    selectionRect,
    draggingIcon,
    startSelection,
    updateSelection,
    endSelection,
    startIconDrag,
    updateIconDrag,
    endIconDrag,
    selectIcon,
    clearSelection,
  };
}
