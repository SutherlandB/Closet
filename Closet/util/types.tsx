import { SkPath } from "@shopify/react-native-skia";
export type EditScreenParams = {
    image: string;
    subject: string;
  };
export type PathWithWidth = {
    path: SkPath;
    strokeWidth: number;
    blendMode?: string;
    id: string;
  };
export type ImageBody = {
    fileName: string;
    base64: string;
  };