import type { Metadata } from "next";
import AdminGate from "@/features/auth/components/AdminGate";
import AdminNav from "@/features/auth/components/AdminNav";
import AuthProvider from "@/shared/providers/AuthProvider";
import ToastProvider from "@/shared/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminGate>
          <AdminNav />
          <main className="flex-1 pb-20">{children}</main>
        </AdminGate>
      </ToastProvider>
    </AuthProvider>
  );
}
