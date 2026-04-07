import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <div className="flex max-w-md flex-col items-center text-center">

                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>

            </div>
        </div>
    );
}