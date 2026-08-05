import Link from "next/link";

type Props = {
  title: string;
  description: string;
  href: string;
};

export default function MasterCard({
  title,
  description,
  href,
}: Props) {

  return (

    <Link
      href={href}
      className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-blue-500 hover:shadow-lg"
    >

      <h2 className="text-xl font-bold">
        {title}
      </h2>

      <p className="mt-3 text-slate-500">
        {description}
      </p>

    </Link>

  );

}
