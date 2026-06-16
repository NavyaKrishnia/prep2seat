import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { Modal } from "@/components/Modal";
import { INDIAN_STATES, CATEGORIES } from "@/lib/constants";

export const Route = createFileRoute("/free-form")({
  ssr: false,
  head: () => ({ meta: [{ title: "See your free college list — Prep2Seat" }] }),
  component: FreeFormRoute,
});

function FreeFormRoute() {
  return (
    <>
      <LandingPage />
      <FreeFormModal />
    </>
  );
}

function FreeFormModal() {
  const navigate = useNavigate();
  const [rank, setRank] = useState("");
  const [state, setState] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const rankNum = Number(rank);
    if (!rankNum || rankNum < 1) return setError("Please enter a valid rank");
    if (!state) return setError("Please select your state");
    if (!category) return setError("Please select your category");
    sessionStorage.setItem(
      "p2s_free_input",
      JSON.stringify({ rank: rankNum, state, category }),
    );
    navigate({ to: "/free-results" });
  }

  return (
    <Modal>
      <h1 className="text-2xl sm:text-3xl font-bold text-navy">
        See your college options instantly
      </h1>
      <p className="mt-2 text-sm text-foreground/70">No signup needed.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            NEET All India Rank
          </label>
          <input
            type="number"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            placeholder="e.g. 12500"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gold"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            State of Domicile
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gold"
            required
          >
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-gold"
            required
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-full bg-gold py-3.5 font-bold text-gold-foreground shadow-gold hover:brightness-105 active:scale-[0.98] transition"
        >
          Show My Colleges
        </button>
      </form>
    </Modal>
  );
}
