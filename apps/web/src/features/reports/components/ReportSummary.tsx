type Card = {
  title: string;
  value: string | number;
};

type Props = {
  cards: Card[];
};

export default function ReportSummary({
  cards,
}: Props) {

  return (

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => (

        <div
          key={card.title}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >

          <div className="text-sm text-slate-500">
            {card.title}
          </div>

          <div className="mt-2 text-3xl font-bold">
            {card.value}
          </div>

        </div>

      ))}

    </div>

  );

}
