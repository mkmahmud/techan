import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
 
type HeaderProps = {
    role: "ADMIN" | "USER";
    userName?: string;
};

export function Header({ role, userName }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-4 sm:px-8">
                <div className="flex items-center gap-4">
                    <Sheet>
                        <SheetTrigger  >
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-72">
                            <Sidebar role={role} />
                        </SheetContent>
                    </Sheet>

                    <div>
                        <p className="text-sm font-semibold tracking-wide">Task Management</p>
                        <p className="text-sm font-medium text-muted-foreground">
                            Welcome back, {userName ?? role.toLowerCase()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border flex items-center justify-center text-xs font-bold">
                        {(userName?.[0] ?? role[0]).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>
    );
}