import {  Text, useWindowDimensions } from "react-native";
import { StyleSheet , View} from "react-native";
import { MyModuleView } from "@/modules/my-module";
import {StatusBar} from "expo-status-bar";
import { dummyDB } from "./upload";




export default function Test(){
    const {width, height} = useWindowDimensions();
    console.log(dummyDB.Shirt[0])
    
    return(
        <View style = {styles.container}>
            <StatusBar style = "auto"/>
            <Text>Hello</Text>
            <MyModuleView style = {{width, height: height / 1.1}} url = {dummyDB.Shirt[0]}/> 

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#00000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#000000',
    }
})