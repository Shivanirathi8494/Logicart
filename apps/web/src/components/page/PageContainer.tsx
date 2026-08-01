import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {children}
    </section>
  );
}
