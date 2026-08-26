"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { airports } from "@/lib/master/airports";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function StationSelect({
  label,
  value,
  onChange,
  disabled = false,
}: Props) {
  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const selected =
    airports.find(
      (station) => station.code === value,
    );

  const [query, setQuery] =
    useState("");

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  const filtered = useMemo(() => {
    const text =
      query.trim().toLowerCase();

    if (!text) {
      return airports.slice(0, 25);
    }

    return airports
      .filter((station) =>
        `${station.code} ${station.city} ${station.airport}`
          .toLowerCase()
          .includes(text),
      )
      .slice(0, 40);
  }, [query]);

  const displayValue =
    open
      ? query
      : selected
        ? `${selected.code} - ${selected.city} - ${selected.airport}`
        : "";

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        <span className="text-red-600">
          {" "}*
        </span>
      </label>

      <input
        type="text"
        value={displayValue}
        placeholder={`Search ${label.toLowerCase()} airport...`}
        disabled={disabled}
        className={`w-full rounded-lg border p-3 ${
          disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-600"
            : "bg-white"
        }`}
        onFocus={() => {
          if (disabled) return;
          setQuery("");
          setOpen(true);
        }}
        onChange={(event) => {
          if (disabled) return;
          setQuery(event.target.value);
          onChange("");
          setOpen(true);
        }}
      />

      {open && !disabled && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-slate-500">
              No airport found.
            </div>
          ) : (
            filtered.map(
              (station) => (
                <button
                  key={station.code}
                  type="button"
                  className="block w-full border-b px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                  onMouseDown={(
                    event,
                  ) => {
                    event.preventDefault();

                    onChange(
                      station.code,
                    );

                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <div className="font-semibold">
                    {station.code}
                    {" - "}
                    {station.city}
                  </div>

                  <div className="text-sm text-slate-500">
                    {station.airport}
                  </div>
                </button>
              ),
            )
          )}
        </div>
      )}
    </div>
  );
}
