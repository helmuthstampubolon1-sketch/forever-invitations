import { createFileRoute } from "@tanstack/react-router";
import { InvitationPage } from "@/components/invitation/InvitationPage";

export const Route = createFileRoute("/untuk/$slug")({
  component: GuestInvitation,
});

function GuestInvitation() {
  const { slug } = Route.useParams();
  return <InvitationPage slug={slug} />;
}
