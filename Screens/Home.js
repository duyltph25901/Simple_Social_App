import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeComContainer, AddPostCom, Video, Admin, User } from '../Components/index'

import { getAuth, onAuthStateChanged } from 'firebase/auth'

const Home = () => {

    const Tab = createBottomTabNavigator()
    const [user, setUser] = useState({})
    const avatarAdmin = 'https://cdn-icons-png.flaticon.com/512/1/1819.png'
    const avatarUser = 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png'

    useEffect(() => {
        _getUserCurrent()
    }, [])

    const _getUserCurrent = () => {
        const auth = getAuth();
        onAuthStateChanged(auth, (userReturn) => {
            if (userReturn) {
                console.log(userReturn);
                setUser(userReturn)
            }
        });
    }

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="HomeComContainer" component={HomeComContainer}
                options={{
                    tabBarIcon: () => {
                        return (
                            <Image source={require('..//assets/home.png')}
                                style={styles.icon} />
                        )
                    }
                }} />
            {
                (user.email == 'a@gmail.com') && (
                    <Tab.Screen name="AddPostCom" component={AddPostCom}
                        options={{
                            tabBarIcon: () => {
                                return (
                                    <Image source={require('..//assets/more.png')}
                                        style={styles.icon} />
                                )
                            }
                        }} />
                )
            }
            <Tab.Screen name="Video" component={Video}
                options={{
                    tabBarIcon: () => {
                        return (
                            <Image source={require('..//assets/video.png')}
                                style={styles.icon} />
                        )
                    }
                }} />
            {
                (user.email == 'a@gmail.com') && (
                    <Tab.Screen name="Admin" component={Admin}
                        options={{
                            tabBarIcon: () => {
                                return (
                                    <Image source={{ uri: (user.photoURL) ? user.photoURL : avatarAdmin }}
                                        style={styles.icon} />
                                )
                            }
                        }} />
                )
            }
            {
                (user.email != 'a@gmail.com') && (
                    <Tab.Screen name="User" component={User}
                        options={{
                            tabBarIcon: () => {
                                return (
                                    <Image source={{ uri: (user.photoURL) ? user.photoURL : avatarUser }}
                                        style={styles.icon} />
                                )
                            }
                        }} />
                )
            }
        </Tab.Navigator>
    )
}

export default Home

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30,
    }
})