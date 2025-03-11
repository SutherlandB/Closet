export const waitForImage = async (SERVER_URL:string, filename: string, maxAttempts = 10, delay = 1000): Promise<string | null> => {
    let attempts = 0;
    const index = filename.indexOf(".")
    filename = filename.substring(0,index)
    while (attempts < maxAttempts) {
        
      const response = await fetch(`${SERVER_URL}/view-image/OUTPUT_${filename}.png`, {
        method: "GET", 
      });
  
      if (response.ok) {
        console.log(`Image is now available: ${SERVER_URL}/view-image/${filename}`);
        return `${SERVER_URL}/view-image/${filename}`;
      }
  
      console.log(`Waiting for image... (${attempts + 1}/${maxAttempts})`);
      await new Promise((resolve) => setTimeout(resolve, delay)); 
      attempts++;
    }
  
    console.error("Image processing timeout.");
    return null;
  };