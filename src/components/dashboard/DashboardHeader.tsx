import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";
import UserButton from "../UserButton";

export default function DashboardHeader() {
    return (
        <header className="flex h-16 items-center justify-between px-4 md:px-6 bg-card/80 backdrop-blur-xl border border-border shadow-md">
            <div className="flex justify-between w-full">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <Link href="/">
                        <h1 className="text-2xl font-semibold">
                            resumify
                            <span className="text-green-600 text-xl font-bold">
                                .
                            </span>
                        </h1>
                    </Link>
                </div>

                <UserButton />
            </div>
        </header>
    );
}
