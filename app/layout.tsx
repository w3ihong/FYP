
import "./globals.css";
import Footer from "@/components/footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "EchoSphere",
  description: "Your consumer intelligence partner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background text-accent font-sans">
      <body className="">
        <main className="min-h-screen w-full">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
