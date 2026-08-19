"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Customer = {
  id: string;
  code: string;
  name: string;
  contactPerson?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  gstNumber?: string | null;
};

type Props = {
  value: string;
  onChange: (
    customer: Customer | null,
  ) => void;
};

export default function CustomerSelect({
  value,
  onChange,
}: Props) {
  const wrapperRef =
    useRef<HTMLDivElement>(null);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [query, setQuery] =
    useState("");

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    fetch("/api/customers/active")
      .then((response) =>
        response.json(),
      )
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomers(data);
        }
      })
      .catch((error) =>
        console.error(
          "Unable to load customers",
          error,
        ),
      );
  }, []);

  useEffect(() => {
    function handleOutside(
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
      handleOutside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutside,
      );
  }, []);

  const selected =
    customers.find(
      (customer) =>
        customer.id === value,
    ) ?? null;

  const filtered = useMemo(() => {
    const text =
      query.trim().toLowerCase();

    if (!text) {
      return customers.slice(0, 30);
    }

    return customers
      .filter((customer) =>
        `${customer.code} ${customer.name}`
          .toLowerCase()
          .includes(text),
      )
      .slice(0, 40);
  }, [customers, query]);

  const displayValue =
    open
      ? query
      : selected
        ? `${selected.code} - ${selected.name}`
        : "";

  return (
    <div
      ref={wrapperRef}
      className="relative"
    >
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Customer ID
        <span className="text-red-600">
          {" "}*
        </span>
      </label>

      <input
        value={displayValue}
        placeholder="Search Customer ID or name..."
        className="w-full rounded-lg border p-3"
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
        onChange={(event) => {
          setQuery(
            event.target.value,
          );

          onChange(null);
          setOpen(true);
        }}
      />

      {open && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-slate-500">
              No active customer found.
            </div>
          ) : (
            filtered.map(
              (customer) => (
                <button
                  key={customer.id}
                  type="button"
                  className="block w-full border-b px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                  onMouseDown={(
                    event,
                  ) => {
                    event.preventDefault();

                    onChange(
                      customer,
                    );

                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <div className="font-semibold">
                    {customer.code}
                    {" - "}
                    {customer.name}
                  </div>

                  {customer.city && (
                    <div className="text-sm text-slate-500">
                      {customer.city}
                    </div>
                  )}
                </button>
              ),
            )
          )}
        </div>
      )}
    </div>
  );
}

export type { Customer };
