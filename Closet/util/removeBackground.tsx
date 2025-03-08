export const sendImageToApi = async (imageUri: string, serverUrl: string): Promise<string | null> => {
    try {
      if (!imageUri) {
        throw new Error("No image URI provided!");
      }
  
      // Create FormData object
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "photo.jpg", // Ensure name has an extension
        type: "image/jpeg", // Change to "image/png" if needed
      } as any); // TypeScript sometimes requires `as any` for FormData entries
  
      // Make a POST request to your Flask API
      const response = await fetch(serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
  
      // Convert response to a blob (image)
      const blob = await response.blob();
  
      // Convert the blob to a base64 string
      const base64Data = await blobToBase64(blob);
      const processedImageUri = `data:image/png;base64,${base64Data}`;
    //   console.log(processedImageUri)
  
      return processedImageUri; // Return processed image URI
    } catch (error) {
      console.error("Error sending image:", error);
      return null;
    }
  };
  
  // Utility function: Convert a Blob to a Base64 string
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const base64data = reader.result.split(",")[1]; // Extract base64 part
          resolve(base64data);
        } else {
          reject("Failed to convert blob to base64");
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  