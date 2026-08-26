"use client";

import { useEffect, useMemo, useState } from "react";

import SearchFilters from "./components/SearchFilters";
import SearchResults from "./components/SearchResults";

import ShipmentCard from "@/features/update-status/components/ShipmentCard";
import StatusUpdateForm from "@/features/update-status/components/StatusUpdateForm";
import StatusHistory from "@/features/update-status/components/StatusHistory";

type QueueView =
  | "ACTION"
  | "ORIGIN"
  | "DESTINATION"
  | "ALL";

type CurrentUser = {
  id: string;
  username: string;
  fullName: string;
  role: string;
  branchId?: string | null;
  branchCode?: string | null;
  branchName?: string | null;
};

export default function SearchDocketPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [shipment, setShipment] =
    useState<any>(null);

  const [hasSearched, setHasSearched] =
    useState(false);

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [view, setView] =
    useState<QueueView>("ACTION");

  async function loadCurrentUser() {
    try {
      const response = await fetch(
        "/api/auth/me",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        return;
      }

      const user =
        await response.json();

      setCurrentUser(user);

      /*
       * Admin keeps the broad docket view.
       * Branch employee gets the guided queue.
       */
      if (user?.role === "ADMIN") {
        setView("ALL");
      }
    } catch (error) {
      console.error(
        "Unable to load current user:",
        error
      );
    }
  }

  async function search(filters: {
    tracking: string;
  }) {
    const tracking =
      filters.tracking.trim();

    if (tracking) {
      setHasSearched(true);
    }

    setLoading(true);

    try {
      const params =
        new URLSearchParams();

      if (tracking) {
        params.append(
          "tracking",
          tracking
        );
      }

      const response = await fetch(
        "/api/dockets?" +
          params.toString(),
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          await response.text()
        );
      }

      const data =
        await response.json();

      setResults(data);

      if (
        tracking &&
        data.length > 0
      ) {
        setShipment(data[0]);
      } else if (tracking) {
        setShipment(null);
      } else {
        setShipment(null);
      }
    } catch (error) {
      console.error(
        "Docket search failed:",
        error
      );

      setResults([]);
      setShipment(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCurrentUser();
    search({ tracking: "" });
  }, []);

  const isEmployee =
    currentUser?.role === "EMPLOYEE";

  const filteredResults =
    useMemo(() => {
      if (!isEmployee) {
        return results;
      }

      if (view === "ACTION") {
        return results.filter(
          (row) =>
            row.nextAction &&
            row.nextAction !== "NONE"
        );
      }

      if (view === "ORIGIN") {
        return results.filter(
          (row) =>
            row.workingSide ===
              "ORIGIN" ||
            row.workingSide ===
              "BOTH"
        );
      }

      if (
        view === "DESTINATION"
      ) {
        return results.filter(
          (row) =>
            row.workingSide ===
              "DESTINATION" ||
            row.workingSide ===
              "BOTH"
        );
      }

      return results;
    }, [
      results,
      view,
      isEmployee,
    ]);

  const actionCount =
    results.filter(
      (row) =>
        row.nextAction &&
        row.nextAction !== "NONE"
    ).length;

  const originCount =
    results.filter(
      (row) =>
        row.workingSide ===
          "ORIGIN" ||
        row.workingSide ===
          "BOTH"
    ).length;

  const destinationCount =
    results.filter(
      (row) =>
        row.workingSide ===
          "DESTINATION" ||
        row.workingSide ===
          "BOTH"
    ).length;

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#ff7417]">
            {isEmployee
              ? `${currentUser?.branchCode ?? ""} Operations`
              : "Operations"}
          </p>

          <h1 className="mt-1 text-3xl font-bold text-[#0b2340]">
            Docket Work Queue
          </h1>

          <p className="mt-2 text-slate-500">
            {isEmployee
              ? "See the shipments relevant to your branch and complete the next required action."
              : "Search, review and manage available dockets."}
          </p>
        </div>

        {isEmployee &&
          currentUser?.branchName && (
            <div className="rounded-xl border bg-white px-5 py-3 text-sm shadow-sm">
              <span className="text-slate-500">
                Working Branch
              </span>

              <div className="font-bold text-[#0b2340]">
                {currentUser.branchCode}
                {" — "}
                {currentUser.branchName}
              </div>
            </div>
          )}

      </div>

      <SearchFilters
        onSearch={search}
      />

      {isEmployee && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <QueueButton
            active={view === "ACTION"}
            title="Needs Action"
            count={actionCount}
            onClick={() =>
              setView("ACTION")
            }
          />

          <QueueButton
            active={view === "ORIGIN"}
            title="Origin Working"
            count={originCount}
            onClick={() =>
              setView("ORIGIN")
            }
          />

          <QueueButton
            active={
              view === "DESTINATION"
            }
            title="Destination Working"
            count={destinationCount}
            onClick={() =>
              setView("DESTINATION")
            }
          />

          <QueueButton
            active={view === "ALL"}
            title="All Dockets"
            count={results.length}
            onClick={() =>
              setView("ALL")
            }
          />

        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-semibold text-[#0b2340]">
              {isEmployee &&
              view === "ACTION"
                ? "Dockets Requiring Action"
                : "Available Dockets"}
            </h2>

            {isEmployee &&
              view === "ACTION" && (
                <p className="mt-1 text-sm text-slate-500">
                  Only shipments requiring work from your branch are shown.
                </p>
              )}
          </div>

          <div className="text-sm text-slate-500">
            {filteredResults.length}
            {" shipment"}
            {filteredResults.length ===
            1
              ? ""
              : "s"}
          </div>

        </div>

        <SearchResults
          loading={loading}
          rows={filteredResults}
          onSelect={setShipment}
          hasSearched={hasSearched}
          isEmployee={isEmployee}
        />
      </div>

      {shipment && (
        <div className="space-y-8">
          <ShipmentCard
            shipment={shipment}
          />

          <StatusUpdateForm
            shipment={shipment}
          />

          <StatusHistory
            shipment={shipment}
          />
        </div>
      )}

    </div>
  );
}

function QueueButton({
  active,
  title,
  count,
  onClick,
}: {
  active: boolean;
  title: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-[#ff7417] bg-[#fff4ec] shadow-sm"
          : "bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="text-sm font-semibold text-slate-600">
        {title}
      </div>

      <div
        className={`mt-1 text-3xl font-black ${
          active
            ? "text-[#ff7417]"
            : "text-[#0b2340]"
        }`}
      >
        {count}
      </div>
    </button>
  );
}
