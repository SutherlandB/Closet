import { View, Text, Pressable, Dimensions } from "react-native";
import { Image } from "expo-image";
import { ScrollView, GestureHandlerRootView} from "react-native-gesture-handler";
// import { styles } from "@/components/CollectionsRow";
import { dummyDB, allClothes, userClothes } from "./upload"; 
import Carousel from 'react-native-reanimated-carousel';
import { useWindowDimensions } from "react-native";
const PlaceholderImage = require('@/assets/images/background-image.png');
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';



export default function Home(){
    const width = Dimensions.get('window').width
    // const {width, height} = useWindowDimensions();
    console.log(userClothes["Shirt"][0].imageUri[userClothes["Shirt"][0].display])
    console.log(width)
    return (
        <View style = {styles.container}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: "relative",
                backgroundColor: 'pink',
                height: width/3
                }}
                > 
                <Ionicons name="chevron-back" size={28} color="gray" style={{ position: 'absolute', left: 10, opacity: 0.5, marginRight: 0, zIndex: 2}} />

                <Carousel
                    width = {width}
                    height = {width}
                    data = { userClothes["Shirt"]}
                    renderItem={({item}) => (
                        <View style={{
                            width: width,
                            height: width,
                            justifyContent: 'center',
                            alignItems: 'center',
                            }}>
                            <Image
                                source={{ uri: item.imageUri[item.display] }}
                                style={styles.imgStyle}
                                contentFit= 'contain'

                            />
                        </View>
                    )}
                    />
                <Ionicons name="chevron-forward" size={28} color="gray" style={{ position: 'absolute', right: 10, opacity: 0.5, marginLeft: 0, zIndex: 2}} />
      
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: "relative"
                }}
                > 
                <Ionicons name="chevron-back" size={28} color="gray" style={{ position: 'absolute', left: 10, opacity: 0.5, marginRight: 0, zIndex: 2}} />

                <Carousel
                    width = {width}
                    height = {width}
                    data = { userClothes["Shirt"]}
                    renderItem={({item}) => (
                        <View style={{
                            width: width,
                            height: width,
                            justifyContent: 'center',
                            alignItems: 'center',
                            }}>
                            <Image
                                source={{ uri: item.imageUri[item.display] }}
                                style={styles.imgStyle}
                                contentFit= 'contain'

                            />
                        </View>
                    )}
                    />
                <Ionicons name="chevron-forward" size={28} color="gray" style={{ position: 'absolute', right: 10, opacity: 0.5, marginLeft: 0, zIndex: 2}} />
      
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {

        justifyContent: "center",
        alignItems: "center",
    },
    imgStyle: {
        width: "35%",
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',

        

    }
})