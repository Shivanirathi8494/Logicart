export async function createShipment(data: any) {

  const response = await fetch("/api/dockets", {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),

  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();

}

export async function getShipment(
  trackingNumber: string,
) {

  const response = await fetch(
    "/api/dockets/" + trackingNumber,
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();

}

export async function updateShipment(
  trackingNumber: string,
  data: any,
) {

  const response = await fetch(

    "/api/dockets/" + trackingNumber,

    {

      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),

    },

  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();

}
