import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <ResetPasswordForm />
        </Suspense>
    );
}