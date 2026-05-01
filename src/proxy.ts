import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
    "/",
    "/sign-up",
    "/login",
    "/forgot-password",
    "/reset-password",
];

function isPublicPath(pathname: string) {
    return PUBLIC_ROUTES.some((route) => {
        if (route === "/") return pathname === "/";
        return pathname === route || pathname.startsWith(route + "/");
    });
}

function isDashboardPath(pathname: string) {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

export function proxy(req: NextRequest) {
    const { pathname, search } = req.nextUrl;

    const token = req.cookies.get("token")?.value;
    const isLoggedIn = !!token;

    // Protect dashboard routes
    if (isDashboardPath(pathname) && !isLoggedIn) {
        const loginUrl = new URL("/login", req.url);

        // optional: remember where user wanted to go
        loginUrl.searchParams.set("redirect", pathname + search);

        return NextResponse.redirect(loginUrl);
    }

    // Prevent logged-in users visiting auth pages
    if (isLoggedIn && (pathname === "/login" || pathname === "/sign-up")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // Public routes continue
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         Run on all app routes except:
         - api
         - _next/static
         - _next/image
         - favicon
         - files with extensions
        */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};
