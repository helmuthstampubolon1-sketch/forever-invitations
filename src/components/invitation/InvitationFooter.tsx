import type { Database } from "@/integrations/supabase/types";

type Setting = Database["public"]["Tables"]["wedding_settings"]["Row"];

export function InvitationFooter({ setting }: { setting: Setting }) {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "3rem 1.5rem",
        fontSize: "0.72rem",
        opacity: 0.4,
        letterSpacing: "0.1em",
      }}
    >
      Made with ♥ — {setting.bride_name} & {setting.groom_name} Wedding Invitation
    </footer>
  );
}
