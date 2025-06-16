import {
  AlertDialog,
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
import { Button } from "../ui/button";

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
    const [open, setOpen] = useState(false);

    const handleAction = async () => {
        setIsLoading(true);
        try {
            await action();
            setOpen(false);
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
            setOpen(false);
        } catch (err) {
            toast.error("An error occurred while performing the action.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
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
                    <Button onClick={handleAction} disabled={isLoading}>
                        {isLoading && (<Loader2Icon className="animate-spin" />)}
                        Continue
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
