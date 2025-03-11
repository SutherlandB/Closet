import * as ImageManipulator from "expo-image-manipulator";

/**
 * Rotates an image by 90 degrees.
 * @param photoURI The URI of the image to rotate.
 * @returns The new rotated image URI.
 */
export const rotateImage = async (photoURI: string): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      photoURI, // Image URI
      [{ rotate: 90 }], // Rotate 90 degrees
      { format: ImageManipulator.SaveFormat.PNG } // Keep it in PNG format
    );

    return result.uri;
  } catch (error) {
    console.error("Error rotating image:", error);
    return photoURI; // Return the original image if rotation fails
  }
};
