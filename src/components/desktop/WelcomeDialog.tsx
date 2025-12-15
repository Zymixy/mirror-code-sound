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
      <AlertDialogContent className="max-w-md p-0 border-0 bg-transparent overflow-visible">
        <div className="relative">
          {/* Neon glow border effect */}
          <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-75 blur-sm animate-pulse" />
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400" />
          
          {/* Glass container */}
          <div className="relative rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />
            
            <div className="relative z-10 text-center space-y-6">
              {/* Icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              {/* Title */}
              <div>
                <h2 className="text-2xl font-semibold text-white tracking-tight">
                  Welcome
                </h2>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  Experience the desktop simulation in immersive fullscreen mode.
                </p>
              </div>
              
              {/* Button */}
              <button
                onClick={handleAccept}
                className="w-full relative group overflow-hidden rounded-xl py-3 px-6 font-medium text-white transition-all duration-300"
              >
                {/* Button background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 group-hover:scale-105" />
                
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
                
                {/* Button text */}
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Continue
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
