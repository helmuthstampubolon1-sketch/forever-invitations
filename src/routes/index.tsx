import { createFileRoute } from "@tanstack/react-router";
import { InvitationPage } from "@/components/invitation/InvitationPage";

export const Route = createFileRoute("/")({
  component: () => <InvitationPage />,
});
