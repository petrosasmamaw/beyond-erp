import { Footer } from "@/components/navigation/Footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ flex: "1 0 auto" }}>{children}</div>
      <Footer />
    </div>
  );
}
