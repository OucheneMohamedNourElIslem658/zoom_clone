import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ActionConfiramationDialogProps {
    title: string;
    description: string;
    onCancel: () => any | Promise<any>;
    action: () => any | Promise<any>;
}

export function ActionConfiramationDialog({
    title,
    description,
    onCancel,
    action,
    trigger,
}: ActionConfiramationDialogProps & { trigger: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async () => {
        setIsLoading(true);
        try {
            await action();
        } catch (err) {
            toast.error("An error occurred while performing the action.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async () => {
        setIsLoading(true);
        try {
            await onCancel();
        } catch (err) {
            toast.error("An error occurred while performing the action.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
                        {isLoading && (<Loader2Icon className="animate-spin" />)}
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleAction} disabled={isLoading}>
                        {isLoading && (<Loader2Icon className="animate-spin" />)}
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
