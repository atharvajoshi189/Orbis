"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Toast } from "@/components/ui/Toast";

export function DashboardToast() {
    const searchParams = useSearchParams();
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (searchParams.get("welcome") === "true") {
            setShowToast(true);
            // Clean up URL without reload (optional, keeps URL clean)
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [searchParams]);

    return showToast ? (
        <Toast
            message="Welcome back, Commander!"
            type="success"
            duration={3000}
            onClose={() => setShowToast(false)}
        />
    ) : null;
}
