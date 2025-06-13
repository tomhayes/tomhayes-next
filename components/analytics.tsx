"use client";

import { useEffect, Suspense } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

// Extend the Window interface to include gtag
declare global {
    interface Window {
        gtag: (
            command: "config" | "event",
            targetId: string,
            config?: Record<string, unknown>
        ) => void;
        dataLayer: unknown[];
    }
}

interface GoogleAnalyticsProps {
    measurementId: string;
}

// Internal component that uses useSearchParams
function GoogleAnalyticsTracker({ measurementId }: GoogleAnalyticsProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Track page views when the route changes
    useEffect(() => {
        if (measurementId && typeof window !== "undefined" && window.gtag) {
            window.gtag("config", measurementId, {
                page_path: pathname + (searchParams ? `?${searchParams.toString()}` : ""),
            });
        }
    }, [pathname, searchParams, measurementId]);

    return null;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
    if (!measurementId) {
        return null;
    }

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${measurementId}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
            <Suspense fallback={null}>
                <GoogleAnalyticsTracker measurementId={measurementId} />
            </Suspense>
        </>
    );
}

/**
 * Custom hook for tracking events
 * @param action - The action being taken
 * @param category - The category of the event
 * @param label - Optional label for the event
 * @param value - Optional value for the event
 */
export function useTrackEvent() {
    return (action: string, category: string, label?: string, value?: number) => {
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("event", action, {
                event_category: category,
                event_label: label,
                value: value,
            });
        }
    };
}

/**
 * Function to track page views manually if needed
 * @param url - The URL to track
 * @param title - Optional page title
 */
export function trackPageView(url: string, title?: string) {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!, {
            page_path: url,
            page_title: title,
        });
    }
}
