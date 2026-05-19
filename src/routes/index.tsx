import { createFileRoute } from "@tanstack/react-router";
import { useTheme } from "@/components/ThemeProvider";

export const Route = createFileRoute("/")({
  component: InvitationPage,
});

function InvitationPage() {
  const { setting, theme } = useTheme();
  return (
    <div className="bg-theme text-theme min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h1 className="heading-font text-5xl text-primary-theme">
          {setting?.groom_name ?? "Groom"} &amp; {setting?.bride_name ?? "Bride"}
        </h1>
        <p className="body-font text-sm opacity-70">
          Foundation ready · theme: <span className="font-semibold">{theme}</span>
        </p>
        <p className="body-font text-xs opacity-50">
          UI sections will be built in the next prompts.
        </p>
      </div>
    </div>
  );
}
