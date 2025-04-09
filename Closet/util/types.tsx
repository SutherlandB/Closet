import { SkPath } from "@shopify/react-native-skia";

export type EditScreenParams = {
    image: string;
    subject: string;
    bounds: string;
    category: string;
    id: string;
  };

export type UploadScreenParams = {
  editedImage: string, category: string, name: string, brand: string, size: string, color: string, id: string
}
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

export type ClothingFormData = {
  name: string,
  brand: string,
  size: string,
  color: string,
  id: string
}