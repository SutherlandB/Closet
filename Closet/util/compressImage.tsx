import * as ImageManipulator from "expo-image-manipulator";

export const compressImage = async (uri: string): Promise<string | null> => {
    try {
        console.log("Compressing image...");

        // Resize the image to 1080x1080
        const compressed = await ImageManipulator.manipulateAsync(
            uri, 
            [{ resize: { width: 1080 } }], 
            { compress: 0.8, format: ImageManipulator.SaveFormat.PNG }
        );

        console.log("Compression complete:", compressed.uri);
        return compressed.uri;
    } catch (error) {
        console.error("Error compressing image:", error);
        return null;
    }
};
