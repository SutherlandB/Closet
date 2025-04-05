import CollectionsRow from "@/components/CollectionsRow";
import { dummyDB, userClothes } from "./upload";
import {Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Button from "@/components/Button";
import { useState } from "react";

export default function Collections() {
    
    return (
        <GestureHandlerRootView style={styles.container}>
            <Text>Shirts</Text>
        <View style = {styles.container}>
            <CollectionsRow clothing = {userClothes.Shirt}></CollectionsRow>
        </View>
        <Text>Pants</Text>
        <View style = {styles.container}>
            <CollectionsRow clothing = {userClothes.Pants}></CollectionsRow>
        </View>
        <Text>Shoes</Text>
        <View style = {styles.container}>
            <CollectionsRow clothing = {userClothes.Shoes}></CollectionsRow>
        </View>
        <Text>Socks</Text>
        <View style = {styles.container}>
            <CollectionsRow clothing = {userClothes.Socks}></CollectionsRow>
        </View>
        <Text>Jackets</Text>
        <View style = {styles.container}>
            <CollectionsRow clothing = {userClothes.Jackets}></CollectionsRow>
        </View>
        </GestureHandlerRootView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00000',
        
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