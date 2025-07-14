import type { Metadata } from "next";
import { Inter, Montserrat, Lato } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import ConvexClientProvider from "./ConvexClientProvider";
import Header from "@/components/Header";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const lato = Lato({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PantryPal",
  description: "PantryPal: Nutrition, Pantry, and Recipe Planning App.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only allow unauthenticated access to sign-in and sign-up pages
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const publicRoutes = ["/sign-in", "/sign-up"];
  const isPublic = publicRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className={cn(inter.className, montserrat.className, lato.className)}>
        <ConvexClientProvider>
          {isPublic ? (
            children
          ) : (
            <>
              <SignedIn>
                <Header />
                <main> {children} </main>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          )}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
