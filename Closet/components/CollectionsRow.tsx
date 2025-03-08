import {Text, View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from '@/theme/color';
import { dummyDB } from '@/app/(tabs)/upload';
import { CameraCapturedPicture } from 'expo-camera';
import { Image } from "expo-image";
import Button from "@/components/Button";
import { useState, useRef, useEffect } from 'react';
import { dbEvents } from '@/app/(tabs)/upload';

type Props = {
    onPress?: () => void;
    label?: string;
    images: string[];
  };


export default function CollectionsRow({ images, label, onPress }: Props) {
    console.log(images)
    const [lord,setLord] = useState<string>('io');
    const [currentImages, setCurrentImages] = useState(images)

    useEffect(() => {
        // Listen for dbUpdated events
        const handleDbUpdated = () => {

            setCurrentImages([...images]);
        };
    
        dbEvents.on('dbUpdated', handleDbUpdated);
    
        // Clean up listener on unmount
        return () => {
          dbEvents.off('dbUpdated', handleDbUpdated);
        };
      }, []);
  return (
    
    <View >
    
      <ScrollView
        horizontal
        contentContainerStyle={[styles.scrollView]}
      >
        {currentImages.map((uri, index) => (
              <Image
                              key = {index}
                              source={{ uri }}
                              contentFit="contain"
                              style={{ aspectRatio: 1}}
                              />
            
          
        ))}
      </ScrollView>
      
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