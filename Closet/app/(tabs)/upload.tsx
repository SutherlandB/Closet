import {Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from '@react-native-vector-icons/fontawesome5';
import Button from '@/components/Button';
import { useRef, useState, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from "expo-image";
import CircleButton from '@/components/CircleButton';
import IconButton from '@/components/IconButton';
import { EventEmitter } from 'events';
import { sendImageToApi } from '@/util/removeBackground';
import { rotateImage } from '@/util/rotateImage';
import { sendImageToComfyUI } from '@/util/comfyUI';
import { shirtWorkflow, shirtWorkflow2} from '@/util/workflows';
import { compressImage } from '@/util/compressImage';
import MyModule from "@/modules/my-module";
import { router } from 'expo-router';





export const dbEvents = new EventEmitter();

export default function Upload(){
    const [showUpload, setShowUpload] = useState<boolean>(false);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const ref = useRef<CameraView>(null);
    const [uri, setUri] = useState<string | null>(null);
    const[currentCategory, setCategory] = useState<string | null>(null);
    const localIP = "http://128.113.138.119:5000";
    // const [context, setContext] = useState<ImageManipulatorContext | null>(null);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
      }
    
      if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
          <View style={styles.container}>
            <Text>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} label="grant permission" />
          </View>
        );
      }
    const takePicture = async () => {
        const photo = await ref.current?.takePictureAsync();

        // if(photo){
        //   return photo;
        // }
        // should be in its own function (confirm button function after taking photo)
        if (photo){
            // setUri(photo?.uri);
            // console.log("lmao");
            console.log("Photo taken, compressing...");
            const compressedUri = await compressImage(photo.uri);

            if (currentCategory === "Shirt"){
              if(compressedUri){
                console.log("sending compressedURI")
                const subjectImageUrl = await MyModule.getSubjectImageURL(compressedUri);
                if(subjectImageUrl){
                  
                  router.push({
                    pathname: '/editScreen',
                    params: {
                      image: compressedUri,
                      subject: subjectImageUrl.toString(),
                    },
                  });
                  dummyDB.Shirt.push(subjectImageUrl.toString());
                  setUri(subjectImageUrl.toString())
                }
              } else{
                console.log("failed")
              }
            
              // if(compressedUri)
              // dummyDB.Shirt.push(compressedUri);
              

              // console.log("starting");
              // if (!compressedUri){
              //   console.error("Failed to compress image.");
              //   return;
              // }
              // console.log("wow");
              // const imageUri = await sendImageToComfyUI(compressedUri, shirtWorkflow2);
              // console.log("returned uri:", imageUri);
              // if(imageUri){
              
              // dummyDB.Shirt.push(imageUri)
              // // console.log(dummyDB);
              // if (imageUri!== "error")
              // setUri(imageUri);
              // } // Save processed image URI
              // ;
              
              // if(newPhoto){
              //   finalPhoto = await rotateImage(newPhoto);
              //   console.log("love");
              //   if(finalPhoto)
              //   dummyDB.Shirt.push(finalPhoto)
              // }
              
              // {finalPhoto ? (setUri(finalPhoto)) : (console.error())}


            }
            else if (currentCategory === "Socks"){
              let newPhoto = await sendImageToApi(photo.uri, localIP)
              if(newPhoto)
              dummyDB.Socks.push(newPhoto)
              setUri(newPhoto)
            }
            else if (currentCategory === "Pants"){
              let newPhoto = await sendImageToApi(photo.uri, localIP)
              if(newPhoto)
              dummyDB.Pants.push(newPhoto)
              setUri(newPhoto)
            }
            else if (currentCategory === "Jackets"){
              let newPhoto = await sendImageToApi(photo.uri, localIP)
              if(newPhoto)
              dummyDB.Jackets.push(newPhoto)
              setUri(newPhoto)
            }
            else if (currentCategory === "Shoes"){
              let newPhoto = await sendImageToApi(photo.uri, localIP)
              if(newPhoto)
              dummyDB.Shoes.push(newPhoto)
              setUri(newPhoto)
            }
            dbEvents.emit('dbUpdated', { currentCategory, uri });
        }
        // console.log(dummyDB);
    };

    // const pickImageAsync = async () => {
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //       mediaTypes: ['images'],
    //       allowsEditing: true,
    //       quality: 1,
    //     });
    
    //     if (!result.canceled) {
    //       setSelectedImage(result.assets[0].uri);
    //       setShowAppOptions(true);
    //     } else {
    //       alert('You did not select any image.');
    //     }
    //   };

      function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }
    async function upload(category: string){
        setShowUpload(true);
        setCategory(category);
        console.log(category);
        // const photo = await takePicture();
        // if (photo){
        //   if (currentCategory === "Shirt"){
        //     dummyDB.Shirt.push(photo.uri)
        //   }
        //   else if (currentCategory === "Socks"){
        //     dummyDB.Socks.push(photo.uri)
        //   }
        //   else if (currentCategory === "Pants"){
        //     dummyDB.Pants.push(photo.uri)
        //   }
        //   else if (currentCategory === "Jackets"){
        //     dummyDB.Jackets.push(photo.uri)
        //   }
        //   else if (currentCategory === "Shoes"){
        //     dummyDB.Shoes.push(photo.uri)
        //   }
        //   setUri(photo.uri);
        //   console.log("lmao");
        //   console.log(dummyDB);

        // }
         
        // else{
        //   // setShowUpload(false);
        //   // setUri(null);
        
        // }
    }

    function reset(){
        setShowUpload(false);
        setUri(null);
    }
    return (
        
        <View style = {styles.container}>
            <Text>Categories</Text>
            {uri ? (<View style = {styles.container}> 
                <Image
                source={{ uri }}
                contentFit="contain"
                style={{ aspectRatio: 1, width: 500}}/>
                <Button theme = 'standard' onPress={() => setUri(null)} label="Take another picture" /></View>) 
            : (showUpload ? ( 
            <CameraView style={styles.camera} facing={facing} ref={ref}> 
            {/* <View style = {styles.optionsContainer}>
            <View style = {styles.optionsRow}> */}
            <View style={styles.shutterContainer}>
            <IconButton icon = 'refresh' label = 'Reset' onPress = {reset} />
            <TouchableOpacity
            style={{
                borderWidth:1,
                borderColor:'rgba(0,0,0,0.2)',
                alignItems:'center',
                justifyContent:'center',
                width:100,
                height:100,
                backgroundColor:'#fff',
                borderRadius:50,
                }}
            >
            {/* <Icon name={"chevron-right"}  size={30} color="#01a699" /> */}
            <CircleButton onPress={takePicture}></CircleButton>
            </TouchableOpacity>
            <IconButton icon = 'flip' label = 'Flip' onPress = {toggleCameraFacing} />
            {/* </View>
            </View> */}
          </View>
          </CameraView> ) : (<View>
            <Button theme = 'standard' label="Shirt" onPress = {() => upload("Shirt")}></Button>
            <Button theme = 'standard' label="Pants" onPress = {() => upload("Pants")}></Button>
            <Button theme = 'standard' label="Shoes" onPress = {() => upload("Shoes")}></Button>
            <Button theme = 'standard' label="Socks" onPress = {() => upload("Socks")}></Button>
            <Button theme = 'standard' label="Jacket" onPress = {() => upload("Jackets")}></Button>
             </View>))}
            
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#000000',
    },
    camera: {
        flex: 1,
        width: "100%",
      },
    // buttonContainer: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     backgroundColor: 'transparent',
    //     margin: 64,
    //   },
    shutterContainer: {
        position: "absolute",
        bottom: 44,
        left: 0,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 30,
      },
      optionsContainer: {
        position: 'absolute',
        bottom: 80,
      },
      optionsRow: {
        alignItems: 'center',
        flexDirection: 'row',
      },
      
})

export var dummyDB: Record<"Shirt" | "Pants" | "Shoes" | "Socks" | "Jackets", string[]> = {
  Shirt: [],
  Jackets: [],
  Pants: [],
  Socks: [],
  Shoes: []
};