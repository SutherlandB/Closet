import {Text, View, StyleSheet, TouchableOpacity, Pressable, Modal, TextInput , KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '@/theme/color';
import { dummyDB } from '@/app/(tabs)/upload';
import { CameraCapturedPicture } from 'expo-camera';
import { Image } from "expo-image";
import Button from "@/components/Button";
import { useState, useRef, useEffect } from 'react';
import { dbEvents } from '@/app/(tabs)/upload';
import { ClothingItem } from '@/models/ClothingItem';
import { useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormControlErrorText } from '@gluestack-ui/config/build/theme';


type Props = {
    onPress?: () => void;
    label?: string;
    clothing: ClothingItem[];
  };


export default function CollectionsRow({ clothing, label, onPress }: Props) {
    const [currentImages, setCurrentImages] = useState(clothing)
    const [selectedImage, setSelectedImage] = useState<ClothingItem | null>(null);
    const [categoryText, setCategoryText] = useState('Useless Text');
    const [brandText, setBrandText] = useState('Useless Text');
    const [nameText, setNameText] = useState('Useless Text');
    const [colorText, setColorText] = useState('Useless Text');
    const [sizeText, setSizeText] = useState('Useless Text');
    const [refreshFlag, setRefreshFlag] = useState(0);
    const {width} = useWindowDimensions();
    const insets = useSafeAreaInsets();




    useEffect(() => {
        // Listen for dbUpdated events
        const handleDbUpdated = () => {

            setCurrentImages([...clothing]);
        };
    
        dbEvents.on('dbUpdated', handleDbUpdated);
    
        // Clean up listener on unmount
        return () => {
          dbEvents.off('dbUpdated', handleDbUpdated);
        };
      }, []);

    useEffect(() => {
      if (selectedImage) {
        setBrandText(selectedImage.brand || '');
        setCategoryText(selectedImage.category || '');
        setNameText(selectedImage.name || '');
        setColorText(selectedImage.color || '');
        setSizeText(selectedImage.size || '');
      }
    }, [selectedImage]);

    const handleUpdate = () => {
      if (!selectedImage) return;
    
      selectedImage.brand = brandText;
      selectedImage.category = categoryText;
      selectedImage.name = nameText;
      selectedImage.color = colorText;
      selectedImage.size = sizeText;
    
      // Optionally trigger some re-render or persist to DB
      
      dbEvents.emit('dbUpdated'); // optional event if you're syncing
      setSelectedImage(null); // close modal
    };

  return (
    
    <View >
    
      <ScrollView
        horizontal
        contentContainerStyle={[styles.scrollView]}
      >
        {currentImages.map((x, index) => (
          <Pressable key={index} onPress={() => setSelectedImage(x)}>
              <Image
                              key = {index}
                              source={{ uri: x.imageUri[x.display] }}
                              contentFit="contain"
                              style={{ aspectRatio: 1,
                                height: 100,
                                marginHorizontal: 6,
                                borderRadius: 8,
                              }}
                              />
                              </Pressable>
        ))}
      </ScrollView>
      
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
       <View
    style={{
      flex: 1,
      backgroundColor: 'rgba(247, 244, 244, 0.85)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
    
    }}>
        {/* <Pressable
          onPress={() => setSelectedImage(null)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(247, 244, 244, 0.85)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        > */}
          
          {selectedImage && (

          <ScrollView keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}
          contentContainerStyle={{
            alignItems: 'center',
            paddingVertical: 0,
            width: width
          }}
          style={{  width: width }}
        >
          
          {/* <View style = {{flex: 1, alignItems: 'center', width:'75%' }}> */}
          <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: insets.top, // ✅ keeps it below the Dynamic Island
                right: 10,
                zIndex: 10,
                backgroundColor: 'transparent',
                padding: 6,
              }}
            >
            <Ionicons name="close" size={32} color="black" />
          </TouchableOpacity>
          {/* <Pressable onPress={() => setSelectedImage(null)}> */}
            {/* <Image
              source={{ uri: selectedImage.imageUri[selectedImage.display] || '' }}
              contentFit="contain"
              style={{
                flex: 1,
                width: width,
                height: width*1.2,
                borderRadius: 12,
                marginBottom: 20,
              }}
            /> */}
            <Text style={{ fontSize: 14, color: 'black', marginBottom: 4, marginTop: 40 }}>
              Display
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              indicatorStyle="black"
              contentContainerStyle={{
                paddingHorizontal: 10,
                marginBottom: 20,
                marginLeft: 20,
                gap: 30,
                
              }}
              style={{ width: width }}
            >
              {selectedImage.imageUri.map((uri, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => {
                    // const updated = { ...selectedImage };
                    selectedImage.display = idx;
                    setSelectedImage(selectedImage);
                    setRefreshFlag(prev => prev + 1);
                  }
                }
                >
                  <Image
                    source={{ uri }}
                    contentFit="cover"
                    style={{
                      flex: 1,
                      width: width * 0.9,
                      height: width*1.1,
                      marginBottom: 15,
                      borderRadius: 8,
                      borderWidth: idx === selectedImage.display ? 1 : 0,
                      borderColor: idx === selectedImage.display ? '#000' : 'transparent',
                    }}
                  />
                </Pressable>
              ))}
            </ScrollView>
            {/* </Pressable> */}
            <Text style={{ fontSize: 14, color: 'gray', marginBottom: 4 }}>
              Brand
            </Text>
            <TextInput style = {{ marginTop: 5, color: 'black'}} onChangeText = {setBrandText} value = {brandText}/>
            <Text style={{ fontSize: 14, color: 'gray', marginBottom: 4 }}>
              Category
            </Text>
            <TextInput style = {{color: 'black'}} onChangeText = {setCategoryText} value = {categoryText}/>
            <Text style={{ marginTop: 15, fontSize: 14, color: 'gray', marginBottom: 4 }}>
              Name
            </Text>
            <TextInput style = {{color: 'black'}} onChangeText = {setNameText} value = {nameText}/>
            <Text style={{ marginTop: 15, fontSize: 14, color: 'gray', marginBottom: 4 }}>
              Color
            </Text>
            <TextInput style = {{color: 'black'}} onChangeText = {setColorText} value = {colorText}/>
            <Text style={{ marginTop: 15, fontSize: 14, color: 'gray', marginBottom: 4 }}>
              Size
            </Text>
            <TextInput style = {{color: 'black'}} onChangeText = {setSizeText} value = {sizeText}/>
          {/* </View> */}
          <TouchableOpacity
              onPress={handleUpdate}
              style={{
                marginTop: 20,
                backgroundColor: '#000',
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: 'white' }}>Save Changes</Text>
          </TouchableOpacity>
            </ScrollView> 
        )}    
        
        {/* </Pressable> */}
        </View> 
      </Modal>
      
    </View>
    // <View style={{flexDirection: 'row'}}>
    //   <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
    //     {images.map((uri, index) => (
    //       <Image key={index} source={{ uri }}  />
    //     ))}
    //   </ScrollView>
    // </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    justifyContent: 'center',
    flexDirection: 'row',
    height:100,
    color: colors.black,
    
  },
  nearbyStoresItems: {
    marginHorizontal: 2,
    borderColor: '#1D5098',
    color: colors.black,
  },
  nearbyStoresImages: {
    width: 80,
    height: 80,
    backgroundColor: 'gray'
  },
});