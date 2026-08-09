declare module "bwip-js" {
  interface BarcodeOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    includetext?: boolean;
    textxalign?: string;
    [key: string]: unknown;
  }

  interface BwpJs {
    toBuffer(options: BarcodeOptions): Promise<Buffer>;
  }

  const bwipjs: BwpJs;

  export default bwipjs;
}
