import bwipjs from "bwip-js";

export async function generateBarcode(text: string) {
  return await bwipjs.toBuffer({
    bcid: "code128",
    text,
    scale: 3,
    height: 12,
    includetext: true,
    textxalign: "center",
  });
}
