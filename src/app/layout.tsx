"use client";

import "./globals.css";
import { DataProvider } from "./context/shareData";
import { ToastContainer } from "react-toastify";
import { NextUIProvider } from "@nextui-org/react";
import { useAuth } from "./hooks/useAuth";
import AuthLayout from "./main-layout/AuthLayout";
import PublicLayout from "./main-layout/PublicLayout";
import { LoadingProvider } from "./context/LoadingContext";
import GlobalLoader from "./common/Loader/GlobalLoader";
import { usePathname, useRouter } from "next/navigation";
import ProtectedLayout from "@/ProtectedLayout";
import navigations from "./constants/navigations";
import Script from "next/script";
import { useEffect } from "react";
import { routeTitleMapping } from "./constants/match-route";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname.startsWith("/auth");
  const isProtectedRoute = !isAuthPage;
  useEffect(() => {
    if (!isLoading && !isAuthenticated && isProtectedRoute) {
      router.push(navigations.login);
    }
  }, [isAuthenticated, isLoading]);

  // Show loader while determining authentication status
  if (isLoading) {
    return (
      <html lang="en">
        <body className="font-Roboto antialiased  bg-white">
          <DataProvider>
            <NextUIProvider>
              <LoadingProvider>
                <GlobalLoader />
              </LoadingProvider>
            </NextUIProvider>
          </DataProvider>
        </body>
      </html>
    );
  }
  const staticTitle = routeTitleMapping[pathname];
  const pageTitle = staticTitle || "PostReachAI";
  return (
    <html lang="en">
      <head>
        <title>{pageTitle}</title>
      </head>
      <body className="font-Roboto antialiased bg-white">
        {/* <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "pftbt6yt4s");
            `,
          }}
        /> */}
        <DataProvider>
          <NextUIProvider>
            <LoadingProvider>
              <GlobalLoader />
              {isAuthenticated && !isAuthPage ? (
                <ProtectedLayout>
                  <AuthLayout>{children}</AuthLayout>
                </ProtectedLayout>
              ) : (
                <PublicLayout>{children}</PublicLayout>
              )}
            </LoadingProvider>
          </NextUIProvider>
          <ToastContainer />
        </DataProvider>
      </body>
    </html>
  );
}