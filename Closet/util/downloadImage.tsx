import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

export const downloadImage = async (filename:string) => {
  try {
    const index = filename.indexOf(".")
    filename = filename.substring(0,index)
    const imageUrl = `http://128.113.138.119:5000/view-image/OUTPUT_${filename}.png`;
    // const imageUrl = `http://128.113.138.119:5000/view-image/OUTPUT_715d2ec2-6568-4e7a-b60c-09609b056b54.png`;
    const fileUri = FileSystem.documentDirectory + filename;

    const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

    console.log("Image saved to:", uri);
    Alert.alert("Download Complete", `Image saved at: ${uri}`);

    return uri; // Return local file path
  } catch (error) {
    console.error("Error downloading image:", error);
    Alert.alert("Download Failed", "Unable to download image.");
  }
};
