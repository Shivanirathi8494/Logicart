import Image from "next/image";

interface ReportHeaderProps {
  title: string;
  subTitle?: string;
}

export default function ReportHeader({
  title,
  subTitle,
}: ReportHeaderProps) {

  return (

    <div className="mb-5 border-b-2 border-black pb-3">

      <div className="flex items-start justify-between">

        <div>

          <Image
            src="/logo/logicarts-logo.png"
            alt="Logicarts"
            width={190}
            height={60}
            priority
            style={{ height: "auto" }}
          />

          <div className="mt-2 text-sm">
            <div className="font-semibold">
              Logicarts Logistics Pvt. Ltd.
            </div>

            <div>Bengaluru, Karnataka, India</div>

            <div>+91 98765 43210</div>

            <div>info@logicarts.in</div>

          </div>

        </div>

        <div className="text-right">

          <h1 className="text-3xl font-bold uppercase">

            {title}

          </h1>

          {subTitle && (

            <p className="mt-2 text-sm">

              {subTitle}

            </p>

          )}

          <p className="mt-3 text-xs">

            Generated :
            {" "}
            {new Date().toLocaleString()}

          </p>

        </div>

      </div>

    </div>

  );

}
