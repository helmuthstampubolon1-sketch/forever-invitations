import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/components/ThemeProvider";
import { useGuest } from "@/hooks/useGuest";

export const Route = createFileRoute("/untuk/$slug")({
  component: GuestInvitation,
});

function GuestInvitation() {
  const { slug } = Route.useParams();
  const { setting } = useTheme();
  const { data: guest, isLoading } = useGuest(slug);

  return (
    <div className="bg-theme text-theme min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3 p-8">
        <h1 className="heading-font text-5xl text-primary-theme">
          {setting?.groom_name ?? "Groom"} &amp; {setting?.bride_name ?? "Bride"}
        </h1>
        <p className="body-font">
          {isLoading
            ? "Loading…"
            : guest
              ? `Kepada Yth. ${guest.name}`
              : "Guest not found"}
        </p>
        <p className="body-font text-xs opacity-50">
          Foundation ready · sections coming in next prompts.
        </p>
      </div>
    </div>
  );
}
