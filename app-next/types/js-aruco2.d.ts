declare module "js-aruco2" {
  export namespace AR {
    class Detector {
      detect(imageData: ImageData): Array<{
        id: number;
        corners: Array<{ x: number; y: number }>;
      }>;
    }
  }
}
