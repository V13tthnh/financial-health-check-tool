declare module "dom-to-image" {
    function toBlob(
      node: HTMLElement,
      options?: {
        bgcolor?: string;
        useCORS?: boolean;
        cacheBust?: boolean;
        width?: number;
        height?: number;
      }
    ): Promise<Blob>;

    function toPng(
      node: HTMLElement,
      options?: {
        bgcolor?: string;
        useCORS?: boolean;
        cacheBust?: boolean;
        width?: number;
        height?: number;
      }
    ): Promise<string>;
    export default domtoimage;
    export { toBlob, toPng };
  }