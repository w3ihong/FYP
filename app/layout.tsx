
import "./globals.css";
import Footer from "@/components/footer";

export const metadata = {
  title: "EchoSphere",
  description: "Your consumer intelligence partner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-white text-accent font-sans scroll-smooth">
      <body className="">
        <main className="min-h-screen w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
