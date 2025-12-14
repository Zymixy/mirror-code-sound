interface ShutdownDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ShutdownDialog({ onConfirm, onCancel }: ShutdownDialogProps) {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[9998]" onClick={onCancel} />

      {/* Dialog - positioned near power button (bottom left) */}
      <div className="fixed bottom-16 left-2 bg-card/95 start-menu-blur rounded-lg window-shadow z-[9999] p-4 w-[220px] animate-slide-up">
        <p className="text-sm mb-4">
          Shut down the system?
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 transition-colors text-xs"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-xs"
          >
            Yes
          </button>
        </div>
      </div>
    </>
  );
}
