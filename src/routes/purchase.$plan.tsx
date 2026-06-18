import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/purchase/$plan")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
