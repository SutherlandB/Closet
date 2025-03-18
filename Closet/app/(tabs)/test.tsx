import {  Text, useWindowDimensions } from "react-native";
import { StyleSheet , View} from "react-native";
import { MyModuleView } from "@/modules/my-module";
import {StatusBar} from "expo-status-bar";


export default function Test(){
    const {width, height} = useWindowDimensions();

    return(
        <View style = {styles.container}>
            <StatusBar style = "auto"/>
            <Text>Hello</Text>
            <MyModuleView style = {{width, height: height / 1.1}} /> 

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