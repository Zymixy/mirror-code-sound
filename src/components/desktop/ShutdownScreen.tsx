import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ShutdownScreen() {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
      {showSpinner && (
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      )}
    </div>
  );
}