import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";

interface WelcomeDialogProps {
  open: boolean;
  onAccept: () => void;
}

export function WelcomeDialog({ open, onAccept }: WelcomeDialogProps) {
  const handleAccept = () => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    onAccept();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-sm p-0 border border-gray-300 bg-white rounded shadow-lg">
        {/* Windows-style title bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-t">
          <span className="text-white text-sm font-normal">Desktop Simulator</span>
        </div>
        
        {/* Content */}
        <div className="p-4">
          <p className="text-gray-700 text-sm mb-4">
            This application works best in fullscreen mode. Click Continue to proceed.
          </p>
          
          {/* Button */}
          <div className="flex justify-end">
            <button
              onClick={handleAccept}
              className="px-6 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-400 rounded text-sm text-gray-800 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
