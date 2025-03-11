import * as FileSystem from "expo-file-system";
import { Share } from "react-native";

const SERVER_URL = "http://128.113.138.119:5000";
const WS_URL = "ws://128.113.138.119:5000/ws";

export const sendImageToComfyUI = async (
  imageUri: string,
  workflow: object,
 
): Promise<string> => {
  try {
    if (!imageUri) throw new Error("No image URI provided!");
    // openImageWithShare(imageUri);
    console.log("Converting image to Base64...");
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response2 = await fetch(`${SERVER_URL}/upload-image/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_data: base64Image }),
    });

    console.log("Sending image to FastAPI...");
    const response = await fetch(`${SERVER_URL}/process-image/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_data: base64Image, workflow }),
    });

    if (!response.ok) throw new Error("Image processing request failed.");
    

    const data = await response.json();
    const promptId = data.prompt_id;
    console.log("Processing started with prompt ID:", promptId);

    // Connect to WebSocket to receive processed image
    return new Promise((resolve, reject) => {
      console.log("Connecting to WebSocket...");
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log("WebSocket connected!");
      };

      // ws.onmessage = (event) => {
      //   console.log("WebSocket message received:", event.data);
      //   const messageData = JSON.parse(event.data);

      //   if (messageData.image_url) {
      //     console.log("Processed image received:", messageData.image_url);
      //     onImageReceived(messageData.image_url);
      //     ws.close(); // Close WebSocket after receiving the processed image
      //   }
      // };

      ws.onmessage = async (event) => {
        if (typeof event.data === "string") {
            // JSON Message (text-based)
            try {
                const data = JSON.parse(event.data);
                console.log("Received JSON:", data);

                if (data.image_url) {
                    console.log("Image URLopoppop:", data.image_url);
                    const binaryData = await fetch(data.image_url);

                    const newData = await binaryData.arrayBuffer();
                    console.log("Binary Data:", newData.byteLength, "bytes");
                    // // console.log("lotd 2",binaryData);
                    const base64Data =  arrayBufferToBase64(newData);
                    const dataUrl = `data:image/png;base64,${base64Data}`;
                    // console.log(dataUrl);
                    resolve(dataUrl); // Set the URI for display
                }
            } catch (error) {
                console.warn("Error parsing JSON WebSocket data:", error);
            }
        } else {
            // Binary Data (WebSocket Image)
            console.log("Received binary image data, processing...");
            
            const blob = new Blob([event.data], { type: "image/png" });
            const base64Data = await blobToBase64(blob);
            // const imageUrl = URL.createObjectURL(blob);
            // return imageUrl;
            const processedImageUri = `data:image/png;base64,${base64Data}`;
            console.log("LORD:" ,processedImageUri);
    
        resolve(processedImageUri); // Return processed image URI
        }
      }
  

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      reject("error");
    };

    ws.onclose = () => {
      console.log("WebSocket closed.");
    };
  });

  } catch (error) {
    console.error("Error processing image:", error);
    return "error";
  }


};

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
  });}

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};


export const openImageWithShare = async (imageUri: string) => {
  try {
    await Share.share({
      url: imageUri, // Works for both local and remote images
    });
  } catch (error) {
    console.error("Error sharing image:", error);
  }
};




  

