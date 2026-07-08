import { Sidebar } from "@/components/nav/Sidebar";
import { PublishReminderBanner } from "@/components/reminders/PublishReminderBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-6">
        <PublishReminderBanner />
        {children}
      </main>
    </div>
  );
}
