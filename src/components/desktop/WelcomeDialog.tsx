import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WelcomeDialogProps {
  open: boolean;
  onAccept: () => void;
}

export function WelcomeDialog({ open, onAccept }: WelcomeDialogProps) {
  const handleAccept = () => {
    // Request fullscreen
    document.documentElement.requestFullscreen?.().catch(() => {
      // Fullscreen might be blocked by browser
    });
    onAccept();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl">Welcome</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            This is a desktop simulator experience. Click accept to continue in fullscreen mode.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleAccept} className="w-full">
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
