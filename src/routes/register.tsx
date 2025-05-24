import { redirect } from "@tanstack/react-router";
import { Register } from "~/components/Auth/Auth";

export const Route = createFileRoute({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { queryClient } = Route.useRouteContext();
  return <Register queryClient={queryClient} />;
}
