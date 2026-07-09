import { TopNav } from "@/components/nav/TopNav";
import { PublishReminderBanner } from "@/components/reminders/PublishReminderBanner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-10">
        <PublishReminderBanner />
        {children}
      </main>
    </div>
  );
}
