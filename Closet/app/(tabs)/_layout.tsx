import {Tabs} from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout(){
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#ffd33d',
            headerStyle: {
                backgroundColor: '#fffff',
            },
            headerShadowVisible: false,
            headerTintColor: '#000',
            tabBarStyle: {
                backgroundColor: '#25292e',
            },
        }}>
            <Tabs.Screen name = "index" options = {{title: "Closet", tabBarIcon: ({color, focused}) => (<Ionicons name = {focused ? 'home-sharp' : 'home-outline'} color = {color} size = {24} />)}} />
            <Tabs.Screen name = "collections" options = {{title: "Collections", tabBarIcon: ({color, focused}) => (<Ionicons name = {focused ? 'file-tray-stacked-sharp' : 'file-tray-stacked-outline'} color = {color} size = {24} />)}} />
            <Tabs.Screen name = "upload" options = {{title: "Upload", tabBarIcon: ({color, focused}) => (<Ionicons name = {focused ? 'cloud-upload-sharp' : 'cloud-upload-outline'} color = {color} size = {24} />)}} />
            <Tabs.Screen name = "about" options = {{title: "About", tabBarIcon: ({color, focused}) => (<Ionicons name = {focused ? 'information-circle' : 'information-circle-outline'} color = {color} size = {24} />)}} />
            <Tabs.Screen name = "test" options = {{title: "Test", tabBarIcon: ({color, focused}) => (<Ionicons name = {focused ? 'information-circle' : 'information-circle-outline'} color = {color} size = {24} />)}} />
        </Tabs>
    );
}