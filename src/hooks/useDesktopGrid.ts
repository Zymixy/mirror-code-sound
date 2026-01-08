import { useState, useCallback, useRef } from "react";

// Grid cell size in pixels (matches Windows desktop icon spacing)
const CELL_WIDTH = 90;
const CELL_HEIGHT = 100;
const GRID_PADDING = 8;

export interface GridPosition {
  col: number;
  row: number;
}

export interface IconState {
  id: string;
  gridPos: GridPosition;
}

export interface DragState {
  iconId: string;
  startGridPos: GridPosition;
  currentPixelPos: { x: number; y: number };
  offset: { x: number; y: number };
}

interface SelectionRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// Convert grid position to pixel position
export function gridToPixel(gridPos: GridPosition): { x: number; y: number } {
  return {
    x: GRID_PADDING + gridPos.col * CELL_WIDTH,
    y: GRID_PADDING + gridPos.row * CELL_HEIGHT,
  };
}

// Convert pixel position to nearest grid position
function pixelToGrid(x: number, y: number): GridPosition {
  return {
    col: Math.max(0, Math.round((x - GRID_PADDING) / CELL_WIDTH)),
    row: Math.max(0, Math.round((y - GRID_PADDING) / CELL_HEIGHT)),
  };
}

// Check if a grid position is occupied (excluding specific icons)
function isOccupied(
  gridPos: GridPosition,
  icons: IconState[],
  excludeIds: Set<string>
): boolean {
  return icons.some(
    (icon) =>
      !excludeIds.has(icon.id) &&
      icon.gridPos.col === gridPos.col &&
      icon.gridPos.row === gridPos.row
  );
}

// Find nearest free grid cell using spiral search
function findNearestFreeCell(
  targetPos: GridPosition,
  icons: IconState[],
  excludeIds: Set<string>,
  maxCols: number,
  maxRows: number
): GridPosition {
  // Check target first
  if (!isOccupied(targetPos, icons, excludeIds)) {
    return targetPos;
  }

  // Spiral search for nearest free cell
  for (let radius = 1; radius < Math.max(maxCols, maxRows); radius++) {
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
        
        const testPos = {
          col: Math.max(0, Math.min(maxCols - 1, targetPos.col + dx)),
          row: Math.max(0, Math.min(maxRows - 1, targetPos.row + dy)),
        };
        
        if (!isOccupied(testPos, icons, excludeIds)) {
          return testPos;
        }
      }
    }
  }

  return targetPos; // Fallback
}

export function useDesktopGrid(initialIcons: IconState[]) {
  const [icons, setIcons] = useState<IconState[]>(initialIcons);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [draggedPositions, setDraggedPositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const isSelecting = useRef(false);
  const containerSize = useRef({ width: 0, height: 0 });

  const setContainerSize = useCallback((width: number, height: number) => {
    containerSize.current = { width, height };
  }, []);

  const getMaxGrid = useCallback(() => {
    return {
      maxCols: Math.floor((containerSize.current.width - GRID_PADDING * 2) / CELL_WIDTH),
      maxRows: Math.floor((containerSize.current.height - GRID_PADDING * 2 - 48) / CELL_HEIGHT), // -48 for taskbar
    };
  }, []);

  // Start dragging an icon
  const startIconDrag = useCallback(
    (iconId: string, clientX: number, clientY: number, iconRect: DOMRect) => {
      const icon = icons.find((i) => i.id === iconId);
      if (!icon) return;

      // If clicking on unselected icon, select only it
      if (!selectedIds.has(iconId)) {
        setSelectedIds(new Set([iconId]));
      }

      const offset = {
        x: clientX - iconRect.left,
        y: clientY - iconRect.top,
      };

      setDragState({
        iconId,
        startGridPos: icon.gridPos,
        currentPixelPos: { x: iconRect.left, y: iconRect.top },
        offset,
      });

      // Initialize dragged positions for all selected icons
      const newDraggedPositions = new Map<string, { x: number; y: number }>();
      const activeSelection = selectedIds.has(iconId) ? selectedIds : new Set([iconId]);
      
      activeSelection.forEach((id) => {
        const selectedIcon = icons.find((i) => i.id === id);
        if (selectedIcon) {
          newDraggedPositions.set(id, gridToPixel(selectedIcon.gridPos));
        }
      });
      setDraggedPositions(newDraggedPositions);
    },
    [icons, selectedIds]
  );

  // Update icon position while dragging
  const updateIconDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragState) return;

      const primaryIcon = icons.find((i) => i.id === dragState.iconId);
      if (!primaryIcon) return;

      const newX = clientX - dragState.offset.x;
      const newY = clientY - dragState.offset.y;

      const deltaX = newX - gridToPixel(primaryIcon.gridPos).x;
      const deltaY = newY - gridToPixel(primaryIcon.gridPos).y;

      const newDraggedPositions = new Map<string, { x: number; y: number }>();
      const activeSelection = selectedIds.has(dragState.iconId) ? selectedIds : new Set([dragState.iconId]);

      activeSelection.forEach((id) => {
        const icon = icons.find((i) => i.id === id);
        if (icon) {
          const basePos = gridToPixel(icon.gridPos);
          newDraggedPositions.set(id, {
            x: basePos.x + deltaX,
            y: basePos.y + deltaY,
          });
        }
      });

      setDraggedPositions(newDraggedPositions);
      setDragState((prev) => prev ? { ...prev, currentPixelPos: { x: newX, y: newY } } : null);
    },
    [dragState, icons, selectedIds]
  );

  // End dragging and snap to grid
  const endIconDrag = useCallback(() => {
    if (!dragState) return;

    const { maxCols, maxRows } = getMaxGrid();
    const activeSelection = selectedIds.has(dragState.iconId) ? selectedIds : new Set([dragState.iconId]);

    // Calculate grid offset based on primary icon movement
    const primaryDraggedPos = draggedPositions.get(dragState.iconId);
    if (!primaryDraggedPos) {
      setDragState(null);
      setDraggedPositions(new Map());
      return;
    }

    const targetGridPos = pixelToGrid(primaryDraggedPos.x, primaryDraggedPos.y);
    const primaryIcon = icons.find((i) => i.id === dragState.iconId);
    if (!primaryIcon) {
      setDragState(null);
      setDraggedPositions(new Map());
      return;
    }

    const gridDeltaCol = targetGridPos.col - primaryIcon.gridPos.col;
    const gridDeltaRow = targetGridPos.row - primaryIcon.gridPos.row;

    // Calculate new positions for all selected icons
    const newPositions: { id: string; newPos: GridPosition }[] = [];
    
    activeSelection.forEach((id) => {
      const icon = icons.find((i) => i.id === id);
      if (icon) {
        const newPos = {
          col: Math.max(0, Math.min(maxCols - 1, icon.gridPos.col + gridDeltaCol)),
          row: Math.max(0, Math.min(maxRows - 1, icon.gridPos.row + gridDeltaRow)),
        };
        newPositions.push({ id, newPos });
      }
    });

    // Resolve conflicts - find free cells for each icon
    setIcons((prev) => {
      let updatedIcons = [...prev];
      
      newPositions.forEach(({ id, newPos }) => {
        const freePos = findNearestFreeCell(
          newPos,
          updatedIcons,
          activeSelection,
          maxCols,
          maxRows
        );
        
        updatedIcons = updatedIcons.map((icon) =>
          icon.id === id ? { ...icon, gridPos: freePos } : icon
        );
      });

      return updatedIcons;
    });

    setDragState(null);
    setDraggedPositions(new Map());
  }, [dragState, draggedPositions, icons, selectedIds, getMaxGrid]);

  // Selection rectangle handlers
  const startSelection = useCallback((x: number, y: number) => {
    isSelecting.current = true;
    setSelectionRect({ startX: x, startY: y, endX: x, endY: y });
    setSelectedIds(new Set());
  }, []);

  const updateSelection = useCallback((x: number, y: number) => {
    if (!isSelecting.current) return;
    setSelectionRect((prev) => (prev ? { ...prev, endX: x, endY: y } : null));
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

    setSelectedIds(selected);
    isSelecting.current = false;
    setSelectionRect(null);
  }, [selectionRect]);

  const selectIcon = useCallback((id: string, addToSelection: boolean) => {
    if (addToSelection) {
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    } else {
      setSelectedIds(new Set([id]));
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Get display position (dragged or grid)
  const getIconDisplayPosition = useCallback(
    (iconId: string): { x: number; y: number } => {
      if (draggedPositions.has(iconId)) {
        return draggedPositions.get(iconId)!;
      }
      const icon = icons.find((i) => i.id === iconId);
      if (icon) {
        return gridToPixel(icon.gridPos);
      }
      return { x: 0, y: 0 };
    },
    [icons, draggedPositions]
  );

  return {
    icons,
    selectedIds,
    selectionRect,
    isDragging: dragState !== null,
    draggingIconId: dragState?.iconId ?? null,
    setContainerSize,
    startIconDrag,
    updateIconDrag,
    endIconDrag,
    startSelection,
    updateSelection,
    endSelection,
    selectIcon,
    clearSelection,
    getIconDisplayPosition,
  };
}
