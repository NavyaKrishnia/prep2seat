import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/free-form")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
