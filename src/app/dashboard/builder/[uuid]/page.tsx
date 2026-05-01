import { Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import BuilderPage from "./BuilderPage";

export default function Page() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <BuilderPage />
        </Suspense>
    );
}