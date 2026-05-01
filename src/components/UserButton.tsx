"use client";

import { useLogout } from "@/hooks/mutations/auth/uselogout";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Image from "next/image";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { getInitials, stringToColor } from "@/lib/utils";
import { CreditCard, Home, Laptop, LayoutDashboard, LogOut, Moon, Sun, User2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/queries/useUser";


export default function UserButton() {
    const { data, isLoading } = useUser();
    const user = data?.user;

    const router = useRouter();

    const { setTheme } = useTheme();

    const logoutMutation = useLogout();

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();

            toast.success("Logged Out Successfully!");

            router.push("/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    if (isLoading) {
    return (
        <Avatar className="h-10 w-10 border animate-pulse">
            <AvatarFallback className="bg-muted" />
        </Avatar>
    );
}

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={`w-9 h-9 flex rounded-full overflow-hidden border items-center justify-center`}>
                    {user?.profilePhoto ? (
                        <Image
                            src={user?.profilePhoto}
                            alt="profile"
                            className="w-full h-full object-cover"
                            width={25}
                            height={25}
                        />
                    ) : (
                        <Avatar className="h-10 w-10 border">
                            <AvatarFallback
                                className={`${stringToColor(user?.fullName || "user")} text-white font-bold`}
                            >
                                {getInitials(user?.fullName)}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                    <User2 className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/")}>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push("/dashboard/subscriptions")}
                >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscriptions
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </DropdownMenuItem>

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Sun className="mr-2 h-4 w-4" />
                        Theme
                    </DropdownMenuSubTrigger>

                    <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="mr-2 h-4 w-4" />
                            Light
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="mr-2 h-4 w-4" />
                            Dark
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            <Laptop className="mr-2 h-4 w-4" />
                            System
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:text-red-500"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
