import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/free-results")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
