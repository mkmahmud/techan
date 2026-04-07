import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
            <div className="flex max-w-md flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <FileQuestion className="h-10 w-10 text-muted-foreground" />
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-foreground">404</h1>
                <h2 className="mt-2 text-xl font-semibold">Page not found</h2>

                <p className="mt-4 text-balance text-sm text-muted-foreground">
                    Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
                </p>

                <div className="mt-8 flex gap-4">
                    <Button variant="default">
                        <Link href="/">Go back home</Link>
                    </Button>
                    <Button variant="outline">
                        <Link href="/tasks">View Tasks</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}