import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  const pincode =
    request.nextUrl.searchParams.get("pincode");

  if (!pincode || pincode.length !== 6) {

    return NextResponse.json(
      {
        error: "Invalid pincode",
      },
      {
        status: 400,
      },
    );

  }

  try {

    const response = await fetch(
      "https://api.postalpincode.in/pincode/" +
      pincode
    );

    const data = await response.json();

    if (
      !data.length ||
      data[0].Status !== "Success"
    ) {

      return NextResponse.json(
        {
          error: "Pincode not found",
        },
        {
          status: 404,
        },
      );

    }

    const office = data[0].PostOffice[0];

    return NextResponse.json({
      city: office.District,
      state: office.State,
    });

  } catch {

    return NextResponse.json(
      {
        error: "Unable to fetch pincode",
      },
      {
        status: 500,
      },
    );

  }

}
